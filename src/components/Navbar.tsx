import React, { useState } from 'react';
import { Phone, MessageCircle, Menu, X, Sparkles } from 'lucide-react';
import { SiteSettings, ContactInfo } from '../types.js';

interface Props {
  settings?: SiteSettings;
  contact?: ContactInfo;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<Props> = ({ settings, contact, currentPath, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Feedback', path: '/feedback' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileOpen(false);
  };

  const whatsappNumber = contact?.whatsapp || '0333-9161630';
  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, '');
  const formattedWhatsappUrl = `https://wa.me/92${cleanWhatsapp.replace(/^0+/, '')}`;

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#D4AF37]/20 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => handleLinkClick('/')}
          className="flex items-center space-x-3 cursor-pointer group"
          id="navbar-brand-logo"
        >
          {settings?.logo ? (
            <img 
              src={settings.logo} 
              alt={settings.siteName} 
              className="w-11 h-11 rounded-full object-cover border-2 border-[#D4AF37] group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#997A15] flex items-center justify-center text-black font-bold text-lg border border-[#D4AF37]">
              SB
            </div>
          )}
          <div>
            <span className="block font-serif text-lg sm:text-xl font-bold tracking-wider text-[#FAF8F3] group-hover:text-[#D4AF37] transition-colors">
              SADA BAHAR
            </span>
            <span className="block text-[10px] tracking-widest text-[#D4AF37] uppercase font-sans font-medium">
              EVENT & DECOR
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-8" id="desktop-navbar-menu">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`font-sans text-sm font-medium tracking-wide transition-all duration-200 relative py-1 ${
                  isActive 
                    ? 'text-[#D4AF37] font-semibold' 
                    : 'text-gray-300 hover:text-white'
                }`}
                id={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Header Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          <a
            href={`tel:${contact?.shopPhone || '0333-9161630'}`}
            className="flex items-center space-x-2 text-xs font-sans font-medium text-gray-300 hover:text-[#D4AF37] transition-colors border border-gray-800 px-3 py-2 rounded-lg bg-black/40"
            id="nav-phone-button"
          >
            <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{contact?.shopPhone || '0333-9161630'}</span>
          </a>

          <a
            href={formattedWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20ba5a] hover:to-[#0e7568] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
            id="nav-whatsapp-button"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <a
            href={formattedWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-[#25D366] text-white rounded-lg"
            aria-label="WhatsApp"
            id="mobile-nav-whatsapp-icon"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2.5 text-gray-300 hover:text-white rounded-lg border border-gray-800 bg-black/40"
            aria-label="Toggle Navigation Menu"
            id="mobile-menu-toggle-btn"
          >
            {mobileOpen ? <X className="w-6 h-6 text-[#D4AF37]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0B0B0B] border-b border-[#D4AF37]/30 px-4 pt-4 pb-6 space-y-4 shadow-2xl animate-fadeIn">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`text-left px-4 py-3 rounded-lg text-base font-medium transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-l-4 border-[#D4AF37]'
                      : 'text-gray-200 hover:bg-white/5'
                  }`}
                  id={`mobile-nav-link-${link.label.toLowerCase()}`}
                >
                  <span>{link.label}</span>
                  {isActive && <Sparkles className="w-4 h-4 text-[#D4AF37]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-800 space-y-3">
            <div className="text-xs text-gray-400 uppercase tracking-widest font-sans font-semibold px-1">
              Direct Contact & Booking
            </div>
            <a
              href={`tel:${contact?.stagePhone || '0332-5841288'}`}
              className="flex items-center space-x-3 text-sm text-gray-200 bg-white/5 px-4 py-2.5 rounded-lg border border-gray-800"
            >
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <div>
                <span className="block text-[10px] text-gray-400 uppercase">Stage Phone</span>
                <span className="font-semibold text-white">{contact?.stagePhone || '0332-5841288'}</span>
              </div>
            </a>
            <a
              href={`tel:${contact?.shopPhone || '0333-9161630'}`}
              className="flex items-center space-x-3 text-sm text-gray-200 bg-white/5 px-4 py-2.5 rounded-lg border border-gray-800"
            >
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <div>
                <span className="block text-[10px] text-gray-400 uppercase">Shop Phone</span>
                <span className="font-semibold text-white">{contact?.shopPhone || '0333-9161630'}</span>
              </div>
            </a>
            <a
              href={formattedWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-[#25D366] text-white py-3 rounded-lg font-bold text-sm tracking-wide shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat on WhatsApp (0333-9161630)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
