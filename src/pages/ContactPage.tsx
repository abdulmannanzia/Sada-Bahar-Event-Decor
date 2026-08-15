import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Clock, Mail, Send, Instagram, Facebook, Youtube, Sparkles } from 'lucide-react';
import { CMSData } from '../types.js';
import { submitContactQuery } from '../api/client.js';

interface Props {
  data: CMSData;
}

export const ContactPage: React.FC<Props> = ({ data }) => {
  const { contact, social } = data;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const stagePhone = contact?.stagePhone || '0332-5841288';
  const shopPhone = contact?.shopPhone || '0333-9161630';
  const whatsappNumber = contact?.whatsapp || '0333-9161630';
  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, '');
  const formattedWhatsappUrl = `https://wa.me/92${cleanWhatsapp.replace(/^0+/, '')}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await submitContactQuery({ name, phone, message });
      setSuccess(res.message || 'Thank you! Your query has been submitted.');
      setName('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit query.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8F3] text-gray-900 min-h-screen py-12">
      
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-[#0B0B0B] text-white p-8 sm:p-12 rounded-3xl border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[#D4AF37] font-semibold uppercase tracking-widest text-xs">
              Direct Communication
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-2 mb-4 text-[#FAF8F3]">
              Contact Sada Bahar Decor
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              We are ready to bring your royal wedding stage, car decoration, or special celebration to life. Reach out via Phone, WhatsApp, or visit our office.
            </p>
          </div>
          <Sparkles className="absolute right-6 bottom-6 w-32 h-32 text-[#D4AF37]/10" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Contact Info Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Phone Numbers Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#0B0B0B]">Phone Support</h3>
            <div className="w-12 h-1 bg-[#D4AF37] rounded-full" />

            <a
              href={`tel:${stagePhone}`}
              className="flex items-center space-x-4 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-[#D4AF37] transition-all group"
              id="contact-page-stage-phone"
            >
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-bold group-hover:bg-[#D4AF37] group-hover:text-black">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 uppercase font-bold">Stage Phone</span>
                <span className="text-base font-bold text-gray-900 group-hover:text-[#D4AF37]">{stagePhone}</span>
              </div>
            </a>

            <a
              href={`tel:${shopPhone}`}
              className="flex items-center space-x-4 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-[#D4AF37] transition-all group"
              id="contact-page-shop-phone"
            >
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-bold group-hover:bg-[#D4AF37] group-hover:text-black">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 uppercase font-bold">Shop Phone</span>
                <span className="text-base font-bold text-gray-900 group-hover:text-[#D4AF37]">{shopPhone}</span>
              </div>
            </a>
          </div>

          {/* WhatsApp CTA Card */}
          <div className="bg-gradient-to-br from-[#25D366]/10 to-[#128C7E]/10 p-6 rounded-2xl border border-[#25D366]/30 shadow-sm space-y-3">
            <div className="flex items-center space-x-3 text-[#25D366]">
              <MessageCircle className="w-6 h-6" />
              <h3 className="font-serif text-xl font-bold">WhatsApp Direct</h3>
            </div>
            <p className="text-xs text-gray-600">
              Get fast responses and instant decor photo packages on WhatsApp.
            </p>
            <a
              href={formattedWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md transition-all"
              id="contact-page-whatsapp-btn"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp ({whatsappNumber})</span>
            </a>
          </div>

          {/* Office Address & Business Hours */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Office & Venue Location</h4>
                <p className="text-gray-600 leading-relaxed">{contact?.address}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 pt-3 border-t border-gray-100">
              <Clock className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Business Hours</h4>
                <p className="text-gray-600">{contact?.businessHours}</p>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="bg-[#0B0B0B] text-white p-6 rounded-2xl border border-[#D4AF37]/30 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#FAF8F3]">Contact Our Social Media</h3>
            <p className="text-xs text-gray-400">
              Follow our latest stage decoration photos and videos across official channels:
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {social?.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-2.5 bg-white/5 rounded-lg border border-gray-800 hover:border-[#D4AF37] transition-all"
                  id="contact-social-instagram"
                >
                  <Instagram className="w-4 h-4 text-[#D4AF37]" />
                  <span>Instagram</span>
                </a>
              )}
              {social?.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-2.5 bg-white/5 rounded-lg border border-gray-800 hover:border-[#D4AF37] transition-all"
                  id="contact-social-facebook"
                >
                  <Facebook className="w-4 h-4 text-[#D4AF37]" />
                  <span>Facebook</span>
                </a>
              )}
              {social?.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-2.5 bg-white/5 rounded-lg border border-gray-800 hover:border-[#D4AF37] transition-all"
                  id="contact-social-youtube"
                >
                  <Youtube className="w-4 h-4 text-[#D4AF37]" />
                  <span>YouTube</span>
                </a>
              )}
              {social?.tiktok && (
                <a
                  href={social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-2.5 bg-white/5 rounded-lg border border-gray-800 hover:border-[#D4AF37] transition-all"
                  id="contact-social-tiktok"
                >
                  <span className="font-bold text-[#D4AF37]">TT</span>
                  <span>TikTok</span>
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Query Form + Google Map (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Quick Query Form */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-lg">
            <h2 className="font-serif text-2xl font-bold text-[#0B0B0B] mb-2">Send a Quick Query</h2>
            <p className="text-xs text-gray-500 mb-6">
              Fill out the form below with your required event date, location, and decor preferences.
            </p>

            {success ? (
              <div className="bg-[#25D366]/10 border border-[#25D366] text-[#25D366] p-6 rounded-2xl text-center space-y-3">
                <h4 className="font-bold text-sm">{success}</h4>
                <button
                  onClick={() => setSuccess('')}
                  className="text-xs underline text-black hover:text-[#D4AF37]"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-xs">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase text-gray-700 font-bold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Muhammad Hamza"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                    id="contact-form-name"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-gray-700 font-bold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                    id="contact-form-phone"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-gray-700 font-bold mb-1">Event Message / Query *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about your event type (Barat/Walima/Car Decor), venue location, and expected date..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#D4AF37]"
                    id="contact-form-message"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0B0B0B] hover:bg-[#D4AF37] hover:text-black text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-2"
                  id="contact-form-submit-btn"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Embedded Google Map */}
          <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-md">
            <h3 className="font-serif text-lg font-bold text-[#0B0B0B] px-4 pt-2 mb-3">Google Map Direction</h3>
            <div className="w-full h-80 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
              {contact?.googleMapEmbed ? (
                <iframe
                  src={contact.googleMapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  title="Sada Bahar Decor Google Map"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                  Map Embed
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
