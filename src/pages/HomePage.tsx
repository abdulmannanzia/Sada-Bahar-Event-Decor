import React from 'react';
import { 
  Phone, MessageCircle, ArrowRight, Star, CheckCircle2 
} from 'lucide-react';
import { CMSData } from '../types.js';

interface Props {
  data: CMSData;
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<Props> = ({ data, onNavigate }) => {
  const { homepage, services, reviews, contact } = data;

  const stagePhone = contact?.stagePhone || '0332-5841288';
  const shopPhone = contact?.shopPhone || '0333-9161630';
  const whatsappNumber = contact?.whatsapp || '0333-9161630';
  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, '');
  const formattedWhatsappUrl = `https://wa.me/92${cleanWhatsapp.replace(/^0+/, '')}`;

  const featuredReviews = reviews.filter(r => r.status === 'approved').slice(0, 3);

  return (
    <div className="bg-[#FAF8F3] text-gray-900 min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[85vh] flex items-center justify-center text-white overflow-hidden bg-[#0B0B0B]">
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={homepage?.heroImage || '/src/assets/images/hero_green_stage_1786557977889.jpg'}
            alt="Sada Bahar Event Stage Decor"
            className="w-full h-full object-cover object-center scale-105 filter brightness-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/75 to-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF8F3] leading-tight mb-6">
            {homepage?.heroHeading || 'Welcome to Sada Bahar Event & Decor'}
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-300 font-sans leading-relaxed mb-10">
            {homepage?.heroSubheading || 'Providing premium wedding decoration, stage decoration, car decoration, and complete event management services in Pakistan.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/portfolio')}
              className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#b8952b] text-black px-8 py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2"
              id="hero-view-portfolio-btn"
            >
              <span>{homepage?.heroCtaText || 'View Portfolio'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/feedback')}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all backdrop-blur-md"
              id="hero-feedback-btn"
            >
              Feedback
            </button>

            <a
              href={formattedWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5a] text-white px-8 py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all shadow-xl flex items-center justify-center space-x-2"
              id="hero-whatsapp-btn"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* --- HOMEPAGE CONTACT BAR --- */}
      <section className="bg-[#0B0B0B] text-white py-12 border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Stage Phone Card */}
            <a
              href={`tel:${stagePhone}`}
              className="bg-white/5 border border-gray-800 hover:border-[#D4AF37] p-6 rounded-2xl flex items-center space-x-4 transition-all group"
              id="contact-card-stage-phone"
            >
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest text-gray-400 font-semibold">Stage Phone</span>
                <span className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">{stagePhone}</span>
              </div>
            </a>

            {/* Shop Phone Card */}
            <a
              href={`tel:${shopPhone}`}
              className="bg-white/5 border border-gray-800 hover:border-[#D4AF37] p-6 rounded-2xl flex items-center space-x-4 transition-all group"
              id="contact-card-shop-phone"
            >
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest text-gray-400 font-semibold">Shop Phone</span>
                <span className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">{shopPhone}</span>
              </div>
            </a>

            {/* WhatsApp CTA Card */}
            <a
              href={formattedWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#25D366]/20 to-[#128C7E]/20 border border-[#25D366]/40 p-6 rounded-2xl flex items-center space-x-4 transition-all group hover:bg-[#25D366]/30"
              id="contact-card-whatsapp"
            >
              <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-lg">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest text-[#25D366] font-bold">WhatsApp Channel</span>
                <span className="text-base font-bold text-white">Chat Immediately</span>
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="services">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#D4AF37] font-semibold tracking-widest uppercase text-xs font-sans">
            Our Offerings
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B0B0B] mt-2 mb-4">
            Bespoke Event & Decor Services
          </h2>
          <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full mb-4" />
          <p className="text-gray-600 text-sm sm:text-base">
            Click on any service to connect directly with its dedicated WhatsApp channel for tailored consultations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col group"
            >
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-4 text-white font-serif text-xl font-bold">
                  {service.title}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.shortDescription}
                </p>

                <div className="pt-2">
                  <a
                    href={service.whatsappChannelUrl || formattedWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#0B0B0B] hover:bg-[#25D366] text-white hover:text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 border border-gray-800 hover:border-[#25D366] shadow-sm hover:shadow-lg group/btn"
                    id={`service-whatsapp-btn-${service.id}`}
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366] group-hover/btn:text-white group-hover/btn:scale-110 transition-transform" />
                    <span>View More on WA</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- MEET THE OWNER SECTION --- */}
      <section className="bg-[#0B0B0B] text-white py-20 border-y border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Owner Photo */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-2xl bg-black">
                <img
                  src={homepage?.owner?.photo || '/src/assets/images/owner_portrait_1786558468734.jpg'}
                  alt={homepage?.owner?.name || 'Humza - Sada Bahar Decor'}
                  className="w-full h-auto max-h-[500px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-serif text-2xl font-bold text-[#FAF8F3]">
                    {homepage?.owner?.name || 'Sada Bahar Decor Management'}
                  </h3>
                  <p className="text-xs text-[#D4AF37] font-semibold uppercase tracking-widest">
                    Founder & Managing Director
                  </p>
                </div>
              </div>
            </div>

            {/* Owner Bio & Details */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[#D4AF37] font-semibold tracking-widest uppercase text-xs">
                Leadership & Vision
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF8F3]">
                Meet the Owner & Leadership
              </h2>
              <div className="w-20 h-1 bg-[#D4AF37] rounded-full" />

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {homepage?.owner?.biography}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white/5 border border-gray-800 p-4 rounded-xl">
                  <h4 className="text-xs uppercase text-[#D4AF37] font-bold mb-1">Our Vision</h4>
                  <p className="text-xs text-gray-300">{homepage?.owner?.vision}</p>
                </div>

                <div className="bg-white/5 border border-gray-800 p-4 rounded-xl">
                  <h4 className="text-xs uppercase text-[#D4AF37] font-bold mb-1">Our Mission</h4>
                  <p className="text-xs text-gray-300">{homepage?.owner?.mission}</p>
                </div>
              </div>

              {homepage?.owner?.achievements && homepage.owner.achievements.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs uppercase text-[#D4AF37] font-bold">Key Milestones</h4>
                  <div className="space-y-1.5">
                    {homepage.owner.achievements.map((ach, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-4 rounded-xl text-xs text-[#FAF8F3] italic">
                "{homepage?.owner?.whyTrustUs}"
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* --- CUSTOMER REVIEWS PREVIEW --- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[#D4AF37] font-semibold tracking-widest uppercase text-xs">
              Client Testimonials
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B0B0B] mt-2">
              What Our Clients Say
            </h2>
          </div>

          <button
            onClick={() => onNavigate('/feedback')}
            className="mt-4 md:mt-0 text-[#0B0B0B] hover:text-[#D4AF37] font-bold text-sm tracking-wider uppercase flex items-center space-x-2 transition-colors"
          >
            <span>Read All Reviews & Share Feedback</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredReviews.map((rev) => (
            <div key={rev.id} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rev.rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-sm italic leading-relaxed mb-4">"{rev.comment}"</p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <span className="block font-bold text-sm text-[#0B0B0B]">{rev.customerName}</span>
                <span className="text-xs text-[#D4AF37] font-medium">{rev.eventCategory}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
