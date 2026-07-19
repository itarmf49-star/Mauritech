import type { Project, Service, Testimonial } from "@/types/content";

export const siteConfig = {
  name: "MauriTech",
  siteUrl: "https://mauritech.tech",
  title: { fr: "MauriTech | Internet, Wi-Fi & Infrastructure", ar: "MauriTech | إنترنت، واي فاي وبنية تحتية" },
  description: { fr: "Solutions professionnelles en Mauritanie.", ar: "حلول احترافية في موريتانيا." },
  phone: "+222 37 37 97 00",
  whatsapp: "0022237379700",
  whatsappUrl: "https://wa.me/0022237379700",
  whatsappMessage: { fr: "Bonjour, je voudrais des informations.", ar: "مرحباً، أود الحصول على معلومات." },
  email: "mauritech@mauritech.tech",
  officeHours: { fr: "Lun-Sam, 08:30-19:00", ar: "الإثنين - السبت، 08:30 - 19:00" },
  },
  availability: {
    fr: "24/7 pour les urgences",
    ar: "متاح 24/7 للحالات الطارئة",
  },
  responseTime: {
    fr: "Réponse en moins de 2h",
    ar: "الرد خلال أقل من ساعتين",
  },
  location: "Nouakchott, Mauritania",
  
};

export const services: Service[] = [
  { id: "residential-internet", title: { fr: "Internet Résidentiel", ar: "إنترنت منزلي" }, icon: "Home", color: "#F5C542", description: { fr: "Solutions fiables.", ar: "حلول موثوقة." }, image: "/images/services/internet.jpg", href: "/services/res", features: ["Planification", "Installation"] },
  { id: "home-wifi", title: { fr: "Couverture Wi-Fi", ar: "تغطية الواي فاي" }, icon: "Wifi", color: "#F5C542", description: { fr: "Systèmes Mesh.", ar: "أنظمة المش." }, image: "/images/services/wifi.jpg", href: "/services/wifi", features: ["Analyse", "Déploiement"] },
  { id: "business-networks", title: { fr: "Réseaux Entreprise", ar: "شبكات الأعمال" }, icon: "Building2", color: "#F5C542", description: { fr: "Sécurisé.", ar: "آمنة." }, image: "/images/services/business.jpg", href: "/services/bus", features: ["LAN/WAN", "VLAN"] },
  { id: "infrastructure", title: { fr: "Infrastructure", ar: "البنية التحتية" }, icon: "Network", color: "#F5C542", description: { fr: "Câblage structuré.", ar: "كابلات مهيكلة." }, image: "/images/services/infra.jpg", href: "/services/infra", features: ["Câblage", "Armoires"] }
];

