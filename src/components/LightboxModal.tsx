import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const LightboxModal: React.FC<Props> = ({ images, currentIndex, isOpen, onClose, onNavigate }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images, onClose, onNavigate]);

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[currentIndex] || images[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
      
      {/* Top Close Bar */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-4">
        <span className="text-white/70 font-mono text-xs">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          aria-label="Close Lightbox"
          id="lightbox-close-btn"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Prev Button */}
      {images.length > 1 && (
        <button
          onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
          className="absolute left-4 z-10 p-3 bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white rounded-full transition-all"
          aria-label="Previous Image"
          id="lightbox-prev-btn"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Image Container */}
      <div className="max-w-5xl max-h-[85vh] flex items-center justify-center overflow-hidden rounded-xl border border-white/10 shadow-2xl">
        <img
          src={currentImg}
          alt={`Gallery image ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={() => onNavigate((currentIndex + 1) % images.length)}
          className="absolute right-4 z-10 p-3 bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white rounded-full transition-all"
          aria-label="Next Image"
          id="lightbox-next-btn"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

    </div>
  );
};
