import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const SITE_URL = "https://janor.nl";
const SITE_NAME = "Janor Cleaning Amsterdam";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Janor Cleaning Amsterdam | Professional Cleaning Services",
    template: "%s | Janor Cleaning Amsterdam",
  },
  description:
    "Janor Cleaning offers professional home, office and Airbnb cleaning in Amsterdam with hotel-standard results. Request a free quote today.",
  keywords: [
    "cleaning service Amsterdam",
    "house cleaning Amsterdam",
    "office cleaning Amsterdam",
    "Airbnb cleaning Amsterdam",
    "professional cleaners Amsterdam",
    "schoonmaakbedrijf Amsterdam",
    "schoonmaakdienst Amsterdam",
    "huishoudelijke hulp Amsterdam",
    "Janor cleaning",
    "hotel cleaning Amsterdam",
    "deep cleaning Amsterdam",
    "regular cleaning Amsterdam",
  ],
  authors: [{ name: "Janor Cleaning", url: SITE_URL }],
  creator: "Janor Cleaning Amsterdam",
  publisher: "Janor Cleaning Amsterdam",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en": SITE_URL,
      "nl": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_NL",
    alternateLocale: ["nl_NL"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Janor Cleaning Amsterdam | Hotel-Standard Cleaning Services",
    description:
      "Professional cleaning for homes, offices and Airbnb spaces in Amsterdam. Hotel-trained team, clear quotes, consistent results. Book today.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Janor Cleaning Amsterdam — Professional Cleaning Services",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Janor Cleaning Amsterdam | Professional Cleaning Services",
    description:
      "Hotel-standard cleaning for homes, offices and Airbnb in Amsterdam. Clear quotes, reliable team.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
  category: "cleaning services",
  other: {
    "codex-preview": "development",
  },
};

// Local Business structured data for Google rich results
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Janor Cleaning Amsterdam",
  alternateName: "Janor Cleaning",
  url: SITE_URL,
  description:
    "Professional cleaning company in Amsterdam offering home cleaning, office cleaning, deep cleaning and Airbnb/short-stay cleaning services with hotel-standard quality.",
  logo: `${SITE_URL}/favicon.svg`,
  image: `${SITE_URL}/og-image.jpg`,
  priceRange: "€€",
  currenciesAccepted: "EUR",
  paymentAccepted: "Cash, Credit Card, Bank Transfer",
  areaServed: {
    "@type": "City",
    name: "Amsterdam",
    sameAs: "https://www.wikidata.org/wiki/Q727",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Amsterdam",
    addressRegion: "Noord-Holland",
    addressCountry: "NL",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 52.3676,
    longitude: 4.9041,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "16:00",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Cleaning Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Regular Cleaning",
          description: "Ongoing home or office cleaning on a weekly or bi-weekly schedule.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Deep Cleaning",
          description: "Thorough top-to-bottom cleaning of your entire space.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Move-In / Move-Out Cleaning",
          description: "End-of-tenancy or pre-move-in cleaning to hotel standard.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Airbnb & Short-Stay Cleaning",
          description: "Fast, reliable turnaround cleaning for short-term rental properties.",
        },
      },
    ],
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#082b29" />
        <meta name="color-scheme" content="light" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="antialiased">
        {children}
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
