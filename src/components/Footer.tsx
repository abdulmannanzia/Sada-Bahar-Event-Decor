import React from 'react';
import { Phone, MessageCircle, MapPin, Mail, Instagram, Facebook, Youtube, Share2 } from 'lucide-react';
import { SiteSettings, ContactInfo, SocialLinks } from '../types.js';

interface Props {
  settings?: SiteSettings;
  contact?: ContactInfo;
  social?: SocialLinks;
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<Props> = ({ settings, contact, social, onNavigate }) => {
  const stagePhone = contact?.stagePhone || '0332-5841288';
  const shopPhone = contact?.shopPhone || '0333-9161630';
  const whatsappNumber = contact?.whatsapp || '0333-9161630';
  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, '');
  const formattedWhatsappUrl = `https://wa.me/92${cleanWhatsapp.replace(/^0+/, '')}`;

  return (
    <footer className="bg-[#070707] text-gray-300 border-t border-[#D4AF37]/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-gray-800">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {settings?.logo ? (
                <img 
                  src={settings.logo} 
                  alt={settings.siteName} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold font-serif text-xl">
                  SB
                </div>
              )}
              <div>
                <h3 className="font-serif text-xl font-bold text-[#FAF8F3]">SADA BAHAR</h3>
                <p className="text-xs text-[#D4AF37] tracking-wider uppercase font-semibold">EVENT & DECOR</p>
              </div>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              {settings?.tagline || 'Weddings | Stage | Car Decor | Event Management'}
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Crafting royal Pakistani wedding stages, bespoke bridal car decorations, and flawless event coordination.
            </p>

            {/* Social Media Links */}
            <div className="pt-2 flex flex-wrap gap-3">
              {social?.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-gray-800 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-all"
                  aria-label="Instagram"
                  id="footer-social-instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {social?.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-gray-800 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-all"
                  aria-label="Facebook"
                  id="footer-social-facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {social?.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-gray-800 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-all"
                  aria-label="YouTube"
                  id="footer-social-youtube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {social?.tiktok && (
                <a
                  href={social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-gray-800 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-all font-bold text-xs"
                  aria-label="TikTok"
                  id="footer-social-tiktok"
                >
                  TT
                </a>
              )}
              {social?.snapchat && (
                <a
                  href={social.snapchat}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-gray-800 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-all font-bold text-xs"
                  aria-label="Snapchat"
                  id="footer-social-snapchat"
                >
                  SC
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-[#D4AF37] mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm font-sans">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-[#D4AF37] transition-colors" id="footer-nav-home">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/portfolio')} className="hover:text-[#D4AF37] transition-colors" id="footer-nav-portfolio">
                  Portfolio Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/feedback')} className="hover:text-[#D4AF37] transition-colors" id="footer-nav-feedback">
                  Customer Feedback
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-[#D4AF37] transition-colors" id="footer-nav-contact">
                  Contact & Location
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-[#D4AF37] transition-colors" id="footer-nav-terms">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-[#D4AF37] transition-colors" id="footer-nav-privacy">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Phone & WhatsApp */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-[#D4AF37] mb-4">Direct Contact</h4>
            <ul className="space-y-3.5 text-sm font-sans">
              <li>
                <a href={`tel:${stagePhone}`} className="flex items-center space-x-3 text-gray-300 hover:text-[#D4AF37] group transition-colors">
                  <div className="w-8 h-8 rounded bg-white/5 border border-gray-800 flex items-center justify-center group-hover:border-[#D4AF37]">
                    <Phone className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase font-semibold">Stage Phone</span>
                    <span className="font-medium text-white">{stagePhone}</span>
                  </div>
                </a>
              </li>
              <li>
                <a href={`tel:${shopPhone}`} className="flex items-center space-x-3 text-gray-300 hover:text-[#D4AF37] group transition-colors">
                  <div className="w-8 h-8 rounded bg-white/5 border border-gray-800 flex items-center justify-center group-hover:border-[#D4AF37]">
                    <Phone className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase font-semibold">Shop Phone</span>
                    <span className="font-medium text-white">{shopPhone}</span>
                  </div>
                </a>
              </li>
              <li>
                <a 
                  href={formattedWhatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center space-x-3 text-gray-300 hover:text-[#25D366] group transition-colors"
                  id="footer-whatsapp-link"
                >
                  <div className="w-8 h-8 rounded bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-black">
                    <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:text-black" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase font-semibold">WhatsApp Chat</span>
                    <span className="font-medium text-white">{whatsappNumber}</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Hours */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-[#D4AF37] mb-4">Office & Venue Location</h4>
            <div className="space-y-3 text-sm text-gray-400 font-sans">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <p className="leading-snug text-gray-300 text-xs">
                  {contact?.address || 'Jarwanda Road, In front of International School and PAF Gate No. 3, 4, Near Peshawari Hotel, Pakistan.'}
                </p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-gray-800 text-xs text-gray-300">
                <span className="block text-[10px] text-[#D4AF37] uppercase font-bold mb-1">Business Hours</span>
                {contact?.businessHours || 'Monday – Sunday: 10:00 AM – 10:00 PM'}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright - Clickable copyright text leads to Admin Login page */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <button
            onClick={() => onNavigate('/admin/login')}
            className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left focus:outline-none"
            id="admin-login-copyright-link"
            title="Admin Login Portal"
          >
            {settings?.copyrightText || '© 2026 Sada Bahar Decor. All Rights Reserved.'}
          </button>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-6 text-gray-400">
            <button onClick={() => onNavigate('/terms')} className="hover:text-white transition-colors">
              Terms & Conditions
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('/privacy')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
