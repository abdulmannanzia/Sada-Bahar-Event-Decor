import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { getStore, saveStore } from './src/db/store.js';

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'sadabahar_event_decor_secret_key_2026';
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

interface AuthRequest extends Request {
  user?: { id: string; username: string; role: string };
}

function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  // Serve static uploaded files
  app.use('/uploads', express.static(UPLOADS_DIR));

  // --- PUBLIC API ROUTES ---

  // Get full public website data
  app.get('/api/public/data', async (req, res) => {
    try {
      const store = await getStore();
      const publicData = {
        settings: store.settings,
        contact: store.contact,
        social: store.social,
        homepage: store.homepage,
        services: [...store.services].sort((a, b) => a.order - b.order),
        categories: store.categories,
        projects: store.projects.filter(p => p.isPublished),
        reviews: store.reviews.filter(r => r.status === 'approved'),
        seo: store.seo,
        policies: store.policies,
      };
      res.json(publicData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch public website data' });
    }
  });

  // Get project by slug
  app.get('/api/public/project/:slug', async (req, res) => {
    try {
      const store = await getStore();
      const project = store.projects.find(p => p.slug === req.params.slug && p.isPublished);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch project details' });
    }
  });

  // Submit quick query
  app.post('/api/public/query', async (req, res) => {
    try {
      const { name, phone, message } = req.body;
      if (!name || !phone || !message) {
        return res.status(400).json({ error: 'Name, phone number, and message are required.' });
      }

      const store = await getStore();
      const newQuery = {
        id: 'query-' + Date.now(),
        name: String(name).trim(),
        phone: String(phone).trim(),
        message: String(message).trim(),
        createdAt: new Date().toISOString(),
        status: 'new' as const,
      };

      store.queries.unshift(newQuery);
      await saveStore(store);

      res.status(201).json({ success: true, message: 'Your query has been submitted successfully. We will contact you soon!' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to submit query' });
    }
  });

  // Submit customer feedback / review
  app.post('/api/public/feedback', async (req, res) => {
    try {
      const { customerName, eventCategory, rating, comment, photos } = req.body;
      if (!customerName || !eventCategory || !rating || !comment) {
        return res.status(400).json({ error: 'Customer name, event category, rating, and review comment are required.' });
      }

      const store = await getStore();
      const newReview = {
        id: 'rev-' + Date.now(),
        customerName: String(customerName).trim(),
        eventCategory: String(eventCategory).trim(),
        rating: Math.min(5, Math.max(1, Number(rating) || 5)),
        comment: String(comment).trim(),
        photos: Array.isArray(photos) ? photos : [],
        date: new Date().toISOString().split('T')[0],
        status: 'pending' as const, // Moderation queue
        isFeatured: false,
      };

      store.reviews.unshift(newReview);
      await saveStore(store);

      res.status(201).json({ success: true, message: 'Thank you! Your review has been submitted and will be displayed after approval.' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to submit review' });
    }
  });

  // --- AUTH ROUTES ---

  // Admin Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const store = await getStore();
      const admin = store.adminUsers.find(
        u => u.username.toLowerCase() === String(username).trim().toLowerCase()
      );

      if (!admin || admin.status === 'disabled') {
        return res.status(401).json({ error: 'Invalid admin credentials' });
      }

      const match = await bcrypt.compare(String(password), admin.passwordHash);
      if (!match) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
      }

      admin.lastLogin = new Date().toISOString();
      await saveStore(store);

      const token = jwt.sign(
        { id: admin.id, username: admin.username, role: admin.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: { id: admin.id, username: admin.username, role: admin.role },
      });
    } catch (err) {
      res.status(500).json({ error: 'Authentication error' });
    }
  });

  // Auth check
  app.get('/api/auth/me', requireAdmin, async (req: AuthRequest, res: Response) => {
    res.json({ user: req.user });
  });

  // Change password
  app.post('/api/auth/change-password', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long' });
      }

      const store = await getStore();
      const admin = store.adminUsers.find(u => u.id === req.user?.id);
      if (!admin) {
        return res.status(404).json({ error: 'User not found' });
      }

      const match = await bcrypt.compare(String(oldPassword), admin.passwordHash);
      if (!match) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      const salt = await bcrypt.genSalt(10);
      admin.passwordHash = await bcrypt.hash(String(newPassword), salt);
      await saveStore(store);

      res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update password' });
    }
  });

  // --- PROTECTED ADMIN CMS ROUTES ---

  // Get full admin dashboard data (including pending reviews, queries, media, users)
  app.get('/api/admin/data', requireAdmin, async (req, res) => {
    try {
      const store = await getStore();
      const safeStore = {
        ...store,
        adminUsers: store.adminUsers.map(u => ({
          id: u.id,
          username: u.username,
          role: u.role,
          status: u.status,
          createdAt: u.createdAt,
          lastLogin: u.lastLogin,
        })),
      };
      res.json(safeStore);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch admin data' });
    }
  });

  // Update Site Settings
  app.post('/api/admin/settings', requireAdmin, async (req, res) => {
    try {
      const store = await getStore();
      store.settings = { ...store.settings, ...req.body };
      await saveStore(store);
      res.json({ success: true, settings: store.settings });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save settings' });
    }
  });

  // Update Contact Info
  app.post('/api/admin/contact', requireAdmin, async (req, res) => {
    try {
      const store = await getStore();
      store.contact = { ...store.contact, ...req.body };
      await saveStore(store);
      res.json({ success: true, contact: store.contact });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save contact info' });
    }
  });

  // Update Social Links
  app.post('/api/admin/social', requireAdmin, async (req, res) => {
    try {
      const store = await getStore();
      store.social = { ...store.social, ...req.body };
      await saveStore(store);
      res.json({ success: true, social: store.social });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save social links' });
    }
  });

  // Update Homepage Content
  app.post('/api/admin/homepage', requireAdmin, async (req, res) => {
    try {
      const store = await getStore();
      store.homepage = { ...store.homepage, ...req.body };
      await saveStore(store);
      res.json({ success: true, homepage: store.homepage });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save homepage content' });
    }
  });

  // Manage Services (replace entire list or save)
  app.post('/api/admin/services', requireAdmin, async (req, res) => {
    try {
      const store = await getStore();
      if (Array.isArray(req.body.services)) {
        store.services = req.body.services;
        await saveStore(store);
        return res.json({ success: true, services: store.services });
      }
      res.status(400).json({ error: 'Invalid services payload' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save services' });
    }
  });

  // Manage Categories
  app.post('/api/admin/categories', requireAdmin, async (req, res) => {
    try {
      const store = await getStore();
      if (Array.isArray(req.body.categories)) {
        store.categories = req.body.categories;
        await saveStore(store);
        return res.json({ success: true, categories: store.categories });
      }
      res.status(400).json({ error: 'Invalid categories payload' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save categories' });
    }
  });

  // Manage Projects
  app.post('/api/admin/projects', requireAdmin, async (req, res) => {
    try {
      const store = await getStore();
      if (Array.isArray(req.body.projects)) {
        store.projects = req.body.projects;
        await saveStore(store);
        return res.json({ success: true, projects: store.projects });
      }
      res.status(400).json({ error: 'Invalid projects payload' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save projects' });
    }
  });

  // Single Project Save / Delete
  app.post('/api/admin/project/save', requireAdmin, async (req, res) => {
    try {
      const store = await getStore();
      const proj = req.body;
      if (!proj.title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      if (!proj.id) {
        proj.id = 'proj-' + Date.now();
        proj.createdAt = new Date().toISOString();
      }

      if (!proj.slug) {
        proj.slug = proj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      const existingIndex = store.projects.findIndex(p => p.id === proj.id);
      if (existingIndex >= 0) {
        store.projects[existingIndex] = proj;
      } else {
        store.projects.unshift(proj);
      }

      await saveStore(store);
      res.json({ success: true, project: proj });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save project' });
    }
  });

  app.delete('/api/admin/project/:id', requireAdmin, async (req, res) => {
    try {
      const store = await getStore();
      store.projects = store.projects.filter(p => p.id !== req.params.id);
      await saveStore(store);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  // Manage Reviews (approve, reject, delete, edit)
  app.post('/api/admin/reviews/save', requireAdmin, async (req, res) => {
    try {
      const store = await getStore();
      const rev = req.body;
      if (!rev.customerName || !rev.comment) {
        return res.status(400).json({ error: 'Customer name and comment are required' });
      }

      if (!rev.id) {
        rev.id = 'rev-' + Date.now();
        rev.date = new Date().toISOString().split('T')[0];
      }

      const existingIndex = store.reviews.findIndex(r => r.id === rev.id);
      if (existingIndex >= 0) {
        store.reviews[existingIndex] = { ...store.reviews[existingIndex], ...rev };
      } else {
        store.reviews.unshift(rev);
      }

      await saveStore(store);
      res.json({ success: true, review: rev });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save review' });
    }
  });

  app.post('/api/admin/reviews/update-status', requireAdmin, async (req, res) => {
    try {
      const { id, status, isFeatured } = req.body;
      const store = await getStore();
      const review = store.reviews.find(r => r.id === id);
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      if (status) review.status = status;
      if (typeof isFeatured === 'boolean') review.isFeatured = isFeatured;

      await saveStore(store);
      res.json({ success: true, review });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update review status' });
    }
  });

  app.delete('/api/admin/reviews/:id', requireAdmin, async (req, res) => {
    try {
      const store = await getStore();
      store.reviews = store.reviews.filter(r => r.id !== req.params.id);
      await saveStore(store);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete review' });
    }
  });

  // Manage Queries (update status, delete)
  app.post('/api/admin/queries/update-status', requireAdmin, async (req, res) => {
    try {
      const { id, status } = req.body;
      const store = await getStore();
      const query = store.queries.find(q => q.id === id);
      if (!query) {
        return res.status(404).json({ error: 'Query not found' });
      }

      query.status = status;
      await saveStore(store);
      res.json({ success: true, query });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update query status' });
    }
  });

  app.delete('/api/admin/queries/:id', requireAdmin, async (req, res) => {
    try {
      const store = await getStore();
      store.queries = store.queries.filter(q => q.id !== req.params.id);
      await saveStore(store);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete query' });
    }
  });

  // Upload Media / Image (supports Base64 payload or URL)
  app.post('/api/admin/media/upload', requireAdmin, async (req, res) => {
    try {
      const { base64Data, filename, mimeType } = req.body;
      if (!base64Data) {
        return res.status(400).json({ error: 'Base64 image data is required' });
      }

      const match = base64Data.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      const cleanBase64 = match ? match[2] : base64Data;
      const fileMime = match ? match[1] : (mimeType || 'image/jpeg');

      const ext = fileMime.includes('png') ? 'png' : fileMime.includes('webp') ? 'webp' : 'jpg';
      const safeName = (filename || 'image').replace(/[^a-zA-Z0-9_-]/g, '_') + '_' + Date.now() + '.' + ext;
      const filePath = path.join(UPLOADS_DIR, safeName);

      const buffer = Buffer.from(cleanBase64, 'base64');
      fs.writeFileSync(filePath, buffer);

      const fileUrl = `/uploads/${safeName}`;

      const store = await getStore();
      const mediaItem = {
        id: 'media-' + Date.now(),
        url: fileUrl,
        filename: safeName,
        size: buffer.length,
        mimeType: fileMime,
        createdAt: new Date().toISOString(),
      };

      store.media.unshift(mediaItem);
      await saveStore(store);

      res.status(201).json({ success: true, media: mediaItem });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload image asset' });
    }
  });

  app.delete('/api/admin/media/:id', requireAdmin, async (req, res) => {
    try {
      const store = await getStore();
      const media = store.media.find(m => m.id === req.params.id);
      if (media && media.url.startsWith('/uploads/')) {
        const localPath = path.join(process.cwd(), media.url);
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
      }

      store.media = store.media.filter(m => m.id !== req.params.id);
      await saveStore(store);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete media asset' });
    }
  });

  // SEO & Policies
  app.post('/api/admin/seo', requireAdmin, async (req, res) => {
    try {
      const store = await getStore();
      store.seo = { ...store.seo, ...req.body };
      await saveStore(store);
      res.json({ success: true, seo: store.seo });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save SEO settings' });
    }
  });

  app.post('/api/admin/policies', requireAdmin, async (req, res) => {
    try {
      const store = await getStore();
      store.policies = { ...store.policies, ...req.body };
      await saveStore(store);
      res.json({ success: true, policies: store.policies });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save policy content' });
    }
  });

  // Admin User Management
  app.post('/api/admin/users/create', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user?.role !== 'superadmin') {
        return res.status(403).json({ error: 'Only Super Admins can manage administrator accounts' });
      }

      const { username, password, role } = req.body;
      if (!username || !password || password.length < 6) {
        return res.status(400).json({ error: 'Username and password (min 6 chars) are required' });
      }

      const store = await getStore();
      if (store.adminUsers.some(u => u.username.toLowerCase() === String(username).trim().toLowerCase())) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(String(password), salt);

      const newUser = {
        id: 'admin-' + Date.now(),
        username: String(username).trim(),
        passwordHash,
        role: (role === 'editor' ? 'editor' : 'admin') as 'admin' | 'editor',
        status: 'active' as const,
        createdAt: new Date().toISOString(),
      };

      store.adminUsers.push(newUser);
      await saveStore(store);

      res.status(201).json({
        success: true,
        user: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
          status: newUser.status,
          createdAt: newUser.createdAt,
        },
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create admin user' });
    }
  });

  app.post('/api/admin/users/status', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user?.role !== 'superadmin') {
        return res.status(403).json({ error: 'Only Super Admins can modify account statuses' });
      }

      const { id, status } = req.body;
      const store = await getStore();
      const user = store.adminUsers.find(u => u.id === id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.status = status === 'disabled' ? 'disabled' : 'active';
      await saveStore(store);

      res.json({ success: true, user: { id: user.id, username: user.username, status: user.status } });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update user status' });
    }
  });

  // --- VITE / STATIC FILE HANDLING ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
