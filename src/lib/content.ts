import type { Project, Service, Testimonial } from "@/types/content";

export const siteConfig = {
  name: "MauriTech",
  siteUrl: "https://mauritech.tech",
  title: "MauriTech | Infrastructure, Security and Smart Systems",
  description:
    "MauriTech designs and deploys secure, scalable infrastructure across Mauritania and West Africa: networking, cloud, surveillance, automation, and enterprise support.",
  phone: "+222 47 77 41 41",
  email: "mauritech@mauritech.tech",
  officeHours: "Mon-Sat, 08:30-19:00 GMT",
  availability: "24/7 monitoring and support escalation",
  responseTime: "First technical response within 60 minutes",
};

export const services: Service[] = [
  {
    id: "networks",
    title: "Network Infrastructure",
    icon: "Network",
    description: "Enterprise LAN/WAN, structured cabling, switching, and resilient Wi-Fi architecture.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200",
    href: "/services#network-infrastructure",
  },
  {
    id: "cloud",
    title: "Server and Cloud Deployment",
    icon: "Server",
    description: "Hybrid cloud, backup policies, virtualization, and hardened server rollouts.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200",
    href: "/services#server-cloud-deployment",
  },
  {
    id: "cctv",
    title: "CCTV and Surveillance",
    icon: "Shield",
    description: "Modern camera systems with secure remote viewing, alerts, retention, and evidence workflows.",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1200",
    href: "/services#cctv-surveillance",
  },
  {
    id: "automation",
    title: "Smart Building Automation",
    icon: "Building2",
    description: "IoT automation for access, lighting, HVAC, and energy analytics.",
    image: "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=1200",
    href: "/services#smart-building-automation",
  },
  {
    id: "consulting",
    title: "Enterprise IT Consulting",
    icon: "BriefcaseBusiness",
    description: "Technical audits, roadmap design, governance, and digital transformation strategy.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200",
    href: "/services#enterprise-it-consulting",
  },
  {
    id: "support",
    title: "Maintenance and Support",
    icon: "LifeBuoy",
    description: "Preventive maintenance, remote diagnostics, on-site intervention, and SLA-backed support.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200",
    href: "/services#maintenance-support",
  },
];

