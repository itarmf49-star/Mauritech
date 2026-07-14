import type { Project, Service, Testimonial } from "@/types/content";

export const siteConfig = {
  name: "MauriTech",

  siteUrl: "https://mauritech.tech",

  title:
    "MauriTech | Internet, Wi-Fi & Network Infrastructure",

  description:
    "MauriTech delivers professional Wi-Fi, fiber optic installation, structured cabling, enterprise networking, security systems and smart infrastructure solutions across Mauritania.",


  phone: "+222 37 37 97 00",

  whatsapp: "0022237379700",

  whatsappUrl:
    "https://wa.me/0022237379700",


  whatsappMessage:
    "Hello MauriTech, I would like to request information about your services.",


  email:
    "mauritech@mauritech.tech",


  officeHours: {
    en:
      "Mon-Sat, 08:30-19:00 GMT",

    fr:
      "Lun-Sam, 08:30-19:00 GMT",

    ar:
      "الإثنين - السبت، 08:30 - 19:00 بتوقيت غرينتش",
  },


  availability: {
    en:
      "24/7 monitoring and technical support escalation",

    fr:
      "Supervision 24/7 et support technique prioritaire",

    ar:
      "مراقبة على مدار الساعة ودعم فني للحالات الحرجة",
  },


  responseTime: {
    en:
      "First technical response within 60 minutes",

    fr:
      "Première réponse technique sous 60 minutes",

    ar:
      "أول استجابة تقنية خلال 60 دقيقة",
  },


  location:
    "Nouakchott, Mauritania",


  companyType:
    "Internet, Wi-Fi and Network Infrastructure Provider",


  services: [
    "Residential Internet",
    "Professional Wi-Fi",
    "Fiber Optic",
    "Enterprise Networks",
    "Security Systems",
    "Smart Infrastructure",
  ],
};



