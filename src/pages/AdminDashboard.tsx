import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Home, FolderOpen, Image as ImageIcon, MessageSquare, 
  HelpCircle, PhoneCall, Globe, Settings, ShieldCheck, FileText, Users, 
  LogOut, Plus, Trash2, Edit3, CheckCircle, XCircle, Save, Upload, ExternalLink, 
  Eye, RefreshCw, Key, Sparkles, Filter, AlertTriangle, X 
} from 'lucide-react';
import { CMSData, PortfolioProject, Service, Review, ContactQuery, PortfolioCategory } from '../types.js';
import { 
  fetchAdminData, postAdminApi, deleteAdminApi, removeAdminToken 
} from '../api/client.js';
import { normalizeImageUrl } from '../lib/utils.js';

interface Props {
  onLogout: () => void;
  onNavigateHome: () => void;
}

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  helpText?: string;
}

const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "Image URL, Google Drive link, or upload file...",
  helpText,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        try {
          const res = await postAdminApi('media/upload', {
            base64Data: event.target.result as string,
            filename: file.name,
            mimeType: file.type,
          });
          if (res?.media?.url) {
            onChange(res.media.url);
          }
        } catch (err: any) {
          alert('Upload failed: ' + err.message);
        } finally {
          setUploading(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] uppercase text-gray-400 font-bold">{label}</label>
        {value && (
          <a
            href={normalizeImageUrl(value)}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] text-[#D4AF37] hover:underline flex items-center space-x-1 font-semibold"
          >
            <span>Preview Image</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {value && (
          <img
            src={normalizeImageUrl(value)}
            alt="Thumbnail"
            className="w-10 h-10 object-cover rounded-lg border border-gray-800 shrink-0 bg-black"
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
          />
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
        />
        <label className="bg-[#D4AF37] hover:bg-[#b8952d] text-black font-bold text-xs uppercase px-3.5 py-2.5 rounded-xl cursor-pointer flex items-center space-x-1.5 shrink-0 transition-colors shadow-sm">
          <Upload className="w-3.5 h-3.5" />
          <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
      </div>
      {helpText && <p className="text-[10px] text-gray-500">{helpText}</p>}
    </div>
  );
};

export const AdminDashboard: React.FC<Props> = ({ onLogout, onNavigateHome }) => {
  const [data, setData] = useState<CMSData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [saveMessage, setSaveMessage] = useState('');

  // Project Editor state
  const [editingProject, setEditingProject] = useState<Partial<PortfolioProject> | null>(null);

  // Review Editor state
  const [editingReview, setEditingReview] = useState<Partial<Review> | null>(null);

  // Custom Confirm Modal state
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  
  // Media Upload state
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Password Change state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState('');

  // New Admin User state
  const [newAdminUser, setNewAdminUser] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminData();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(''), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" />
          <span className="text-sm font-medium">Loading CMS Dashboard...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0B0B0B] border border-red-500/50 p-6 rounded-2xl text-center space-y-4">
          <h3 className="font-serif text-xl font-bold text-red-400">Session Error</h3>
          <p className="text-xs text-gray-400">{error || 'Unable to authenticate session'}</p>
          <button
            onClick={onLogout}
            className="bg-[#D4AF37] text-black font-bold text-xs uppercase px-6 py-2.5 rounded-xl"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // --- SAVE HANDLERS ---

  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postAdminApi('homepage', data.homepage);
      showNotification('Homepage content saved successfully!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postAdminApi('contact', data.contact);
      showNotification('Contact information updated successfully!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postAdminApi('social', data.social);
      showNotification('Social media links updated successfully!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postAdminApi('settings', data.settings);
      showNotification('Website settings updated successfully!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveSEO = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postAdminApi('seo', data.seo);
      showNotification('SEO settings updated successfully!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSavePolicies = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postAdminApi('policies', data.policies);
      showNotification('Terms & Privacy policies updated successfully!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Service Save / Delete
  const handleSaveServices = async (updatedServices: Service[]) => {
    try {
      const normalizedServices = updatedServices.map(s => ({
        ...s,
        image: normalizeImageUrl(s.image)
      }));
      await postAdminApi('services', { services: normalizedServices });
      setData({ ...data, services: normalizedServices });
      showNotification('Services updated successfully!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Category Save
  const handleSaveCategories = async (updatedCats: PortfolioCategory[]) => {
    try {
      await postAdminApi('categories', { categories: updatedCats });
      setData({ ...data, categories: updatedCats });
      showNotification('Categories updated successfully!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Project Save / Delete
  const handleSaveSingleProject = async (proj: Partial<PortfolioProject>) => {
    try {
      const normalizedProj = {
        ...proj,
        coverImage: proj.coverImage ? normalizeImageUrl(proj.coverImage) : '',
        galleryImages: (proj.galleryImages || []).map(img => normalizeImageUrl(img)),
      };
      await postAdminApi('project/save', normalizedProj);
      showNotification('Portfolio project saved successfully!');
      setEditingProject(null);
      loadData();
    } catch (err: any) {
      showNotification(`Error: ${err.message}`);
    }
  };

  const handleDeleteProject = (id: string, title?: string) => {
    setConfirmModal({
      title: 'Delete Portfolio Project',
      message: `Are you sure you want to delete "${title || 'this project'}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteAdminApi(`project/${id}`);
          showNotification('Portfolio project deleted successfully!');
          loadData();
        } catch (err: any) {
          showNotification(`Failed to delete: ${err.message}`);
        }
      }
    });
  };

  // Review Save / Status / Delete
  const handleSaveSingleReview = async (rev: Partial<Review>) => {
    try {
      await postAdminApi('reviews/save', rev);
      showNotification('Customer review saved successfully!');
      setEditingReview(null);
      loadData();
    } catch (err: any) {
      showNotification(`Error: ${err.message}`);
    }
  };

  const handleReviewStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await postAdminApi('reviews/update-status', { id, status });
      showNotification(`Review status updated to ${status}`);
      loadData();
    } catch (err: any) {
      showNotification(`Error: ${err.message}`);
    }
  };

  const handleDeleteReview = (id: string, customerName?: string) => {
    setConfirmModal({
      title: 'Delete Customer Review',
      message: `Are you sure you want to delete feedback from "${customerName || 'this customer'}"?`,
      onConfirm: async () => {
        try {
          await deleteAdminApi(`reviews/${id}`);
          showNotification('Review deleted successfully!');
          loadData();
        } catch (err: any) {
          showNotification(`Failed to delete: ${err.message}`);
        }
      }
    });
  };

  // Query status / delete
  const handleQueryStatus = async (id: string, status: string) => {
    try {
      await postAdminApi('queries/update-status', { id, status });
      showNotification('Query status updated');
      loadData();
    } catch (err: any) {
      showNotification(`Error: ${err.message}`);
    }
  };

  const handleDeleteQuery = (id: string, name?: string) => {
    setConfirmModal({
      title: 'Delete Contact Query',
      message: `Are you sure you want to delete inquiry from "${name || 'this contact'}"?`,
      onConfirm: async () => {
        try {
          await deleteAdminApi(`queries/${id}`);
          showNotification('Query deleted successfully!');
          loadData();
        } catch (err: any) {
          showNotification(`Failed to delete: ${err.message}`);
        }
      }
    });
  };

  // Upload Media Asset
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setUploadingMedia(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        try {
          await postAdminApi('media/upload', {
            base64Data: event.target.result as string,
            filename: file.name,
            mimeType: file.type,
          });
          showNotification('Media asset uploaded successfully!');
          loadData();
        } catch (err: any) {
          alert(err.message);
        } finally {
          setUploadingMedia(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload Multiple Gallery Images
  const handleGalleryFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !editingProject) return;
    const files: File[] = Array.from(e.target.files);
    setUploadingGallery(true);

    const uploadedUrls: string[] = [];

    for (const file of files) {
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const res = await postAdminApi('media/upload', {
          base64Data: base64,
          filename: file.name,
          mimeType: file.type,
        });

        if (res?.media?.url) {
          uploadedUrls.push(res.media.url);
        }
      } catch (err) {
        console.error('Failed to upload a gallery file', err);
      }
    }

    setUploadingGallery(false);
    if (uploadedUrls.length > 0) {
      const existing = editingProject.galleryImages || [];
      setEditingProject({
        ...editingProject,
        galleryImages: [...existing, ...uploadedUrls],
      });
      showNotification(`Uploaded ${uploadedUrls.length} new photos to gallery!`);
    }
  };

  const handleDeleteMedia = (id: string) => {
    setConfirmModal({
      title: 'Delete Image Asset',
      message: 'Are you sure you want to delete this media file?',
      onConfirm: async () => {
        try {
          await deleteAdminApi(`media/${id}`);
          showNotification('Media asset deleted');
          loadData();
        } catch (err: any) {
          showNotification(`Failed to delete: ${err.message}`);
        }
      }
    });
  };

  // Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg('');
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('sb_decor_admin_token')}`,
        },
        body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setPassMsg('Password changed successfully!');
      setOldPass('');
      setNewPass('');
    } catch (err: any) {
      setPassMsg(`Error: ${err.message}`);
    }
  };

  // Add Admin User
  const handleCreateAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postAdminApi('users/create', { username: newAdminUser, password: newAdminPass, role: 'admin' });
      showNotification(`Admin account '${newAdminUser}' created!`);
      setNewAdminUser('');
      setNewAdminPass('');
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'homepage', label: 'Homepage CMS', icon: Home },
    { id: 'services', label: 'Services', icon: FolderOpen },
    { id: 'portfolio', label: 'Portfolio Projects', icon: ImageIcon },
    { id: 'categories', label: 'Categories', icon: Filter },
    { id: 'feedback', label: 'Reviews', icon: MessageSquare },
    { id: 'queries', label: 'Contact Queries', icon: HelpCircle },
    { id: 'contact', label: 'Contact & Social', icon: PhoneCall },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'seo', label: 'SEO Settings', icon: Globe },
    { id: 'policies', label: 'Policies', icon: FileText },
    { id: 'users', label: 'Admin Users', icon: Users },
  ];

  const pendingReviewsCount = data.reviews.filter(r => r.status === 'pending').length;
  const newQueriesCount = data.queries.filter(q => q.status === 'new').length;

  return (
    <div className="min-h-screen bg-[#070707] text-gray-200 flex flex-col lg:flex-row font-sans">
      
      {/* Sidebar Nav */}
      <aside className="w-full lg:w-64 bg-[#0B0B0B] border-r border-gray-800 shrink-0 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div>
              <span className="font-serif font-bold text-lg text-[#FAF8F3] block">SADA BAHAR</span>
              <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-semibold block">CMS Admin Portal</span>
            </div>
            <button
              onClick={onNavigateHome}
              className="p-2 text-gray-400 hover:text-white"
              title="View Public Site"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                  id={`admin-tab-${tab.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>

                  {tab.id === 'feedback' && pendingReviewsCount > 0 && (
                    <span className="bg-amber-500 text-black font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {pendingReviewsCount}
                    </span>
                  )}

                  {tab.id === 'queries' && newQueriesCount > 0 && (
                    <span className="bg-red-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {newQueriesCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
            id="admin-logout-btn"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        
        {/* Notification Banner */}
        {saveMessage && (
          <div className="mb-6 bg-[#25D366]/20 border border-[#25D366] text-[#25D366] px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between animate-fadeIn">
            <span>{saveMessage}</span>
            <CheckCircle className="w-4 h-4" />
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#FAF8F3]">Dashboard Overview</h1>
              <p className="text-xs text-gray-400">Welcome to Sada Bahar Event & Decor CMS Management System</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#0B0B0B] border border-gray-800 p-6 rounded-2xl space-y-2">
                <span className="text-xs uppercase text-gray-400 font-semibold">Total Projects</span>
                <p className="text-3xl font-bold text-[#D4AF37]">{data.projects.length}</p>
                <span className="text-[10px] text-gray-500 block">Published portfolio works</span>
              </div>

              <div className="bg-[#0B0B0B] border border-gray-800 p-6 rounded-2xl space-y-2">
                <span className="text-xs uppercase text-gray-400 font-semibold">Approved Reviews</span>
                <p className="text-3xl font-bold text-[#25D366]">{data.reviews.filter(r => r.status === 'approved').length}</p>
                {pendingReviewsCount > 0 && (
                  <span className="text-[11px] text-amber-400 font-bold block">
                    {pendingReviewsCount} pending approval
                  </span>
                )}
              </div>

              <div className="bg-[#0B0B0B] border border-gray-800 p-6 rounded-2xl space-y-2">
                <span className="text-xs uppercase text-gray-400 font-semibold">Contact Queries</span>
                <p className="text-3xl font-bold text-sky-400">{data.queries.length}</p>
                {newQueriesCount > 0 && (
                  <span className="text-[11px] text-red-400 font-bold block">
                    {newQueriesCount} new unread queries
                  </span>
                )}
              </div>

              <div className="bg-[#0B0B0B] border border-gray-800 p-6 rounded-2xl space-y-2">
                <span className="text-xs uppercase text-gray-400 font-semibold">Media Assets</span>
                <p className="text-3xl font-bold text-purple-400">{data.media.length}</p>
                <span className="text-[10px] text-gray-500 block">Images in repository</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#0B0B0B] border border-gray-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#FAF8F3]">Quick CMS Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setEditingProject({ title: '', description: '', location: '', coverImage: '', galleryImages: [], isPublished: true, isFeatured: false });
                    setActiveTab('portfolio');
                  }}
                  className="bg-[#D4AF37] text-black font-bold text-xs uppercase px-4 py-2.5 rounded-xl flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Portfolio Project</span>
                </button>

                <button
                  onClick={() => setActiveTab('feedback')}
                  className="bg-white/10 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl flex items-center space-x-2 border border-gray-700"
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>Moderate Pending Reviews ({pendingReviewsCount})</span>
                </button>

                <button
                  onClick={() => setActiveTab('queries')}
                  className="bg-white/10 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl flex items-center space-x-2 border border-gray-700"
                >
                  <HelpCircle className="w-4 h-4 text-red-400" />
                  <span>View Customer Queries ({newQueriesCount})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HOMEPAGE CMS */}
        {activeTab === 'homepage' && (
          <form onSubmit={handleSaveHomepage} className="space-y-8 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#FAF8F3]">Homepage Content Management</h1>
                <p className="text-xs text-gray-400">Edit hero banner text, image, owner information, and why choose us cards</p>
              </div>
              <button
                type="submit"
                className="bg-[#D4AF37] text-black font-bold text-xs uppercase px-6 py-2.5 rounded-xl flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Homepage Changes</span>
              </button>
            </div>

            {/* Hero Section Form */}
            <div className="bg-[#0B0B0B] border border-gray-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#D4AF37]">Hero Section Settings</h3>

              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Hero Heading</label>
                <input
                  type="text"
                  value={data.homepage.heroHeading}
                  onChange={(e) => setData({ ...data, homepage: { ...data.homepage, heroHeading: e.target.value } })}
                  className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Hero Description</label>
                <textarea
                  rows={3}
                  value={data.homepage.heroSubheading}
                  onChange={(e) => setData({ ...data, homepage: { ...data.homepage, heroSubheading: e.target.value } })}
                  className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <ImageUploadInput
                label="Hero Background Image"
                value={data.homepage.heroImage}
                onChange={(url) => setData({ ...data, homepage: { ...data.homepage, heroImage: url } })}
                helpText="Direct URL, Google Drive link, or click 'Upload Image' to choose a photo from your device"
              />

              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Hero Primary Button CTA Text</label>
                <input
                  type="text"
                  value={data.homepage.heroCtaText}
                  onChange={(e) => setData({ ...data, homepage: { ...data.homepage, heroCtaText: e.target.value } })}
                  className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Meet the Owner Section */}
            <div className="bg-[#0B0B0B] border border-gray-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#D4AF37]">Meet the Owner & Leadership Section</h3>

              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Owner Name</label>
                <input
                  type="text"
                  value={data.homepage.owner?.name || ''}
                  onChange={(e) => setData({
                    ...data,
                    homepage: {
                      ...data.homepage,
                      owner: { ...data.homepage.owner, name: e.target.value }
                    }
                  })}
                  className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2 text-sm text-white"
                />
              </div>

              <ImageUploadInput
                label="Owner Portrait Photo"
                value={data.homepage.owner?.photo || ''}
                onChange={(url) => setData({
                  ...data,
                  homepage: {
                    ...data.homepage,
                    owner: { ...data.homepage.owner, photo: url }
                  }
                })}
                helpText="Portrait image of Humza (Owner). Supports uploaded photos & Google Drive links."
              />

              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Biography</label>
                <textarea
                  rows={4}
                  value={data.homepage.owner?.biography || ''}
                  onChange={(e) => setData({
                    ...data,
                    homepage: {
                      ...data.homepage,
                      owner: { ...data.homepage.owner, biography: e.target.value }
                    }
                  })}
                  className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Vision</label>
                  <textarea
                    rows={2}
                    value={data.homepage.owner?.vision || ''}
                    onChange={(e) => setData({
                      ...data,
                      homepage: {
                        ...data.homepage,
                        owner: { ...data.homepage.owner, vision: e.target.value }
                      }
                    })}
                    className="w-full bg-black border border-gray-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Mission</label>
                  <textarea
                    rows={2}
                    value={data.homepage.owner?.mission || ''}
                    onChange={(e) => setData({
                      ...data,
                      homepage: {
                        ...data.homepage,
                        owner: { ...data.homepage.owner, mission: e.target.value }
                      }
                    })}
                    className="w-full bg-black border border-gray-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Why Customers Should Trust Sada Bahar</label>
                <input
                  type="text"
                  value={data.homepage.owner?.whyTrustUs || ''}
                  onChange={(e) => setData({
                    ...data,
                    homepage: {
                      ...data.homepage,
                      owner: { ...data.homepage.owner, whyTrustUs: e.target.value }
                    }
                  })}
                  className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2 text-sm text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#D4AF37] text-black font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider"
            >
              Save All Homepage Changes
            </button>
          </form>
        )}

        {/* TAB 3: SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#FAF8F3]">Services & WhatsApp Channels</h1>
                <p className="text-xs text-gray-400">Manage services and configure dedicated WhatsApp channel links for each service</p>
              </div>
              <button
                onClick={() => {
                  const newService: Service = {
                    id: 'service-' + Date.now(),
                    title: 'New Service',
                    shortDescription: 'Short description of service',
                    longDescription: 'Full detailed description of service',
                    image: '/src/assets/images/event_management_decor_1786558863288.jpg',
                    whatsappChannelUrl: 'https://wa.me/923339161630',
                    order: data.services.length + 1,
                  };
                  handleSaveServices([...data.services, newService]);
                }}
                className="bg-[#D4AF37] text-black font-bold text-xs uppercase px-4 py-2.5 rounded-xl flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="space-y-6">
              {data.services.map((serv, idx) => (
                <div key={serv.id} className="bg-[#0B0B0B] border border-gray-800 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <span className="font-serif font-bold text-[#D4AF37]">Service #{idx + 1}</span>
                    <button
                      onClick={() => {
                        const filtered = data.services.filter(s => s.id !== serv.id);
                        handleSaveServices(filtered);
                      }}
                      className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Service</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase text-gray-400 font-bold mb-1">Service Title</label>
                      <input
                        type="text"
                        value={serv.title}
                        onChange={(e) => {
                          const copy = [...data.services];
                          copy[idx].title = e.target.value;
                          setData({ ...data, services: copy });
                        }}
                        className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                      />
                    </div>

                    <ImageUploadInput
                      label="Service Image"
                      value={serv.image}
                      onChange={(url) => {
                        const copy = [...data.services];
                        copy[idx].image = url;
                        setData({ ...data, services: copy });
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase text-gray-400 font-bold mb-1">Short Description</label>
                    <input
                      type="text"
                      value={serv.shortDescription}
                      onChange={(e) => {
                        const copy = [...data.services];
                        copy[idx].shortDescription = e.target.value;
                        setData({ ...data, services: copy });
                      }}
                      className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase text-[#25D366] font-bold mb-1">
                      Dedicated WhatsApp Channel Link for this Service
                    </label>
                    <input
                      type="text"
                      value={serv.whatsappChannelUrl}
                      onChange={(e) => {
                        const copy = [...data.services];
                        copy[idx].whatsappChannelUrl = e.target.value;
                        setData({ ...data, services: copy });
                      }}
                      placeholder="https://wa.me/923339161630?text=..."
                      className="w-full bg-black border border-[#25D366]/40 rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSaveServices(data.services)}
              className="w-full bg-[#D4AF37] text-black font-bold py-3.5 rounded-xl text-xs uppercase"
            >
              Save Services List
            </button>
          </div>
        )}

        {/* TAB 4: PORTFOLIO PROJECTS */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#FAF8F3]">Portfolio Management</h1>
                <p className="text-xs text-gray-400">Create, edit, publish, feature, or delete event stage & decor projects</p>
              </div>
              <button
                onClick={() => setEditingProject({
                  title: '',
                  categoryId: data.categories[0]?.id || 'cat-weddings',
                  categoryName: data.categories[0]?.name || 'Weddings',
                  description: '',
                  location: 'Pakistan',
                  eventDate: new Date().toISOString().split('T')[0],
                  coverImage: '/src/assets/images/hero_wedding_stage_1786553883457.jpg',
                  galleryImages: ['/src/assets/images/hero_wedding_stage_1786553883457.jpg'],
                  isPublished: true,
                  isFeatured: false,
                })}
                className="bg-[#D4AF37] text-black font-bold text-xs uppercase px-4 py-2.5 rounded-xl flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Project</span>
              </button>
            </div>

            {/* Project Edit Modal / Drawer */}
            {editingProject && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-[#0B0B0B] border-2 border-[#D4AF37] max-w-2xl w-full p-6 rounded-2xl space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <h3 className="font-serif font-bold text-lg text-[#D4AF37]">
                      {editingProject.id ? 'Edit Project' : 'New Project'}
                    </h3>
                    <button
                      onClick={() => setEditingProject(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase text-gray-400 font-bold mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.title || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase text-gray-400 font-bold mb-1">Category *</label>
                    <select
                      value={editingProject.categoryId || ''}
                      onChange={(e) => {
                        const cat = data.categories.find(c => c.id === e.target.value);
                        setEditingProject({
                          ...editingProject,
                          categoryId: e.target.value,
                          categoryName: cat?.name || ''
                        });
                      }}
                      className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                    >
                      {data.categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase text-gray-400 font-bold mb-1">Location</label>
                    <input
                      type="text"
                      value={editingProject.location || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                      className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase text-gray-400 font-bold mb-1">Event Date</label>
                    <input
                      type="date"
                      value={editingProject.eventDate || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, eventDate: e.target.value })}
                      className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <ImageUploadInput
                  label="Project Cover Image"
                  value={editingProject.coverImage || ''}
                  onChange={(url) => setEditingProject({ ...editingProject, coverImage: url })}
                  helpText="Main thumbnail image displayed in portfolio grids"
                />

                <div className="space-y-2 border border-gray-800 p-4 rounded-xl bg-black/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-[11px] uppercase text-gray-400 font-bold">
                        Project Gallery Photos ({editingProject.galleryImages?.length || 0})
                      </label>
                      <p className="text-[10px] text-gray-500">Upload multiple photos or paste image / Google Drive links below</p>
                    </div>

                    <label className="bg-[#D4AF37] hover:bg-[#b8952d] text-black font-bold text-xs uppercase px-3.5 py-2 rounded-xl cursor-pointer flex items-center space-x-1.5 transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingGallery ? 'Uploading Photos...' : 'Upload Photos'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryFilesUpload}
                        className="hidden"
                        disabled={uploadingGallery}
                      />
                    </label>
                  </div>

                  {/* Visual Thumbnails Grid */}
                  {editingProject.galleryImages && editingProject.galleryImages.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2 pt-2">
                      {editingProject.galleryImages.map((img, i) => (
                        <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-800 bg-black aspect-square">
                          <img
                            src={normalizeImageUrl(img)}
                            alt={`Gallery item ${i + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLElement).style.opacity = '0.3'; }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingProject.galleryImages || []).filter((_, idx) => idx !== i);
                              setEditingProject({ ...editingProject, galleryImages: updated });
                            }}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition-colors"
                            title="Remove Photo"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <textarea
                    rows={2}
                    placeholder="Paste image URLs or Google Drive share links separated by commas..."
                    value={(editingProject.galleryImages || []).join(', ')}
                    onChange={(e) => setEditingProject({
                      ...editingProject,
                      galleryImages: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    className="w-full bg-black border border-gray-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-gray-400 font-bold mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm text-white"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.isPublished ?? true}
                      onChange={(e) => setEditingProject({ ...editingProject, isPublished: e.target.checked })}
                      className="rounded accent-[#D4AF37]"
                    />
                    <span>Published</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.isFeatured ?? false}
                      onChange={(e) => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                      className="rounded accent-[#D4AF37]"
                    />
                    <span>Feature on Homepage</span>
                  </label>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={() => handleSaveSingleProject(editingProject)}
                    className="flex-1 bg-[#D4AF37] hover:bg-[#b8952d] text-black font-bold py-3 rounded-xl text-xs uppercase transition-colors"
                  >
                    Save Project
                  </button>
                  <button
                    onClick={() => setEditingProject(null)}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-5 py-3 rounded-xl text-xs uppercase transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Projects List */}
          <div className="space-y-4">
            {data.projects.map((proj) => (
              <div key={proj.id} className="bg-[#0B0B0B] border border-gray-800 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-gray-700 transition-colors">
                <div className="flex items-center space-x-4">
                  <img
                    src={normalizeImageUrl(proj.coverImage)}
                    alt={proj.title}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-800 shrink-0"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <div>
                    <h4 className="font-serif font-bold text-white text-base">{proj.title}</h4>
                    <span className="text-[10px] text-[#D4AF37] uppercase font-bold">{proj.categoryName} • {proj.location}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingProject(proj)}
                    className="p-2.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
                    title="Edit Project"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProject(proj.id, proj.title)}
                    className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          </div>
        )}

        {/* TAB 5: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#FAF8F3]">Portfolio Categories</h1>
                <p className="text-xs text-gray-400">Add, rename, or remove event categories</p>
              </div>
              <button
                onClick={() => {
                  const newCat: PortfolioCategory = {
                    id: 'cat-' + Date.now(),
                    name: 'New Category',
                    slug: 'new-category-' + Date.now(),
                  };
                  handleSaveCategories([...data.categories, newCat]);
                }}
                className="bg-[#D4AF37] text-black font-bold text-xs uppercase px-4 py-2 rounded-xl flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.categories.map((cat, idx) => (
                <div key={cat.id} className="bg-[#0B0B0B] border border-gray-800 p-3 rounded-xl flex items-center justify-between gap-4">
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) => {
                      const copy = [...data.categories];
                      copy[idx].name = e.target.value;
                      copy[idx].slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      setData({ ...data, categories: copy });
                    }}
                    className="bg-black border border-gray-800 rounded-lg px-3 py-1.5 text-sm text-white w-full max-w-xs"
                  />
                  <button
                    onClick={() => {
                      const filtered = data.categories.filter(c => c.id !== cat.id);
                      handleSaveCategories(filtered);
                    }}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSaveCategories(data.categories)}
              className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-xl text-xs uppercase"
            >
              Save Categories
            </button>
          </div>
        )}

        {/* TAB 6: FEEDBACK / REVIEWS MODERATION */}
        {activeTab === 'feedback' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#FAF8F3]">Customer Reviews Moderation</h1>
                <p className="text-xs text-gray-400">Edit, approve, reject, or delete customer feedback submissions</p>
              </div>
              <button
                onClick={() => setEditingReview({
                  customerName: '',
                  eventCategory: 'Wedding Stage',
                  rating: 5,
                  comment: '',
                  status: 'approved',
                  date: new Date().toISOString().split('T')[0],
                })}
                className="bg-[#D4AF37] hover:bg-[#b8952d] text-black font-bold text-xs uppercase px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Review</span>
              </button>
            </div>

            {/* Review Edit Modal Overlay */}
            {editingReview && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-[#0B0B0B] border-2 border-[#D4AF37] max-w-lg w-full p-6 rounded-2xl space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <h3 className="font-serif font-bold text-lg text-[#D4AF37]">
                      {editingReview.id ? 'Edit Customer Review' : 'Add New Review'}
                    </h3>
                    <button onClick={() => setEditingReview(null)} className="text-gray-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase text-gray-400 font-bold mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={editingReview.customerName || ''}
                      onChange={(e) => setEditingReview({ ...editingReview, customerName: e.target.value })}
                      className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase text-gray-400 font-bold mb-1">Event Category</label>
                      <input
                        type="text"
                        value={editingReview.eventCategory || ''}
                        onChange={(e) => setEditingReview({ ...editingReview, eventCategory: e.target.value })}
                        className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                        placeholder="e.g. Wedding Stage"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase text-gray-400 font-bold mb-1">Rating</label>
                      <select
                        value={editingReview.rating || 5}
                        onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                        className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      >
                        {[5, 4, 3, 2, 1].map(r => (
                          <option key={r} value={r}>{r} Stars</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase text-gray-400 font-bold mb-1">Review Comment *</label>
                    <textarea
                      rows={4}
                      required
                      value={editingReview.comment || ''}
                      onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                      className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase text-gray-400 font-bold mb-1">Moderation Status</label>
                    <select
                      value={editingReview.status || 'approved'}
                      onChange={(e) => setEditingReview({ ...editingReview, status: e.target.value as any })}
                      className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="approved">Approved & Published</option>
                      <option value="pending">Pending Review</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      onClick={() => handleSaveSingleReview(editingReview)}
                      className="flex-1 bg-[#D4AF37] hover:bg-[#b8952d] text-black font-bold py-3 rounded-xl text-xs uppercase transition-colors"
                    >
                      Save Review
                    </button>
                    <button
                      onClick={() => setEditingReview(null)}
                      className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-5 py-3 rounded-xl text-xs uppercase transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {data.reviews.map((rev) => (
                <div key={rev.id} className="bg-[#0B0B0B] border border-gray-800 p-6 rounded-2xl space-y-3 hover:border-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-white text-base">{rev.customerName}</h4>
                      <span className="text-xs text-[#D4AF37] font-semibold">{rev.eventCategory} • {rev.rating} / 5 Stars</span>
                    </div>

                    <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                      rev.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      rev.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {rev.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 italic whitespace-pre-line">"{rev.comment}"</p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-900">
                    <span className="text-[10px] text-gray-500">{rev.date}</span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingReview(rev)}
                        className="bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors"
                        title="Edit Feedback"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => handleReviewStatus(rev.id, 'approved')}
                          className="bg-green-500/20 text-green-400 hover:bg-green-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          onClick={() => handleReviewStatus(rev.id, 'rejected')}
                          className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReview(rev.id, rev.customerName)}
                        className="bg-red-500/20 text-red-400 hover:bg-red-500/30 p-2 rounded-lg text-xs transition-colors"
                        title="Delete Feedback"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: CONTACT QUERIES */}
        {activeTab === 'queries' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#FAF8F3]">Contact Inquiries & Submissions</h1>
              <p className="text-xs text-gray-400">View quick query submissions from customers</p>
            </div>

            <div className="space-y-4">
              {data.queries.map((q) => (
                <div key={q.id} className="bg-[#0B0B0B] border border-gray-800 p-6 rounded-2xl space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-white text-base">{q.name}</h4>
                      <a href={`tel:${q.phone}`} className="text-xs text-[#D4AF37] font-bold block">{q.phone}</a>
                    </div>
                    <span className="text-[10px] text-gray-400">{new Date(q.createdAt).toLocaleString()}</span>
                  </div>

                  <p className="text-xs text-gray-300 bg-black/50 p-3 rounded-xl border border-gray-900">{q.message}</p>

                  <div className="flex items-center justify-between pt-2">
                    <select
                      value={q.status}
                      onChange={(e) => handleQueryStatus(q.id, e.target.value)}
                      className="bg-black border border-gray-800 rounded-lg px-2.5 py-1 text-xs text-white"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="completed">Completed</option>
                      <option value="archived">Archived</option>
                    </select>

                    <button
                      onClick={() => handleDeleteQuery(q.id, q.name)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs transition-colors"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: CONTACT & SOCIAL */}
        {activeTab === 'contact' && (
          <div className="space-y-8 max-w-4xl">
            <form onSubmit={handleSaveContact} className="bg-[#0B0B0B] border border-gray-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#D4AF37]">Contact Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Stage Phone</label>
                  <input
                    type="text"
                    value={data.contact.stagePhone}
                    onChange={(e) => setData({ ...data, contact: { ...data.contact, stagePhone: e.target.value } })}
                    className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Shop Phone</label>
                  <input
                    type="text"
                    value={data.contact.shopPhone}
                    onChange={(e) => setData({ ...data, contact: { ...data.contact, shopPhone: e.target.value } })}
                    className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={data.contact.whatsapp}
                  onChange={(e) => setData({ ...data, contact: { ...data.contact, whatsapp: e.target.value } })}
                  className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Office Address</label>
                <textarea
                  rows={2}
                  value={data.contact.address}
                  onChange={(e) => setData({ ...data, contact: { ...data.contact, address: e.target.value } })}
                  className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Business Hours</label>
                <input
                  type="text"
                  value={data.contact.businessHours}
                  onChange={(e) => setData({ ...data, contact: { ...data.contact, businessHours: e.target.value } })}
                  className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Google Maps Embed iframe URL</label>
                <input
                  type="text"
                  value={data.contact.googleMapEmbed}
                  onChange={(e) => setData({ ...data, contact: { ...data.contact, googleMapEmbed: e.target.value } })}
                  className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button type="submit" className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-xl text-xs uppercase">
                Save Contact Info
              </button>
            </form>

            <form onSubmit={handleSaveSocial} className="bg-[#0B0B0B] border border-gray-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#D4AF37]">Social Media Links</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Instagram</label>
                  <input
                    type="text"
                    value={data.social.instagram}
                    onChange={(e) => setData({ ...data, social: { ...data.social, instagram: e.target.value } })}
                    className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">TikTok</label>
                  <input
                    type="text"
                    value={data.social.tiktok}
                    onChange={(e) => setData({ ...data, social: { ...data.social, tiktok: e.target.value } })}
                    className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Facebook</label>
                  <input
                    type="text"
                    value={data.social.facebook}
                    onChange={(e) => setData({ ...data, social: { ...data.social, facebook: e.target.value } })}
                    className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">YouTube</label>
                  <input
                    type="text"
                    value={data.social.youtube}
                    onChange={(e) => setData({ ...data, social: { ...data.social, youtube: e.target.value } })}
                    className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-xl text-xs uppercase">
                Save Social Links
              </button>
            </form>
          </div>
        )}

        {/* TAB 9: MEDIA LIBRARY */}
        {activeTab === 'media' && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#FAF8F3]">Centralized Media Library</h1>
                <p className="text-xs text-gray-400">Upload and manage image assets for projects, services, and homepage</p>
              </div>

              <label className="bg-[#D4AF37] text-black font-bold text-xs uppercase px-4 py-2.5 rounded-xl cursor-pointer flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>{uploadingMedia ? 'Uploading...' : 'Upload Image'}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {data.media.map((item) => (
                <div key={item.id} className="bg-[#0B0B0B] border border-gray-800 rounded-xl overflow-hidden group relative">
                  <img src={item.url} alt={item.filename} className="w-full h-32 object-cover" />
                  <div className="p-2 text-[10px] text-gray-400 truncate">{item.filename}</div>

                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 p-2">
                    <button
                      onClick={() => { navigator.clipboard.writeText(item.url); alert('URL Copied to clipboard!'); }}
                      className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded"
                    >
                      Copy URL
                    </button>
                    <button
                      onClick={() => handleDeleteMedia(item.id)}
                      className="bg-red-500 text-white p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: SETTINGS */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
            <h1 className="font-serif text-2xl font-bold text-[#FAF8F3]">Website Settings</h1>

            <div className="bg-[#0B0B0B] border border-gray-800 p-6 rounded-2xl space-y-4">
              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Business Name</label>
                <input
                  type="text"
                  value={data.settings.siteName}
                  onChange={(e) => setData({ ...data, settings: { ...data.settings, siteName: e.target.value } })}
                  className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Tagline</label>
                <input
                  type="text"
                  value={data.settings.tagline}
                  onChange={(e) => setData({ ...data, settings: { ...data.settings, tagline: e.target.value } })}
                  className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Logo URL</label>
                <input
                  type="text"
                  value={data.settings.logo}
                  onChange={(e) => setData({ ...data, settings: { ...data.settings, logo: e.target.value } })}
                  className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Footer Copyright Text</label>
                <input
                  type="text"
                  value={data.settings.copyrightText}
                  onChange={(e) => setData({ ...data, settings: { ...data.settings, copyrightText: e.target.value } })}
                  className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-xl text-xs uppercase">
              Save Website Settings
            </button>
          </form>
        )}

        {/* TAB 11: SEO */}
        {activeTab === 'seo' && (
          <form onSubmit={handleSaveSEO} className="space-y-6 max-w-3xl">
            <h1 className="font-serif text-2xl font-bold text-[#FAF8F3]">SEO & Search Engine Settings</h1>

            <div className="bg-[#0B0B0B] border border-gray-800 p-6 rounded-2xl space-y-4">
              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Meta Title</label>
                <input
                  type="text"
                  value={data.seo.metaTitle}
                  onChange={(e) => setData({ ...data, seo: { ...data.seo, metaTitle: e.target.value } })}
                  className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={data.seo.metaDescription}
                  onChange={(e) => setData({ ...data, seo: { ...data.seo, metaDescription: e.target.value } })}
                  className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Keywords</label>
                <input
                  type="text"
                  value={data.seo.keywords}
                  onChange={(e) => setData({ ...data, seo: { ...data.seo, keywords: e.target.value } })}
                  className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-xl text-xs uppercase">
              Save SEO Settings
            </button>
          </form>
        )}

        {/* TAB 12: POLICIES */}
        {activeTab === 'policies' && (
          <form onSubmit={handleSavePolicies} className="space-y-6 max-w-4xl">
            <h1 className="font-serif text-2xl font-bold text-[#FAF8F3]">Terms & Privacy Policies Editor</h1>

            <div className="bg-[#0B0B0B] border border-gray-800 p-6 rounded-2xl space-y-4">
              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Terms & Conditions</label>
                <textarea
                  rows={8}
                  value={data.policies.termsAndConditions}
                  onChange={(e) => setData({ ...data, policies: { ...data.policies, termsAndConditions: e.target.value } })}
                  className="w-full bg-black border border-gray-800 rounded-xl p-3 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Privacy Policy</label>
                <textarea
                  rows={8}
                  value={data.policies.privacyPolicy}
                  onChange={(e) => setData({ ...data, policies: { ...data.policies, privacyPolicy: e.target.value } })}
                  className="w-full bg-black border border-gray-800 rounded-xl p-3 text-xs text-white font-mono"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-xl text-xs uppercase">
              Save Policy Contents
            </button>
          </form>
        )}

        {/* TAB 13: ADMIN USERS */}
        {activeTab === 'users' && (
          <div className="space-y-8 max-w-3xl">
            <h1 className="font-serif text-2xl font-bold text-[#FAF8F3]">Authorized Administrator Accounts</h1>

            {/* Change Password Form */}
            <form onSubmit={handleChangePassword} className="bg-[#0B0B0B] border border-gray-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#D4AF37]">Change My Password</h3>
              {passMsg && <p className="text-xs text-[#25D366]">{passMsg}</p>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <button type="submit" className="bg-[#D4AF37] text-black font-bold py-2.5 px-6 rounded-xl text-xs uppercase">
                Update Password
              </button>
            </form>

            {/* List Authorized Admin Accounts */}
            <div className="bg-[#0B0B0B] border border-gray-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#D4AF37]">Authorized Admin Users</h3>
              <div className="space-y-2">
                {data.adminUsers.map((u) => (
                  <div key={u.id} className="p-3 bg-black rounded-xl border border-gray-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{u.username}</span>
                      <span className="text-[10px] text-gray-500 uppercase">{u.role} • Status: {u.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Create New Admin User */}
            <form onSubmit={handleCreateAdminUser} className="bg-[#0B0B0B] border border-gray-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#D4AF37]">Add New Admin Account</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={newAdminUser}
                    onChange={(e) => setNewAdminUser(e.target.value)}
                    className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <button type="submit" className="bg-[#D4AF37] text-black font-bold py-2.5 px-6 rounded-xl text-xs uppercase">
                Create Admin Account
              </button>
            </form>

          </div>
        )}

      </main>

      {/* Global Custom Delete Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0B0B] border border-red-500/50 max-w-sm w-full p-6 rounded-2xl space-y-4 text-center shadow-2xl animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-white">{confirmModal.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{confirmModal.message}</p>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => {
                  const action = confirmModal.onConfirm;
                  setConfirmModal(null);
                  action();
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-2.5 rounded-xl text-xs uppercase transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
