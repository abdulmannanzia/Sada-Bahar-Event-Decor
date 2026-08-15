import React, { useEffect } from 'react';
import { SEOSettings } from '../types.js';

interface Props {
  seo?: SEOSettings;
  titleOverride?: string;
}

export const SEOHead: React.FC<Props> = ({ seo, titleOverride }) => {
  useEffect(() => {
    if (!seo) return;
    const finalTitle = titleOverride
      ? `${titleOverride} | Sada Bahar Event & Decor`
      : seo.metaTitle || 'Sada Bahar Event & Decor | Luxury Wedding & Stage Decor';

    document.title = finalTitle;

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seo.metaDescription || '');

    // Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', seo.keywords || '');

    // OG Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', seo.ogTitle || finalTitle);

    // OG Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', seo.ogDescription || seo.metaDescription || '');
  }, [seo, titleOverride]);

  return null;
};
