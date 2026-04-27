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
    badge: "Field proven",
    description:
      "See the real installs: bullet, dome, and twin-perimeter builds from MauriTech crews — clean conduit, weatherproof boxes, and optics tuned for day/night clarity.",
    summary:
      "Real site photography from recent CCTV rollouts: HiLook, Hikvision, Dahua, Skyworth and more — mounted by MauriTech technicians who commission every lens by hand.",
    overview:
      "This portfolio strip shows how we execute on live sites: branded MauriTech field engineers in uniform, disciplined cable dressing, junction boxes sealed for desert heat and coastal humidity, and overlapping camera geometry that eliminates blind spots. From boutique ceilings to fence-line perimeter pairs, every frame is about workmanship you can trust.",
    problem:
      "Most rollouts fail quietly — loose anchors, moisture ingress, IR hotspots on walls, and nobody accountable on site. Customers deserve proof of craft, not stock imagery.",
    solution:
      "We pair enterprise-grade hardware with repeatable mounting standards: sealed entries, labeled homeruns, validated angles, and documented hand-over packs so your security team owns the story end-to-end.",
    technologies: [
      "HiLook / Hikvision / Dahua IP cameras",
      "Weatherproof junction engineering",
      "Perimeter twin-mount patterns",
      "Night IR balancing",
      "NVR & remote monitoring integration",
    ],
    scope: ["Residential & commercial façades", "Retail ceilings", "Industrial decks", "Fence & mast elevations"],
    outcome:
      "Sharper evidence capture, fewer truck rolls after commissioning, and stakeholders who actually recognize the quality difference on a walkthrough.",
    image: "/images/projects/surveillance/cctv-01.png",
    gallery: [
      "/images/projects/surveillance/crew-01.png",
      "/images/projects/surveillance/crew-02.png",
      "/images/projects/surveillance/crew-03.png",
      "/images/projects/surveillance/cctv-01.png",
      "/images/projects/surveillance/cctv-02.png",
      "/images/projects/surveillance/cctv-03.png",
      "/images/projects/surveillance/cctv-04.png",
      "/images/projects/surveillance/cctv-05.png",
      "/images/projects/surveillance/cctv-06.png",
      "/images/projects/surveillance/cctv-07.png",
      "/images/projects/surveillance/cctv-08.png",
      "/images/projects/surveillance/cctv-09.png",
      "/images/projects/surveillance/cctv-10.png",
      "/images/projects/surveillance/cctv-11.png",
      "/images/projects/surveillance/cctv-12.png",
    ],
    galleryCaptions: [
      "MauriTech technicians on site — coordinated commissioning in branded apparel so every visitor knows who owns quality on your campus.",
      "Close coordination during installation: lenses aimed, cables dressed, and punch-list items closed before we energize PoE.",
      "Team discipline — structured cabling, torque-checked anchors, and respectful site etiquette from arrival to sign-off.",
      "Twin perimeter sweep — dual bullets on a weatherproof mast for overlapping exterior coverage left & right.",
      "HiLook bullet clarity — UV-stable housing, sealed gland entries, and leads that stay serviceable for years.",
      "Ornate ceiling dome — Hikvision discreet optics blended into boutique interiors without compromising IR reach.",
      "Dahua outdoor precision — junction depth for surge paths and thermal breathing room under harsh sun.",
      "Skyworth dual-light 3MP pair — mirrored mounts on architectural corners for ingress control with zero blind wedge.",
      "Elevated mast reach — bullet on extension arm for yards, docks, or fence lines that demand height.",
      "Industrial backbone — Hikvision on corrugated deck with bundled drops aligned to maintenance aisles.",
      "HiLook active heartbeat — status LED confirms sensor power while PoE stays sealed behind the gasket.",
      "Exterior corner geometry — drip loops, clipped runs, and flush junction boxes squared to stucco planes.",
      "Commercial conduit spine — PVC homeruns across ceilings with bend radii that protect copper and fiber hauls.",
      "Night perimeter duo — symmetric IR fill across pedestrian lanes and vehicle gates.",
      "Minimal interior dome — security that disappears architecturally yet delivers forensic-grade streams.",
    ],
    teamHighlight:
      "Spot our crews in MauriTech-branded uniforms on live sites — we wear the logo because we stand behind every anchor, gasket, and aim angle. Ask for the same squad on your renewal wave.",
    youtubeId: "D6Ac5JpCHmI",
    tags: ["cctv", "surveillance", "nvr", "remote monitoring", "perimeter analytics", "security"],
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
    title: "Multi-Site Wi‑Fi, Ubiquiti UniFi & RF Backbone",
    category: "Wireless / Ubiquiti",
    badge: "Predictable airtime",
    description:
      "Tower lifts, backbone bundles, and UniFi-class governance — photography from MauriTech wireless crews aligning antennas, ladder tray hauls, and multi-branch WLAN heatmaps.",
    summary:
      "Real RF work: transmission towers, backbone cabling discipline, and Ubiquiti UniFi stacks orchestrated for roaming that feels invisible.",
    overview:
      "Modern WLAN is more than APs on a ceiling — it is height, fresnel clearance, PoE budgets, and controller policy that stays boringly stable during peak shifts. These frames highlight MauriTech teams elevating radios, dressing backbone paths, and validating throughput where milliseconds matter — retail lanes, warehouses, and campus edges alike.",
    problem:
      "Cookie-cutter Wi-Fi quotes leave you with dead aisles, jittery handsets, and mystery latency every Monday morning.",
    solution:
      "We engineer predictive surveys, standardized UniFi templates, PtP/PtMP paths where fiber is still months away, and acceptance tests that prove roam times before hypercare begins.",
    technologies: [
      "Ubiquiti UniFi Wi‑Fi 6/6E",
      "Cloud & on-prem controllers",
      "PtP / PtMP bridge paths",
      "LAN/WLAN policy harmonization",
      "Captive portals & guest segmentation",
    ],
    scope: ["Tower & rooftop RF", "Warehouse aisles", "Retail floors", "Backbone ladder systems"],
    outcome:
      "Roaming that feels seamless, support tickets that drop, and leadership dashboards that finally agree with what users feel on the floor.",
    image: "/images/projects/wifi-rf-backbone/wifi-04.png",
    gallery: [
      "/images/projects/wifi-rf-backbone/wifi-01.png",
      "/images/projects/wifi-rf-backbone/wifi-02.png",
      "/images/projects/wifi-rf-backbone/wifi-03.png",
      "/images/projects/wifi-rf-backbone/wifi-04.png",
      "/images/projects/wifi-rf-backbone/wifi-05.png",
      "/images/projects/wifi-rf-backbone/wifi-06.png",
      "/images/projects/wifi-rf-backbone/wifi-07.png",
      "/images/projects/wifi-rf-backbone/wifi-08.png",
      "/images/projects/wifi-rf-backbone/wifi-09.png",
      "/images/projects/wifi-rf-backbone/wifi-10.png",
      "/images/projects/wifi-rf-backbone/wifi-11.png",
      "/images/projects/wifi-rf-backbone/wifi-12.png",
    ],
    galleryCaptions: [
      "Transmission backbone — radios staged high to clear fresnel zones between distant buildings.",
      "Elevation matters: mounting crews lift sectors above roof clutter before software tuning.",
      "Symmetrical alignment — mechanical tilt locked first, optimize later in UniFi controller.",
      "Industrial ladder tray haul — backbone bundles dressed for thermal cycling and fast inspections.",
      "PtMP hub posture — focal radio placement feeding spoke sites until fiber catches up.",
      "Smart Solutions crew lift — disciplined cable paths feeding core switches that anchor Wi-Fi.",
      "UniFi footprint indoors — ceiling AP placement matched to predictive heatmaps, not guesses.",
      "Outdoor bridging — hardened uplinks stitching remote gates back to centralized policy.",
      "Warehouse RF sweep — AP spacing tuned for pallet aisles and scanner roaming profiles.",
      "Retail WLAN spine — predictable latency for POS + handheld inventory on shared VLANs.",
      "Dock-door resilience — VLAN templates duplicated across branches so IT stops firefighting Wi-Fi.",
      "Acceptance rigor — throughput traces, roam tests, and sign-off packets before hypercare kicks in.",
    ],
    teamHighlight:
      "MauriTech RF engineers deploy in branded kits — easy to spot on rooftops and ladder tray runs — because accountability should be visible when your airtime is on the line.",
    tags: ["wifi", "ubiquiti", "unifi", "wireless backhaul", "site survey"],
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
