/**
 * SADA BAHAR EVENT & DECOR - Domain Types
 */

export interface AdminUser {
  id: string;
  username: string;
  role: 'superadmin' | 'admin' | 'editor';
  status: 'active' | 'disabled';
  createdAt: string;
  lastLogin?: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  primaryGold: string;
  darkBg: string;
  lightBg: string;
  copyrightText: string;
}

export interface ContactInfo {
  stagePhone: string;
  shopPhone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapEmbed: string;
  googleMapUrl: string;
  businessHours: string;
}

export interface SocialLinks {
  instagram: string;
  tiktok: string;
  facebook: string;
  snapchat: string;
  youtube: string;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  whatsappChannelUrl: string;
  order: number;
}

export interface OwnerInfo {
  name: string;
  photo: string;
  biography: string;
  vision: string;
  mission: string;
  achievements: string[];
  whyTrustUs: string;
}

export interface HomepageContent {
  heroHeading: string;
  heroSubheading: string;
  heroImage: string;
  heroCtaText: string;
  owner: OwnerInfo;
  whyChooseUs: WhyChooseItem[];
}

export interface PortfolioCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  description: string;
  location: string;
  eventDate: string;
  coverImage: string;
  galleryImages: string[];
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  eventCategory: string;
  rating: number;
  comment: string;
  photos: string[];
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  isFeatured: boolean;
}

export interface ContactQuery {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'completed' | 'archived';
}

export interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface PolicyContent {
  termsAndConditions: string;
  privacyPolicy: string;
}

export interface CMSData {
  settings: SiteSettings;
  contact: ContactInfo;
  social: SocialLinks;
  homepage: HomepageContent;
  services: Service[];
  categories: PortfolioCategory[];
  projects: PortfolioProject[];
  reviews: Review[];
  queries: ContactQuery[];
  media: MediaAsset[];
  seo: SEOSettings;
  policies: PolicyContent;
  adminUsers: { id: string; username: string; passwordHash: string; role: 'superadmin' | 'admin' | 'editor'; status: 'active' | 'disabled'; createdAt: string; lastLogin?: string }[];
}
