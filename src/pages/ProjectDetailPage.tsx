import React, { useState } from 'react';
import { MapPin, Calendar, ArrowLeft, MessageCircle, Maximize2, Sparkles } from 'lucide-react';
import { CMSData, PortfolioProject } from '../types.js';
import { LightboxModal } from '../components/LightboxModal.js';

interface Props {
  slug: string;
  data: CMSData;
  onNavigate: (path: string) => void;
}

export const ProjectDetailPage: React.FC<Props> = ({ slug, data, onNavigate }) => {
  const { projects, contact } = data;

  const project = projects.find((p) => p.slug === slug || p.id === slug);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!project) {
    return (
      <div className="bg-[#FAF8F3] min-h-screen py-24 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-md">
          <h2 className="font-serif text-2xl font-bold text-gray-800 mb-2">Project Not Found</h2>
          <p className="text-gray-500 text-xs mb-6">The requested event portfolio project could not be located.</p>
          <button
            onClick={() => onNavigate('/portfolio')}
            className="bg-[#D4AF37] text-black font-bold text-xs uppercase px-6 py-3 rounded-xl"
          >
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  const galleryList = project.galleryImages && project.galleryImages.length > 0
    ? project.galleryImages
    : [project.coverImage];

  const relatedProjects = projects
    .filter((p) => p.id !== project.id && (p.categoryId === project.categoryId || p.isFeatured))
    .slice(0, 3);

  const whatsappNumber = contact?.whatsapp || '0333-9161630';
  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, '');
  const inquireWhatsappUrl = `https://wa.me/92${cleanWhatsapp.replace(/^0+/, '')}?text=Hello%20Sada%20Bahar%20Decor,%20I'm%20interested%20in%20a%20setup%20similar%20to%20"${encodeURIComponent(project.title)}".`;

  return (
    <div className="bg-[#FAF8F3] text-gray-900 min-h-screen py-12">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Link */}
        <div>
          <button
            onClick={() => onNavigate('/portfolio')}
            className="inline-flex items-center space-x-2 text-sm font-bold text-gray-700 hover:text-[#D4AF37] transition-colors"
            id="back-to-portfolio-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio Gallery</span>
          </button>
        </div>

        {/* Project Header Banner */}
        <div className="bg-[#0B0B0B] text-white p-8 sm:p-12 rounded-3xl border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-block bg-[#D4AF37] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              {project.categoryName}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF8F3]">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-300 font-sans pt-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>{project.location}</span>
              </div>
              {project.eventDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <span>{project.eventDate}</span>
                </div>
              )}
            </div>
          </div>
          <Sparkles className="absolute right-6 bottom-6 w-32 h-32 text-[#D4AF37]/10" />
        </div>

        {/* Project Description & Call to Action */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white border border-gray-200 p-8 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#0B0B0B]">Project Overview</h3>
            <div className="w-12 h-1 bg-[#D4AF37] rounded-full" />
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          <div className="lg:col-span-4 bg-[#0B0B0B] text-white p-6 rounded-2xl border border-[#D4AF37]/30 shadow-xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#FAF8F3]">Love this Decor?</h3>
            <p className="text-gray-300 text-xs leading-relaxed">
              Contact our decor team directly to get a custom quotation for your event venue and date.
            </p>
            <a
              href={inquireWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all"
              id="project-inquire-whatsapp-btn"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-[#0B0B0B]">Event Gallery Showcase</h3>
            <span className="text-xs text-gray-500 font-sans">Click any image for full-screen viewer</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryList.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setLightboxIndex(idx);
                  setLightboxOpen(true);
                }}
                className="relative h-64 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
              >
                <img
                  src={imgUrl}
                  alt={`${project.title} photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <div className="p-3 bg-black/60 rounded-full backdrop-blur-md">
                    <Maximize2 className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="pt-12 border-t border-gray-200 space-y-6">
            <h3 className="font-serif text-2xl font-bold text-[#0B0B0B]">Similar Event Setups</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onNavigate(`/portfolio/${rel.slug}`)}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="h-44 bg-gray-100 overflow-hidden">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-serif text-base font-bold text-gray-900 group-hover:text-[#D4AF37] transition-colors">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{rel.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        images={galleryList}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />

    </div>
  );
};