export const services: Service[] = [

  {
    id:
      "residential-internet",

    title:
      "Residential Internet Solutions",

    icon:
      "Home",

    description:
      "Reliable home internet solutions with optimized routing, professional installation, speed planning and stable connectivity.",


    image:
      "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=1200",


    href:
      "/services/residential-internet",


    features:[
      "Home connectivity planning",
      "Professional installation",
      "Router configuration",
      "Performance optimization"
    ]
  },



  {
    id:
      "home-wifi",


    title:
      "Home Wi-Fi Coverage",


    icon:
      "Wifi",


    description:
      "Complete home Wi-Fi design using mesh systems, access points and coverage optimization for every room.",


    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200",


    href:
      "/services/home-wifi",


    features:[
      "Wi-Fi coverage analysis",
      "Mesh deployment",
      "Access point placement",
      "Signal optimization"
    ]
  },



  {
    id:
      "business-networks",


    title:
      "Business Network Solutions",


    icon:
      "Building2",


    description:
      "Secure enterprise networks including LAN/WAN, VLAN segmentation, firewall integration and business connectivity.",


    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200",


    href:
      "/services/business-networks",


    features:[
      "LAN/WAN architecture",
      "VLAN segmentation",
      "Firewall integration",
      "Network monitoring"
    ]
  },



  {
    id:
      "infrastructure",


    title:
      "Network Infrastructure Deployment",


    icon:
      "Network",


    description:
      "Complete structured network deployment including cabling, switching, routing and backbone design.",


    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200",


    href:
      "/services/infrastructure",


    features:[
      "Structured cabling",
      "Network cabinets",
      "Core switching",
      "Fiber backbone"
    ]
  },



  {
    id:
      "fiber-optic",


    title:
      "Fiber Optic Installation",


    icon:
      "Cable",


    description:
      "Professional fiber optic deployment including cable installation, splicing, termination and testing.",


    image:
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200",


    href:
      "/services/fiber-optic",


    features:[
      "Fiber installation",
      "Fusion splicing",
      "OTDR testing",
      "Fiber termination"
    ]
  },



  {
    id:
      "maintenance",


    title:
      "Network Maintenance & Technical Support",


    icon:
      "LifeBuoy",


    description:
      "Preventive maintenance, remote diagnostics, monitoring and professional technical intervention.",


    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200",


    href:
      "/services/maintenance",


    features:[
      "Remote monitoring",
      "Preventive maintenance",
      "Incident response",
      "Technical support"
    ]
  }

];

  {
    id: "1",
    slug: "enterprise-network-deployment",
    title: "Enterprise Network Deployment",
    category: "Enterprise Networking",
    badge: "Enterprise Infrastructure",
    featured: true,

    description:
      "Complete enterprise network deployment including switching, routing, VLAN segmentation, Wi-Fi optimization, and centralized management.",

    summary:
      "High-performance corporate network architecture designed for secure and reliable business operations.",

    overview:
      "MauriTech designed and deployed a complete enterprise network infrastructure for business environments requiring stability, security, and scalability.",

    problem:
      "The existing infrastructure suffered from weak coverage, unmanaged devices, network congestion, and limited visibility.",

    solution:
      "We implemented structured cabling, managed switches, VLAN segmentation, enterprise Wi-Fi, firewall policies, and monitoring.",

    technologies: [
      "Enterprise Switching",
      "Wi-Fi 6 Access Points",
      "VLAN Segmentation",
      "Firewall Security",
      "Structured Cabling",
      "Network Monitoring"
    ],

    scope: [
      "Office network deployment",
      "Network cabinet organization",
      "Core and access switching",
      "Wireless coverage optimization",
      "Documentation and testing"
    ],

    outcome:
      "The customer achieved better performance, stronger security, easier management, and improved user experience.",

    image:
      "/images/projects/enterprise-network/network-rack.jpg",

    gallery: [
      "/images/projects/enterprise-network/network-rack.jpg",
      "/images/projects/enterprise-network/network-switch.jpg",
      "/images/projects/enterprise-network/server-room.jpg"
    ],

    tags: [
      "enterprise",
      "network",
      "switching",
      "vlan",
      "wifi"
    ]
  },


  {
    id: "2",
    slug: "multi-site-wifi-infrastructure",

    title:
      "Multi-Site Wi-Fi Deployment & RF Backbone",

    category:
      "Wireless Infrastructure",

    badge:
      "Wi-Fi Coverage",

    description:
      "Professional wireless deployment using access points, RF planning, outdoor links, and centralized management.",

    summary:
      "Reliable Wi-Fi connectivity for offices, warehouses, campuses, and multi-building environments.",

    overview:
      "MauriTech engineers design wireless networks based on real coverage requirements, user density, interference analysis, and future expansion.",

    problem:
      "Users experienced dead zones, unstable roaming, and inconsistent wireless performance.",

    solution:
      "We performed coverage planning, access point positioning, RF optimization, outdoor wireless bridges, and centralized control.",

    technologies: [
      "Wi-Fi 6",
      "Ubiquiti UniFi",
      "Point-to-Point Links",
      "RF Planning",
      "Guest Wi-Fi",
      "Network Controller"
    ],

    scope: [
      "Multi-floor buildings",
      "Outdoor wireless links",
      "Warehouse coverage",
      "Guest network deployment"
    ],

    outcome:
      "Improved wireless stability with seamless roaming and predictable coverage.",

    image:
      "/images/projects/wifi/wifi-installation.jpg",

    gallery: [
      "/images/projects/wifi/access-point.jpg",
      "/images/projects/wifi/rf-link.jpg",
      "/images/projects/wifi/controller-dashboard.jpg"
    ],

    tags: [
      "wifi",
      "unifi",
      "wireless",
      "rf",
      "coverage"
    ]
  },


  {
    id: "3",

    slug:
      "fiber-optic-network-installation",

    title:
      "Fiber Optic Network Installation",

    category:
      "Fiber Infrastructure",

    badge:
      "High Capacity",

    description:
      "Fiber optic installation including cable deployment, termination, testing, and high-speed backbone connectivity.",

    summary:
      "Reliable fiber links for enterprises, campuses, and long-distance connectivity.",

    overview:
      "MauriTech provides complete fiber optic solutions from planning to final testing and certification.",

    problem:
      "Copper infrastructure limitations affected bandwidth requirements and network expansion.",

    solution:
      "We deployed fiber optic backbone links with proper termination, protection, and performance testing.",

    technologies: [
      "Single Mode Fiber",
      "Multi Mode Fiber",
      "Fiber Termination",
      "OTDR Testing",
      "Fiber Patch Panels"
    ],

    scope: [
      "Fiber cable installation",
      "Rack termination",
      "Testing reports",
      "Backbone connection"
    ],

    outcome:
      "Higher bandwidth capacity, improved reliability, and future-ready network infrastructure.",

    image:
      "/images/projects/fiber/fiber-installation.jpg",

    gallery: [
      "/images/projects/fiber/fiber-splicing.jpg",
      "/images/projects/fiber/fiber-panel.jpg",
      "/images/projects/fiber/fiber-testing.jpg"
    ],

    tags: [
      "fiber",
      "optical",
      "backbone",
      "installation"
    ]
  },

  {
    id: "5",
    slug: "data-center-server-infrastructure",
    title: "Data Center & Server Infrastructure",
    category: "Data Center / Infrastructure",
    clientType: "Enterprise",
    location: "Nouakchott, Mauritania",
    year: "2026",

    description:
      "Secure server room and data infrastructure deployment designed for reliability, organization, and future expansion.",

    summary:
      "Professional rack organization, server infrastructure, power protection, and structured network management.",

    overview:
      "MauriTech designed and implemented a structured server environment including rack organization, network distribution, power management, and secure equipment installation.",

    problem:
      "The existing server environment lacked organization, documentation, and scalable infrastructure for future business growth.",

    solution:
      "We deployed professional rack layouts, structured cabling, network organization, UPS protection, and optimized equipment placement.",

    technologies: [
      "Server Racks",
      "Structured Cabling",
      "Network Cabinets",
      "UPS Power Protection",
      "Switching Infrastructure",
      "Server Management"
    ],

    services: [
      "Server room design",
      "Rack installation",
      "Cable management",
      "Network documentation",
      "Infrastructure maintenance"
    ],

    scope: [
      "Server room organization",
      "Rack deployment",
      "Network cabinet installation",
      "Structured cabling"
    ],

    outcome:
      "A cleaner, more reliable, and maintainable infrastructure ready for future expansion.",

    image:
      "/images/projects/data-center/server-room-main.jpg",

    gallery: [
      "/images/projects/data-center/server-rack.jpg",
      "/images/projects/data-center/cabling.jpg",
      "/images/projects/data-center/network-cabinet.jpg"
    ],

    tags: [
      "data center",
      "server",
      "rack",
      "network infrastructure"
    ]
  },


  {
    id: "6",
    slug: "business-cloud-backup-solution",

    title:
      "Business Cloud Backup & Data Protection",

    category:
      "Cloud / Backup",

    clientType:
      "Business",

    location:
      "Mauritania",

    year:
      "2026",


    description:
      "Backup architecture designed to protect critical business data and improve recovery readiness.",


    summary:
      "Secure backup planning with recovery strategy and monitoring.",


    overview:
      "MauriTech helps organizations design backup strategies combining local protection and cloud-based recovery options.",


    problem:
      "Many businesses depend on important digital files without a structured backup and recovery process.",


    solution:
      "We implemented backup planning, storage organization, access control, and recovery procedures.",


    technologies: [
      "Cloud Storage",
      "Backup Systems",
      "Encryption",
      "Recovery Planning",
      "Monitoring"
    ],


    services: [
      "Backup assessment",
      "Storage planning",
      "Recovery testing",
      "Security recommendations"
    ],


    scope: [
      "Business data backup",
      "Recovery planning",
      "Backup monitoring"
    ],


    outcome:
      "Improved data protection and better preparedness against accidental loss.",


    image:
      "/images/projects/cloud/cloud-backup.jpg",


    gallery: [
      "/images/projects/cloud/cloud-storage.jpg",
      "/images/projects/cloud/backup-dashboard.jpg"
    ],


    tags:[
      "cloud",
      "backup",
      "security",
      "data protection"
    ]

  },



  {
    id:"7",

    slug:
    "ip-telephony-voip-deployment",


    title:
    "IP Telephony & VoIP Deployment",


    category:
    "Communication Systems",


    clientType:
    "Enterprise",


    location:
    "Nouakchott, Mauritania",


    year:
    "2026",


    description:
    "Modern business communication solution based on IP telephony and structured voice networks.",


    summary:
    "Professional VoIP deployment replacing traditional communication limitations.",


    overview:
    "MauriTech deploys IP phone systems with internal extensions, SIP connectivity, and network optimization for business communication.",


    problem:
    "Traditional phone systems limited flexibility and increased communication costs.",


    solution:
    "We installed IP telephony infrastructure with voice VLAN configuration and network optimization.",


    technologies:[
      "IP Phones",
      "VoIP",
      "SIP",
      "Voice VLAN",
      "QoS"
    ],


    services:[
      "VoIP installation",
      "Extension planning",
      "Network optimization",
      "System configuration"
    ],


    scope:[
      "Office communication",
      "IP phones",
      "Centralized management"
    ],


    outcome:
    "A flexible communication system with improved management and scalability.",


    image:
    "/images/projects/voip/ip-phone-office.jpg",


    gallery:[
      "/images/projects/voip/office-phone.jpg",
      "/images/projects/voip/network-switch.jpg"
    ],


    tags:[
      "voip",
      "ip phone",
      "sip",
      "communication"
    ]

  },

  {
    id: "8",

    slug:
      "retail-wifi-coverage-rollout",

    title:
      "Retail Wi-Fi Coverage Deployment",

    category:
      "Wireless / Retail",

    clientType:
      "Business",

    location:
      "Mauritania",

    year:
      "2026",


    description:
      "Professional Wi-Fi deployment for retail environments requiring stable connectivity for customers and business operations.",


    summary:
      "Reliable wireless coverage with centralized management and secure guest access.",


    overview:
      "MauriTech designs retail wireless networks based on store layout, user density, equipment positioning, and operational requirements.",


    problem:
      "Retail locations experienced weak wireless zones and unstable connectivity for staff and customers.",


    solution:
      "We deployed professional access points, structured cabling, guest networks, and centralized monitoring.",


    technologies:[
      "Wi-Fi 6",
      "Access Points",
      "Guest Network",
      "VLAN",
      "Central Management"
    ],


    services:[
      "Wireless survey",
      "Access point installation",
      "Network configuration",
      "Performance testing"
    ],


    scope:[
      "Retail floor coverage",
      "Staff connectivity",
      "Customer Wi-Fi"
    ],


    outcome:
      "Improved wireless experience with reliable coverage and easier management.",


    image:
      "/images/projects/retail-wifi/store-wifi.jpg",


    gallery:[
      "/images/projects/retail-wifi/access-point.jpg",
      "/images/projects/retail-wifi/network-cabinet.jpg"
    ],


    tags:[
      "wifi",
      "retail",
      "wireless",
      "coverage"
    ]
  },



  {
    id:"9",

    slug:
      "structured-enterprise-network-infrastructure",


    title:
      "Structured Enterprise Network Infrastructure",


    category:
      "Enterprise Networking",


    clientType:
      "Enterprise",


    location:
      "Nouakchott, Mauritania",


    year:
      "2026",



    description:
      "Complete structured network infrastructure including cabling, switching, routing and fiber backbone.",


    summary:
      "A professional foundation for secure and scalable enterprise operations.",


    overview:
      "MauriTech delivers structured network solutions following professional cabling and network architecture standards.",


    problem:
      "Organizations often face unmanaged cabling, poor documentation and difficult maintenance.",


    solution:
      "We implemented structured cabling, organized cabinets, switches, VLAN segmentation and network documentation.",


    technologies:[
      "Cat6/Cat6A Cabling",
      "Fiber Backbone",
      "Managed Switches",
      "VLAN",
      "Network Documentation"
    ],


    services:[
      "Structured cabling",
      "Rack installation",
      "Switch configuration",
      "Network testing"
    ],


    scope:[
      "Office buildings",
      "Network cabinets",
      "Backbone links"
    ],


    outcome:
      "A clean, documented and scalable network infrastructure.",


    image:
      "/images/projects/structured-network/network-cabinet.jpg",


    gallery:[
      "/images/projects/structured-network/cat6-cabling.jpg",
      "/images/projects/structured-network/fiber-panel.jpg",
      "/images/projects/structured-network/switch-rack.jpg"
    ],


    tags:[
      "network",
      "cabling",
      "fiber",
      "enterprise"
    ]
  }

] as const;



