import React from 'react';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';
import { PolicyContent } from '../types.js';

interface Props {
  type: 'terms' | 'privacy';
  policies?: PolicyContent;
  onNavigate: (path: string) => void;
}

export const PolicyPage: React.FC<Props> = ({ type, policies, onNavigate }) => {
  const isTerms = type === 'terms';
  const title = isTerms ? 'Terms & Conditions' : 'Privacy Policy';
  const content = isTerms
    ? policies?.termsAndConditions || 'Terms and Conditions content.'
    : policies?.privacyPolicy || 'Privacy Policy content.';

  return (
    <div className="bg-[#FAF8F3] text-gray-900 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-gray-700 hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-[#0B0B0B] text-white p-8 rounded-3xl border border-[#D4AF37]/30 shadow-2xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
            {isTerms ? <FileText className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#FAF8F3]">{title}</h1>
            <p className="text-xs text-gray-400">Sada Bahar Event & Decor Official Policy</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm text-sm text-gray-700 leading-relaxed whitespace-pre-line font-sans">
          {content}
        </div>

      </div>
    </div>
  );
};
