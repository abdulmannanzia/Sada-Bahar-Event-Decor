import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { CMSData } from '../types.js';

interface Props {
  data: CMSData;
  onNavigate: (path: string) => void;
}

export const PortfolioPage: React.FC<Props> = ({ data, onNavigate }) => {
  const { projects, categories } = data;

  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      const matchCat = selectedCat === 'all' || proj.categoryId === selectedCat;
      const matchSearch =
        proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [projects, selectedCat, searchQuery]);

  return (
    <div className="bg-[#FAF8F3] text-gray-900 min-h-screen py-12">
      
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-[#0B0B0B] text-white p-8 sm:p-12 rounded-3xl border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[#D4AF37] font-semibold uppercase tracking-widest text-xs">
              Exquisite Showcase
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-2 mb-4 text-[#FAF8F3]">
              Portfolio & Event Gallery
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Explore our real wedding stages, bridal car floral setups, Walima decor, and custom venue design projects across Pakistan.
            </p>
          </div>
          <Sparkles className="absolute right-6 bottom-6 w-32 h-32 text-[#D4AF37]/10" />
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 space-y-6">
        
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects by title, category, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] shadow-sm"
            id="portfolio-search-input"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2" id="portfolio-category-filters">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              selectedCat === 'all'
                ? 'bg-[#0B0B0B] text-[#D4AF37] border border-[#D4AF37] shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-[#D4AF37]'
            }`}
          >
            All Categories ({projects.length})
          </button>

          {categories.map((cat) => {
            const count = projects.filter((p) => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedCat === cat.id
                    ? 'bg-[#0B0B0B] text-[#D4AF37] border border-[#D4AF37] shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-[#D4AF37]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Selected Category Highlight Banner */}
        {selectedCat !== 'all' && categories.find((c) => c.id === selectedCat) && (
          <div className="bg-[#0B0B0B] text-white p-6 rounded-2xl border border-[#D4AF37]/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Selected Portfolio Category</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#FAF8F3]">
                {categories.find((c) => c.id === selectedCat)?.name}
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                {categories.find((c) => c.id === selectedCat)?.description}
              </p>
            </div>
            <div className="bg-[#D4AF37]/20 border border-[#D4AF37]/50 px-4 py-2 rounded-xl text-center shrink-0">
              <span className="text-[#FAF8F3] text-xs font-bold">
                {filteredProjects.length === 1 ? '1 Featured Showcase Work' : `${filteredProjects.length} Showcase Works`}
              </span>
            </div>
          </div>
        )}

      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProjects.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-md mx-auto my-12">
            <Filter className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
            <h3 className="font-serif text-lg font-bold text-gray-800">No Projects Found</h3>
            <p className="text-gray-500 text-xs mt-2">
              Try selecting a different category or clearing your search filters.
            </p>
            <button
              onClick={() => { setSelectedCat('all'); setSearchQuery(''); }}
              className="mt-4 bg-[#D4AF37] text-black font-bold text-xs px-4 py-2 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onNavigate(`/portfolio/${proj.slug}`)}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col group"
              >
                {/* Project Cover Image */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={proj.coverImage}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#0B0B0B]/80 text-[#D4AF37] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                    {proj.categoryName}
                  </div>
                  {proj.galleryImages && proj.galleryImages.length > 0 && (
                    <div className="absolute bottom-3 right-3 bg-black/75 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-md border border-white/10">
                      {proj.galleryImages.length} Local Showcase Photos
                    </div>
                  )}
                </div>

                {/* 3-Image Showcase Preview Strip */}
                {proj.galleryImages && proj.galleryImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 px-6 pt-4">
                    {proj.galleryImages.slice(0, 3).map((img, i) => (
                      <div key={i} className="h-16 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 relative group/thumb">
                        <img
                          src={img}
                          alt={`${proj.title} thumbnail ${i + 1}`}
                          className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover/thumb:bg-transparent transition-colors" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Project Meta & Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#0B0B0B] group-hover:text-[#D4AF37] transition-colors mb-2">
                      {proj.title}
                    </h3>
                    <p className="text-gray-600 text-xs line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{proj.location}</span>
                    </div>
                    {proj.eventDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{proj.eventDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0B0B0B] group-hover:text-[#D4AF37]">
                    <span>View Project Details</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
