import React, { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { ContactInfo } from '../types.js';

interface Props {
  contact?: ContactInfo;
}

export const FloatingCTA: React.FC<Props> = ({ contact }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappNumber = contact?.whatsapp || '0333-9161630';
  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, '');
  const formattedWhatsappUrl = `https://wa.me/92${cleanWhatsapp.replace(/^0+/, '')}`;

  const stagePhone = contact?.stagePhone || '0332-5841288';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3 pointer-events-auto">
      
      {/* Tooltip Badge */}
      {showTooltip && (
        <div className="bg-[#0B0B0B] text-white border border-[#D4AF37]/50 px-3.5 py-2 rounded-xl text-xs shadow-2xl flex items-center space-x-2 animate-bounce max-w-[200px] sm:max-w-none">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
          <span className="font-medium text-xs">Chat with us on WhatsApp</span>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
            className="text-gray-400 hover:text-white ml-1 p-0.5"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="flex items-center space-x-3">
        {/* Mobile Quick Call Button */}
        <a
          href={`tel:${stagePhone}`}
          className="sm:hidden w-12 h-12 bg-[#0B0B0B] text-[#D4AF37] border-2 border-[#D4AF37] rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform"
          aria-label="Call Sada Bahar Decor"
          id="floating-phone-button"
        >
          <Phone className="w-5 h-5" />
        </a>

        {/* Main WhatsApp Button */}
        <a
          href={formattedWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-gradient-to-tr from-[#25D366] to-[#128C7E] text-white rounded-full flex items-center justify-center shadow-[0_4px_25px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-transform relative group"
          aria-label="Chat with us on WhatsApp"
          id="floating-whatsapp-button"
        >
          <MessageCircle className="w-7 h-7 fill-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </a>
      </div>

    </div>
  );
};