export const projectEntries: any[] = [
  {
    id: "1", slug: "enterprise-network-deployment",
    title: { fr: "Déploiement Réseau", ar: "نشر شبكة" },
    category: { fr: "Réseaux", ar: "شبكات" },
    badge: { fr: "Infrastructure", ar: "بنية تحتية" },
    featured: true,
    description: { fr: "Déploiement complet.", ar: "نشر كامل." },
    summary: { fr: "Architecture haute performance.", ar: "هيكلية عالية الأداء." },
    overview: { fr: "MauriTech a déployé...", ar: "قامت MauriTech بنشر..." },
    problem: { fr: "Faible couverture.", ar: "تغطية ضعيفة." },
    solution: { fr: "Câblage structuré.", ar: "كابلات مهيكلة." },
    technologies: ["Switching", "Wi-Fi 6"],
    scope: ["Office", "Cabling"],
    outcome: { fr: "Performance améliorée.", ar: "تحسن في الأداء." },
    image: "/images/projects/1.jpg", gallery: ["/images/1-1.jpg"], tags: ["network"]
  },
  // ... (سأرسل بقية المشاريع في الجزء الثاني فوراً)
  {
    id: "5", slug: "data-center-server-infrastructure",
    title: { fr: "Data Center & Infrastructure", ar: "مركز البيانات والبنية التحتية" },
    category: { fr: "Infrastructure", ar: "بنية تحتية" },
    clientType: "Enterprise", location: "Nouakchott", year: "2026",
    description: { fr: "Salle serveur sécurisée.", ar: "غرفة خوادم آمنة." },
    summary: { fr: "Organisation professionnelle.", ar: "تنظيم احترافي." },
    overview: { fr: "MauriTech a implémenté...", ar: "قامت MauriTech بتنفيذ..." },
    problem: { fr: "Manque d'organisation.", ar: "نقص في التنظيم." },
    solution: { fr: "Organisation de racks.", ar: "تنظيم الخوادم." },
    technologies: ["Server Racks", "UPS"],
    services: ["Design", "Installation"],
    scope: ["Organization"],
    outcome: { fr: "Fiabilité accrue.", ar: "موثوقية أعلى." },
    image: "/images/projects/data-center.jpg", gallery: ["/images/dc1.jpg"], tags: ["data center"]
  },
  {
    id: "6", slug: "business-cloud-backup",
    title: { fr: "Backup & Protection", ar: "النسخ الاحتياطي وحماية البيانات" },
    category: { fr: "Cloud", ar: "سحابة" },
    clientType: "Business", location: "Mauritania", year: "2026",
    description: { fr: "Protection des données.", ar: "حماية البيانات." },
    summary: { fr: "Stratégie de sauvegarde.", ar: "استراتيجية النسخ." },
    overview: { fr: "Backup sécurisé.", ar: "نسخ آمن." },
    problem: { fr: "Données exposées.", ar: "بيانات معرضة للخطر." },
    solution: { fr: "Cloud Backup.", ar: "نسخ سحابي." },
    technologies: ["Cloud Storage", "Encryption"],
    services: ["Backup assessment"],
    scope: ["Data recovery"],
    outcome: { fr: "Données sécurisées.", ar: "بيانات محمية." },
    image: "/images/projects/cloud.jpg", gallery: ["/images/c1.jpg"], tags: ["cloud", "backup"]
  },
  {
    id: "7", slug: "voip-deployment",
    title: { fr: "Téléphonie IP & VoIP", ar: "الهاتف عبر الإنترنت" },
    category: { fr: "Communication", ar: "اتصالات" },
    clientType: "Enterprise", location: "Nouakchott", year: "2026",
    description: { fr: "Solution de communication.", ar: "حلول اتصالات." },
    summary: { fr: "VoIP moderne.", ar: "هاتف حديث." },
    overview: { fr: "Installation IP.", ar: "تركيب أنظمة IP." },
    problem: { fr: "Système obsolète.", ar: "نظام قديم." },
    solution: { fr: "VoIP et VLAN.", ar: "تقنية VoIP و VLAN." },
    technologies: ["IP Phones", "SIP"],
    services: ["Configuration"],
    scope: ["Office communication"],
    outcome: { fr: "Système flexible.", ar: "نظام مرن." },
    image: "/images/projects/voip.jpg", gallery: ["/images/v1.jpg"], tags: ["voip", "sip"]
  },
  {
    id: "8", slug: "retail-wifi-rollout",
    title: { fr: "Wi-Fi Retail", ar: "واي فاي للمتاجر" },
    category: { fr: "Wireless", ar: "لاسلكي" },
    clientType: "Business", location: "Mauritania", year: "2026",
    description: { fr: "Wi-Fi pour retail.", ar: "واي فاي للمتاجر." },
    summary: { fr: "Connectivité stable.", ar: "اتصال مستقر." },
    overview: { fr: "Design réseau.", ar: "تصميم شبكة." },
    problem: { fr: "Zones mortes.", ar: "مناطق ميتة." },
    solution: { fr: "Bornes professionnelles.", ar: "نقاط وصول احترافية." },
    technologies: ["Wi-Fi 6", "AP"],
    services: ["Survey"],
    scope: ["Store coverage"],
    outcome: { fr: "Amélioration.", ar: "تحسين." },
    image: "/images/projects/retail.jpg", gallery: ["/images/r1.jpg"], tags: ["wifi", "retail"]
  },
  {
    id: "9", slug: "structured-network-infra",
    title: { fr: "Infrastructure Structurée", ar: "بنية تحتية مهيكلة" },
    category: { fr: "Enterprise", ar: "مؤسسات" },
    clientType: "Enterprise", location: "Nouakchott", year: "2026",
    description: { fr: "Câblage complet.", ar: "كابلات كاملة." },
    summary: { fr: "Foundation sécurisée.", ar: "أساس آمن." },
    overview: { fr: "Standardisation.", ar: "توحيد المعايير." },
    problem: { fr: "Désorganisation.", ar: "فوضى في الكابلات." },
    solution: { fr: "Câblage certifié.", ar: "كابلات معتمدة." },
    technologies: ["Cat6A", "Fiber"],
    services: ["Cabling"],
    scope: ["Buildings"],
    outcome: { fr: "Scalabilité.", ar: "قابلية للتوسع." },
    image: "/images/projects/cabling.jpg", gallery: ["/images/c2.jpg"], tags: ["cabling"]
  }
];

export const projects: Project[] = projectEntries.map((p) => ({ ...p, odooId: null, status: "completed", synced: false })) as unknown as Project[];

export const testimonials: Testimonial[] = [
  { id: "1", name: "Client IT", role: { fr: "Manager", ar: "مدير" }, quote: { fr: "Très professionnel.", ar: "احترافية عالية." } },
  { id: "2", name: "Client Biz", role: { fr: "Opérations", ar: "عمليات" }, quote: { fr: "Excellent service.", ar: "خدمة ممتازة." } }
];

export function getProjectBySlug(slug: string) { return projects.find((p) => p.slug === slug); }
export function getProjectsByCategory(cat: string) { return projects.filter((p) => JSON.stringify(p.category).includes(cat)); }
export function getFeaturedProjects() { return projects.filter((p) => p.featured); }

// تعريف قائمة المشاريع الخاصة بالشبكات
const NETWORKING_PROJECT_SLUGS = new Set([
  "enterprise-network-deployment",
  "multi-site-wifi-infrastructure",
  "structured-enterprise-network-infrastructure"
]);

export const networkingProjectSlugs = NETWORKING_PROJECT_SLUGS;

export const networkingProjects = projects.filter((project) =>
  NETWORKING_PROJECT_SLUGS.has(project.slug)
);
