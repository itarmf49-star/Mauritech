import type { Service, Testimonial } from "@/types/content";

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
  availability: { fr: "24/7 pour les urgences", ar: "متاح 24/7 للحالات الطارئة" },
  responseTime: { fr: "Réponse en moins de 2h", ar: "الرد خلال أقل من ساعتين" },
  location: "Nouakchott, Mauritania",
};

export const services: Service[] = [
  { id: "residential-internet", title: { fr: "Internet Résidentiel", ar: "إنترنت منزلي" }, icon: "Home", description: { fr: "Solutions fiables.", ar: "حلول موثوقة." }, image: "/images/services/internet.jpg", href: "/services/res", features: ["Planification", "Installation"] },
  { id: "home-wifi", title: { fr: "Couverture Wi-Fi", ar: "تغطية الواي فاي" }, icon: "Wifi", description: { fr: "Systèmes Mesh.", ar: "أنظمة المش." }, image: "/images/services/wifi.jpg", href: "/services/wifi", features: ["Analyse", "Déploiement"] },
  { id: "business-networks", title: { fr: "Réseaux Entreprise", ar: "شبكات الأعمال" }, icon: "Building2", description: { fr: "Sécurisé.", ar: "آمنة." }, image: "/images/services/business.jpg", href: "/services/bus", features: ["LAN/WAN", "VLAN"] },
  { id: "infrastructure", title: { fr: "Infrastructure", ar: "البنية التحتية" }, icon: "Network", description: { fr: "Câblage structuré.", ar: "كابلات مهيكلة." }, image: "/images/services/infra.jpg", href: "/services/infra", features: ["Câblage", "Armoires"] }
];

export const testimonials: Testimonial[] = [
  { id: "1", name: "Client IT", role: { fr: "Manager", ar: "مدير" }, quote: { fr: "Très professionnel.", ar: "احترافية عالية." } },
  { id: "2", name: "Client Biz", role: { fr: "Opérations", ar: "عمليات" }, quote: { fr: "Excellent service.", ar: "خدمة ممتازة." } }
];

