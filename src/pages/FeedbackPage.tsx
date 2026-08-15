import React, { useState } from 'react';
import { Star, Upload, CheckCircle2, MessageSquare, Sparkles, Image as ImageIcon } from 'lucide-react';
import { CMSData } from '../types.js';
import { submitCustomerFeedback } from '../api/client.js';

interface Props {
  data: CMSData;
}

export const FeedbackPage: React.FC<Props> = ({ data }) => {
  const { reviews, categories } = data;
  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Photo File Upload to Base64
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files: File[] = Array.from(e.target.files);

    files.forEach((file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await submitCustomerFeedback({
        customerName,
        eventCategory,
        rating,
        comment,
        photos: uploadedPhotos,
      });

      setSuccessMsg(res.message || 'Thank you! Your feedback has been submitted for moderation.');
      setCustomerName('');
      setEventCategory('');
      setEmail('');
      setPhone('');
      setRating(5);
      setComment('');
      setUploadedPhotos([]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F3] text-gray-900 min-h-screen py-12">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-[#0B0B0B] text-white p-8 sm:p-12 rounded-3xl border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[#D4AF37] font-semibold uppercase tracking-widest text-xs">
              Client Experiences
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-2 mb-4 text-[#FAF8F3]">
              Customer Reviews & Feedback
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Read real reviews from delighted families and event hosts. We value your feedback and strive for royal perfection in every setup.
            </p>
          </div>
          <Sparkles className="absolute right-6 bottom-6 w-32 h-32 text-[#D4AF37]/10" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Approved Reviews List (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <h2 className="font-serif text-2xl font-bold text-[#0B0B0B]">Verified Reviews ({approvedReviews.length})</h2>
            <div className="flex items-center space-x-1 text-[#D4AF37]">
              <Star className="w-5 h-5 fill-[#D4AF37]" />
              <span className="font-bold text-sm text-gray-900">5.0 / 5.0 Average</span>
            </div>
          </div>

          {approvedReviews.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center">
              <MessageSquare className="w-10 h-10 text-[#D4AF37] mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No approved reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {approvedReviews.map((rev) => (
                <div key={rev.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#0B0B0B]">{rev.customerName}</h3>
                      <span className="text-xs text-[#D4AF37] font-semibold uppercase">{rev.eventCategory}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < rev.rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line italic">
                    "{rev.comment}"
                  </p>

                  {/* Customer Photos */}
                  {rev.photos && rev.photos.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {rev.photos.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Customer review photo"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-gray-400 pt-2 border-t border-gray-100 flex justify-between">
                    <span>Verified Customer</span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Share Your Experience Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 p-8 rounded-3xl shadow-lg h-fit sticky top-28">
          <h2 className="font-serif text-2xl font-bold text-[#0B0B0B] mb-2">Share Your Experience</h2>
          <p className="text-xs text-gray-500 mb-6">
            Have you hired Sada Bahar Event & Decor? Submit your review below.
          </p>

          {successMsg ? (
            <div className="bg-[#25D366]/10 border border-[#25D366] text-[#25D366] p-6 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 mx-auto" />
              <h4 className="font-bold text-sm">{successMsg}</h4>
              <button
                onClick={() => setSuccessMsg('')}
                className="text-xs underline text-black hover:text-[#D4AF37]"
              >
                Submit Another Review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-xs">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs uppercase text-gray-700 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Muhammad Hamza"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                  id="review-name-input"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-700 font-bold mb-1">Event Category *</label>
                <select
                  required
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                  id="review-category-select"
                >
                  <option value="">Select Event Type</option>
                  <option value="Wedding Decoration">Wedding Decoration</option>
                  <option value="Stage Decoration">Stage Decoration</option>
                  <option value="Car Decoration">Car Decoration</option>
                  <option value="Barat Stage">Barat Stage</option>
                  <option value="Walima Stage">Walima Stage</option>
                  <option value="Mehndi Setup">Mehndi Setup</option>
                  <option value="Event Management">Event Management</option>
                  <option value="Custom Event">Custom Event</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-gray-700 font-bold mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-700 font-bold mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Star Rating selector */}
              <div>
                <label className="block text-xs uppercase text-gray-700 font-bold mb-1">Star Rating *</label>
                <div className="flex items-center space-x-2 bg-gray-50 border border-gray-300 p-2.5 rounded-xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-700 ml-2">{rating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-700 font-bold mb-1">Review / Feedback *</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about the decor quality, staff behavior, and overall experience..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#D4AF37]"
                  id="review-comment-input"
                />
              </div>

              {/* Upload Pictures */}
              <div>
                <label className="block text-xs uppercase text-gray-700 font-bold mb-1">Upload Event Photos (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#D4AF37] transition-colors bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="feedback-photo-upload"
                  />
                  <label htmlFor="feedback-photo-upload" className="cursor-pointer block">
                    <ImageIcon className="w-6 h-6 text-[#D4AF37] mx-auto mb-1" />
                    <span className="text-xs text-gray-600 font-bold block">Click to Upload Pictures</span>
                    <span className="text-[10px] text-gray-400">JPG, PNG, WEBP up to 5MB</span>
                  </label>
                </div>

                {uploadedPhotos.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {uploadedPhotos.map((p, idx) => (
                      <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-300">
                        <img src={p} alt="Uploaded preview" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0B0B0B] hover:bg-[#D4AF37] hover:text-black text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
                id="review-submit-btn"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback for Moderation'}
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
