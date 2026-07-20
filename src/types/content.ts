// تعريف نوع للقيم المترجمة
export type Localized = {
  fr: string;
  ar: string;
};

export type Service = {
  id: string;
  title: Localized;
  icon: string;
  description: Localized;
  image: string;
  href: string;
  features?: string[];
};

export type Project = {
  id: string;
  slug: string;
  title: Localized;
  category: Localized;
  badge?: Localized;
  featured?: boolean;
  description: Localized;
  image: string;
  youtubeId?: string;
  summary: Localized;
  overview: Localized;
  problem: Localized;
  solution: Localized;
  technologies: string[];
  scope: string[];
  outcome: Localized;
  gallery: string[];
  /** Optional caption per gallery image (same length as gallery when used). */
  galleryCaptions?: string[];
  /** Short callout about MauriTech crews on site (branded apparel, commissioning discipline). */
  teamHighlight?: Localized;
  tags?: string[];
  // حقول إضافية تمت ملاحظتها في البيانات
  clientType?: string;
  location?: string;
  year?: string;
  services?: string[];
  odooId?: string | null;
  status?: string;
  synced?: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  role: Localized;
  quote: Localized;
};