const projectEntries = [
  {
    id: "0",
    slug: "enterprise-ipbx-office-voip-deployment",
    title: "Enterprise IPBX and Office VoIP Deployment",
    category: "IP Telephony / Enterprise Communications",
    badge: "Flagship Deployment",
    featured: true,
    description:
      "Complete enterprise IPBX and VoIP office telephony infrastructure with desk phones, centralized routing, and secure multi-office voice operations.",
    summary:
      "Premium business telephony modernization with IPBX, SIP, office phones, and scalable enterprise voice management (ipbx, voip, office phones, pbx, sip).",
    overview:
      "MauriTech delivered a full enterprise IPBX deployment for internal and external business communications, including VoIP desk phones, extension planning, inter-office routing, and centralized voice administration.",
    problem:
      "The client relied on outdated analog phones with high external communication costs, no centralized internal routing, poor call quality, and limited scalability between offices.",
    solution:
      "We deployed a centralized IPBX with SIP trunks, office IP desk phones, internal extensions, call groups, IVR menus, inter-office voice routing, secure voice VLAN segmentation, and QoS tuning for voice traffic.",
    technologies: [
      "IPBX Server",
      "SIP Trunks",
      "Office IP Phones",
      "PoE Network Switches",
      "Voice VLAN",
      "QoS Traffic Prioritization",
      "Structured Cabling",
      "Call Routing Policies"
    ],
    scope: [
      "Multi-floor office deployment",
      "Reception telephony desk",
      "Executive office phones",
      "Operations desk phones",
      "Centralized extension directory",
      "Branch office voice connectivity",
      "Centralized IPBX administration"
    ],
    outcome:
      "The organization reduced telecom costs, improved internal communication, scaled telephony between offices, centralized call control, enhanced call quality, and introduced professional customer call handling standards.",
    image: "https://images.unsplash.com/photo-1552581234-26160f608093?w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1552581234-26160f608093?w=1400",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1400",
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1400",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1400",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1400",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400",
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=1400"
    ],
    youtubeId: "D6Ac5JpCHmI",
    tags: ["ipbx", "voip", "office phones", "ip telephony", "business phones", "enterprise telephony", "sip", "pbx"]
  },
  {
    id: "1",
    slug: "enterprise-network-deployment",
    title: "Enterprise Network Deployment",
    category: "Networks",
    description: "Core network modernization for a multi-building corporate campus in Nouakchott.",
    summary: "High-performance network backbone with segmented secure access.",
    overview: "MauriTech redesigned the full on-premise network to improve throughput, resilience, and access control across four buildings.",
    problem: "The client faced recurring outages, weak roaming, and limited visibility into traffic and security events.",
    solution: "We delivered a segmented architecture with managed switching, Wi-Fi 6 coverage planning, failover internet, and centralized monitoring.",
    technologies: ["Wi-Fi 6", "Managed PoE Switching", "VLAN Segmentation", "Firewall Policies", "Monitoring Dashboard"],
    scope: ["4 buildings", "380+ users", "24 network cabinets", "Full commissioning and documentation"],
    outcome: "Throughput increased by 42% and incident volume dropped by 63% within the first quarter.",
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1400"
    ],
    youtubeId: "n2v0Jv7pRp8"
  },
  {
    id: "2",
    slug: "enterprise-cctv-smart-surveillance-deployment",
    title: "Enterprise CCTV and Smart Surveillance Deployment",
    category: "Security / Surveillance",
    description: "Advanced surveillance infrastructure with AI-assisted analytics, NVR orchestration, and secure remote monitoring.",
    summary: "Enterprise-grade smart surveillance with perimeter intelligence and operational control.",
    overview: "MauriTech designed and deployed a complete enterprise surveillance architecture with multi-zone camera coverage, central video management, remote operations visibility, and secure evidence workflows.",
    problem: "The client had fragmented camera infrastructure, inconsistent video retention, and no reliable perimeter analytics or centralized remote management.",
    solution: "We implemented a modern CCTV stack with multi-camera zoning, redundant NVR storage, encrypted remote monitoring, smart motion analytics, and security operations dashboards.",
    technologies: ["4K IP Cameras", "NVR Systems", "Remote Monitoring Platform", "Perimeter Analytics", "Secure Video Retention"],
    scope: ["120+ camera endpoints", "Indoor and outdoor zones", "Central monitoring room", "Escalation workflows"],
    outcome: "Security teams improved incident detection speed, strengthened perimeter coverage, and reduced false-positive response overhead.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=1400",
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=1400",
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1400"
    ],
    youtubeId: "D6Ac5JpCHmI",
    tags: ["cctv", "surveillance", "nvr", "remote monitoring", "perimeter analytics", "security"]
  },
  {
    id: "3",
    slug: "smart-building-automation-access-control",
    title: "Smart Building Automation and Access Control",
    category: "Automation / Access Control",
    description: "Integrated building automation with RFID and biometric access, visitor governance, and policy-driven control.",
    summary: "Intelligent building operations with secure entry, automation dashboards, and compliance visibility.",
    overview: "MauriTech unified smart building controls and access security into one management environment covering entry policies, visitor validation, and occupancy automation.",
    problem: "Disconnected access systems and manual visitor handling created operational delays and governance risks.",
    solution: "We deployed RFID and biometric entry points, centralized policy administration, automation dashboards, and real-time visitor tracking controls.",
    technologies: ["RFID Readers", "Biometric Access", "Automation Dashboards", "Policy Engine", "Visitor Control Module"],
    scope: ["48 controlled access points", "HQ + annex building", "Visitor and contractor workflows"],
    outcome: "The client improved access security, accelerated visitor processing, and gained centralized governance over building operations.",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=1400",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1400",
      "https://images.unsplash.com/photo-1551281044-8fce459a0078?w=1400"
    ],
    youtubeId: "8pDqJVdNa44",
    tags: ["smart building", "access control", "rfid", "biometric", "visitor control", "automation"]
  },
  {
    id: "4",
    slug: "multi-site-wifi-infrastructure",
    title: "Multi-Site WiFi Infrastructure",
    category: "Networks",
    description: "Consistent secure wireless coverage across branch offices and warehouses.",
    summary: "Centralized Wi-Fi governance for distributed operations.",
    overview: "MauriTech delivered standardized wireless architecture for six operational sites.",
    problem: "Each branch had different hardware and inconsistent security baselines.",
    solution: "Standardized hardware, cloud control plane, and unified policy templates.",
    technologies: ["Cloud WLAN", "Wi-Fi 6 APs", "Roaming Optimization", "Captive Portal"],
    scope: ["6 locations", "1,100+ concurrent clients"],
    outcome: "Improved user experience consistency while reducing support tickets by 48%.",
    image: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=1400",
      "https://images.unsplash.com/photo-1496096265110-f83ad7f96608?w=1400",
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1400"
    ]
  },
  {
    id: "5",
    slug: "data-center-secure-server-infrastructure",
    title: "Data Center and Secure Server Infrastructure",
    category: "Data Center / Servers",
    description: "Enterprise data center modernization with secure rack architecture, virtualization, resilient power, and storage continuity.",
    summary: "Secure server infrastructure upgrade with redundancy, virtualization, and operational resilience.",
    overview: "MauriTech redesigned core data center infrastructure to support growth, resilience, and security with structured rack standards and hardened server operations.",
    problem: "Legacy server rooms lacked redundancy, had inconsistent rack organization, and struggled with scalable compute and backup governance.",
    solution: "We implemented structured rack design, virtualization clusters, redundant UPS and power paths, enterprise backup controls, and secure management segmentation.",
    technologies: ["Server Racks", "Virtualization Cluster", "Redundant Power", "Enterprise Storage", "Backup Architecture", "Secure Management Network"],
    scope: ["Primary data center + DR zone", "Rack and cabling redesign", "Centralized server operations controls"],
    outcome: "The client improved service continuity, reduced outage risk, and established a scalable secure compute platform.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=1400",
      "https://images.unsplash.com/photo-1488229297570-58520851e868?w=1400",
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=1400"
    ],
    tags: ["data center", "server infrastructure", "virtualization", "redundant power", "storage", "backup"]
  },
  {
    id: "6",
    slug: "cloud-backup-architecture",
    title: "Cloud Backup Architecture",
    category: "Cloud",
    description: "Secure backup and disaster recovery design for business-critical data.",
    summary: "Resilient backup posture with tested recovery playbooks.",
    overview: "We implemented layered backup architecture aligned with RPO/RTO business objectives.",
    problem: "Backups existed but were not consistently tested and restoration was slow.",
    solution: "Automated snapshots, immutable retention options, and routine restore validation.",
    technologies: ["Object Storage", "Snapshot Policies", "Backup Encryption", "Recovery Drills"],
    scope: ["12 workloads", "Cross-region replication"],
    outcome: "Validated recovery process and reduced potential downtime exposure.",
    image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1400",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1400"
    ]
  },
  {
    id: "7",
    slug: "ip-telephony-deployment",
    title: "IP Telephony Deployment",
    category: "Communications",
    description: "Scalable VoIP rollout with QoS tuning and branch interconnectivity.",
    summary: "Modern voice stack replacing legacy PBX constraints.",
    overview: "A unified communication platform deployed for HQ and remote teams.",
    problem: "Legacy telephony had high maintenance costs and limited flexibility.",
    solution: "VoIP migration with QoS policies and improved call routing.",
    technologies: ["VoIP", "SIP Trunks", "QoS", "Call Analytics"],
    scope: ["230 endpoints", "HQ + branches"],
    outcome: "Lower communication costs and improved call quality consistency.",
    image: "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400",
      "https://images.unsplash.com/photo-1552581234-26160f608093?w=1400",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1400"
    ]
  },
  {
    id: "8",
    slug: "retail-security-monitoring",
    title: "Retail Security Monitoring",
    category: "Security",
    description: "Retail security monitoring with centralized event visibility and evidence indexing.",
    summary: "Multi-branch security intelligence for retail operations.",
    overview: "Security analytics and monitoring were standardized across retail locations.",
    problem: "Fragmented monitoring delayed incident response and reporting.",
    solution: "Consolidated monitoring center with camera analytics and policy alerts.",
    technologies: ["CCTV Analytics", "Centralized Monitoring", "Alert Workflows"],
    scope: ["14 stores", "Control room setup"],
    outcome: "Improved incident response time and stronger operational visibility.",
    image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400",
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1400",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400"
    ],
    tags: ["retail", "security monitoring", "cctv analytics"]
  },
  {
    id: "9",
    slug: "structured-enterprise-network-infrastructure",
    title: "Structured Enterprise Network Infrastructure",
    category: "Enterprise Networking",
    description: "Full enterprise network architecture with switching, routing, VLAN zoning, and fiber backbone interconnects.",
    summary: "Structured corporate network foundation for secure, high-throughput operations.",
    overview: "MauriTech delivered a complete structured enterprise network deployment spanning access, distribution, and core layers with security segmentation.",
    problem: "The organization operated with inconsistent routing design, weak segmentation, and limited backbone capacity between critical departments.",
    solution: "We deployed managed switches, enterprise routing, VLAN segmentation, fiber backbone links, and security policy enforcement across the network stack.",
    technologies: ["Enterprise Switches", "Core Routers", "VLAN Segmentation", "Fiber Backbone", "Network Access Policies"],
    scope: ["Head office + branch connectivity", "Core-distribution-access topology", "Secure segmentation rollout"],
    outcome: "Network reliability and throughput improved while reducing security exposure and simplifying operations.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400",
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=1400",
      "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=1400"
    ],
    tags: ["structured network", "switches", "routers", "vlan", "fiber backbone", "enterprise network"]
  }
] as const;

export const projects: Project[] = projectEntries as unknown as Project[];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Ahmed Mohamed",
    role: "Operations Manager",
    quote: "MauriTech delivered a stable infrastructure with excellent execution quality.",
  },
  {
    id: "2",
    name: "Sara Aldakhil",
    role: "Facility Director",
    quote: "The team modernized our security stack without downtime and with clear documentation.",
  },
  {
    id: "3",
    name: "Fatimetou Sidi",
    role: "CIO, Logistics Group",
    quote: "Execution was fast, structured, and aligned with enterprise governance standards.",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