/**
 * Projects export
 * Ready for Odoo synchronization later
 */
export const projects: Project[] =
  projectEntries.map((project)=>({

    ...project,

    odooId:
      null,

    status:
      "completed",

    synced:
      false

  })) as unknown as Project[];





/**
 * Homepage projects
 * Only featured projects appear
 */
export const featuredProjects =
  projects.filter(
    (project)=>project.featured
  );





/**
 * Networking category
 */
const NETWORKING_PROJECT_SLUGS =
new Set([
  "enterprise-network-deployment",
  "multi-site-wifi-infrastructure",
  "structured-enterprise-network-infrastructure"
]);



export const networkingProjects =
projects.filter(
(project)=>
NETWORKING_PROJECT_SLUGS.has(project.slug)
);



export const networkingProjectSlugs =
NETWORKING_PROJECT_SLUGS;




export const testimonials: Testimonial[] = [

{
id:"1",

name:
"Enterprise Customer",

role:
"IT Manager",

quote:
"MauriTech delivered a reliable network infrastructure with professional installation and clear documentation."
},


{
id:"2",

name:
"Business Client",

role:
"Operations Manager",

quote:
"The Wi-Fi deployment improved connectivity across our facilities and simplified daily operations."
},


{
id:"3",

name:
"Institutional Client",

role:
"Technical Department",

quote:
"Professional planning, clean installation and strong technical support."
}

];





export function getProjectBySlug(
slug:string
){

return projects.find(
(project)=>
project.slug === slug
);

}





export function getProjectsByCategory(
category:string
){

return projects.filter(
(project)=>
project.category
.toLowerCase()
.includes(
category.toLowerCase()
)
);

}





export function getFeaturedProjects(){

return projects.filter(
(project)=>
project.featured
);

}
