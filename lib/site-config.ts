export type ServiceConfig = {
  number: string;
  title: string;
  text: string;
  tag: string;
  image: string;
  alt: string;
};

export type SiteConfig = {
  hero: {
    lineOne: string;
    lineTwo: string;
    intro: string;
  };
  business: {
    email: string;
    whatsapp: string;
    phone: string;
    serviceArea: string;
    kvk: string;
    establishedYear: string;
  };
  services: ServiceConfig[];
};

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  hero: {
    lineOne: "Hotel standards.",
    lineTwo: "A cleaner kind of calm.",
    intro:
      "Professional cleaning shaped by real housekeeping and quality-control experience—now for homes, offices and hospitality spaces across Amsterdam.",
  },
  business: {
    email: "",
    whatsapp: "",
    phone: "",
    serviceArea: "Amsterdam",
    kvk: "93962142",
    establishedYear: "2025",
  },
  services: [
    {
      number: "01",
      title: "Regular cleaning",
      text: "A dependable routine for a home that stays fresh, calm and ready for everyday life.",
      tag: "Weekly · Biweekly · Monthly",
      image: "/services/regular-cleaning.webp",
      alt: "Blonde JARO cleaner wiping a table during a regular home clean",
    },
    {
      number: "02",
      title: "Deep cleaning",
      text: "A detailed top-to-bottom reset for kitchens, bathrooms and the places daily cleaning misses.",
      tag: "One-time intensive clean",
      image: "/services/deep-cleaning.webp",
      alt: "Professional cleaner carefully deep-cleaning bathroom tiles",
    },
    {
      number: "03",
      title: "Move in / out",
      text: "A thorough handover clean that helps you leave well—or begin in a genuinely fresh space.",
      tag: "Homes · Apartments · Rentals",
      image: "/services/move-in-out.webp",
      alt: "Blonde JARO cleaner preparing an empty apartment for a move",
    },
    {
      number: "04",
      title: "Office cleaning",
      text: "Consistent care for focused, presentable workplaces—from desks and shared areas to washrooms.",
      tag: "Flexible business schedules",
      image: "/services/office-cleaning.webp",
      alt: "Professional cleaner maintaining a modern Amsterdam office",
    },
    {
      number: "05",
      title: "Housekeeping",
      text: "Hospitality-minded room care, presentation and quality checks for serviced apartments and stays.",
      tag: "Hospitality · Short stays",
      image: "/services/housekeeping.webp",
      alt: "Housekeeper preparing a guest bed to hotel standards",
    },
    {
      number: "06",
      title: "Post-renovation cleaning",
      text: "A detailed clean to remove fine dust and renovation residue from apartments, offices and commercial spaces after the work is finished.",
      tag: "Apartments · Offices · Commercial spaces",
      image: "/services/post-renovation-cleaning.webp",
      alt: "Professional cleaner removing construction dust after renovation",
    },
  ],
};

function cleanText(value: unknown, fallback: string, maxLength: number) {
  if (typeof value !== "string") return fallback;
  const cleaned = value.trim().slice(0, maxLength);
  return cleaned || fallback;
}

function optionalText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function safeImagePath(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  const image = value.trim().slice(0, 320);
  if (image.startsWith("/services/") || image.startsWith("/api/media/service-photos/")) return image;
  return fallback;
}

export function sanitizeSiteConfig(input: unknown): SiteConfig {
  const candidate = input && typeof input === "object" ? input as Partial<SiteConfig> : {};
  const hero = candidate.hero && typeof candidate.hero === "object" ? candidate.hero : {};
  const business = candidate.business && typeof candidate.business === "object" ? candidate.business : {};
  const serviceCandidates = Array.isArray(candidate.services) ? candidate.services : [];

  return {
    hero: {
      lineOne: cleanText(hero.lineOne, DEFAULT_SITE_CONFIG.hero.lineOne, 80),
      lineTwo: cleanText(hero.lineTwo, DEFAULT_SITE_CONFIG.hero.lineTwo, 90),
      intro: cleanText(hero.intro, DEFAULT_SITE_CONFIG.hero.intro, 360),
    },
    business: {
      email: optionalText(business.email, 160),
      whatsapp: optionalText(business.whatsapp, 40),
      phone: optionalText(business.phone, 40),
      serviceArea: cleanText(business.serviceArea, DEFAULT_SITE_CONFIG.business.serviceArea, 120),
      kvk: cleanText(business.kvk, DEFAULT_SITE_CONFIG.business.kvk, 30),
      establishedYear: cleanText(business.establishedYear, DEFAULT_SITE_CONFIG.business.establishedYear, 4),
    },
    services: DEFAULT_SITE_CONFIG.services.map((fallback, index) => {
      const service = serviceCandidates[index] && typeof serviceCandidates[index] === "object"
        ? serviceCandidates[index]
        : {};
      return {
        ...fallback,
        title: cleanText(service.title, fallback.title, 80),
        text: cleanText(service.text, fallback.text, 280),
        tag: cleanText(service.tag, fallback.tag, 100),
        image: safeImagePath(service.image, fallback.image),
        alt: cleanText(service.alt, `${cleanText(service.title, fallback.title, 80)} — JARO Cleaning`, 180),
      };
    }),
  };
}
