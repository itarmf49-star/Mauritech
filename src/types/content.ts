export type Service = {
  id: string;
  title: string;
  icon: string;
  description: string;
  image: string;
  href: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  badge?: string;
  featured?: boolean;
  description: string;
  image: string;
  youtubeId?: string;
  summary: string;
  overview: string;
  problem: string;
  solution: string;
  technologies: string[];
  scope: string[];
  outcome: string;
  gallery: string[];
  /** Optional caption per gallery image (same length as gallery when used). */
  galleryCaptions?: string[];
  /** Short callout about MauriTech crews on site (branded apparel, commissioning discipline). */
  teamHighlight?: string;
  tags?: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
};
