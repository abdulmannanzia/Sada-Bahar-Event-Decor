import React, { useState, useEffect } from 'react';
import { CMSData } from './types.js';
import { fetchPublicData, getAdminToken, removeAdminToken } from './api/client.js';
import { SEOHead } from './components/SEOHead.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { FloatingCTA } from './components/FloatingCTA.js';
import { HomePage } from './pages/HomePage.js';
import { PortfolioPage } from './pages/PortfolioPage.js';
import { ProjectDetailPage } from './pages/ProjectDetailPage.js';
import { FeedbackPage } from './pages/FeedbackPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { PolicyPage } from './pages/PolicyPage.js';
import { AdminLoginPage } from './pages/AdminLoginPage.js';
import { AdminDashboard } from './pages/AdminDashboard.js';
import { RefreshCw } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<CMSData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');

  // Load public CMS content
  const loadContent = async () => {
    try {
      const publicData = await fetchPublicData();
      setData(publicData);
    } catch (err: any) {
      console.error(err);
      setError('Unable to load website content. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();

    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] text-[#D4AF37] flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-10 h-10 animate-spin mb-4" />
        <span className="font-serif text-lg font-bold tracking-wider text-[#FAF8F3]">SADA BAHAR EVENT & DECOR</span>
        <span className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Loading Premium Experience...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center p-4">
        <div className="max-w-md bg-[#0B0B0B] border border-red-500/50 p-8 rounded-3xl text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold text-red-400">Connection Error</h2>
          <p className="text-xs text-gray-400">{error || 'Failed to initialize application'}</p>
          <button
            onClick={() => { setLoading(true); setError(''); loadContent(); }}
            className="bg-[#D4AF37] text-black font-bold text-xs uppercase px-6 py-3 rounded-xl"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const isAdminRoute = currentPath.startsWith('/admin');
  const isAdminLogin = currentPath === '/admin/login';
  const isAdminDashboard = currentPath === '/admin';

  // Render Admin Routes
  if (isAdminRoute) {
    if (isAdminDashboard) {
      const token = getAdminToken();
      if (!token) {
        return (
          <AdminLoginPage
            onLoginSuccess={() => handleNavigate('/admin')}
            onNavigateHome={() => handleNavigate('/')}
          />
        );
      }
      return (
        <AdminDashboard
          onLogout={() => {
            removeAdminToken();
            handleNavigate('/admin/login');
          }}
          onNavigateHome={() => handleNavigate('/')}
        />
      );
    }

    // Default admin login page
    return (
      <AdminLoginPage
        onLoginSuccess={() => handleNavigate('/admin')}
        onNavigateHome={() => handleNavigate('/')}
      />
    );
  }

  // Determine Public Page View
  let pageComponent = <HomePage data={data} onNavigate={handleNavigate} />;
  let pageTitleOverride = '';

  if (currentPath === '/portfolio') {
    pageComponent = <PortfolioPage data={data} onNavigate={handleNavigate} />;
    pageTitleOverride = 'Portfolio & Event Gallery';
  } else if (currentPath.startsWith('/portfolio/')) {
    const slug = currentPath.replace('/portfolio/', '');
    pageComponent = <ProjectDetailPage slug={slug} data={data} onNavigate={handleNavigate} />;
    pageTitleOverride = 'Project Detail';
  } else if (currentPath === '/feedback') {
    pageComponent = <FeedbackPage data={data} />;
    pageTitleOverride = 'Customer Reviews & Feedback';
  } else if (currentPath === '/contact') {
    pageComponent = <ContactPage data={data} />;
    pageTitleOverride = 'Contact & Location';
  } else if (currentPath === '/terms') {
    pageComponent = <PolicyPage type="terms" policies={data.policies} onNavigate={handleNavigate} />;
    pageTitleOverride = 'Terms & Conditions';
  } else if (currentPath === '/privacy') {
    pageComponent = <PolicyPage type="privacy" policies={data.policies} onNavigate={handleNavigate} />;
    pageTitleOverride = 'Privacy Policy';
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col font-sans">
      <SEOHead seo={data.seo} titleOverride={pageTitleOverride} />

      <Navbar
        settings={data.settings}
        contact={data.contact}
        currentPath={currentPath}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        {pageComponent}
      </main>

      <Footer
        settings={data.settings}
        contact={data.contact}
        social={data.social}
        onNavigate={handleNavigate}
      />

      <FloatingCTA contact={data.contact} />
    </div>
  );
}
