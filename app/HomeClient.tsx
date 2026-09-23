"use client";

import { FormEvent, useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiPhoneCall, FiEdit3, FiMessageSquare } from "react-icons/fi";
import type { SiteConfig } from "@/lib/site-config";

// ─── Translations ──────────────────────────────────────────────────────────────
const translations = {
  en: {
    nav: { services: "Services", standard: "Our standard", about: "About", contact: "Contact" },
    header: { cta: "Get a free quote" },
    hero: {
      eyebrow: "Amsterdam cleaning company",
      cta: "Request a free quote",
      whatsapp: "WhatsApp",
      call: "Call now",
      servicesLink: "Explore our services",
      proof: [
        { icon: "★", title: "Hotel-trained eye", sub: "Details never skipped" },
        { icon: "✓", title: "Clear scope & quote", sub: "No vague promises" },
        { icon: "◎", title: "Quality checked", sub: "Consistent every time" },
      ],
    },
    qualityCard: {
      standard: "JANOR STANDARD",
      check: "QUALITY CHECK",
      roomStatus: "ROOM STATUS",
      ready: "Ready.",
      items: ["Surfaces & details", "Kitchen & bathroom", "Floors & final finish"],
      footer: "Checked with care",
      location: "JANOR · AMSTERDAM",
    },
    floatingNotes: [
      { title: "Detail first", sub: "Hotel-level finish" },
      { title: "Personally checked", sub: "Accountability built in" },
    ],
    services: {
      eyebrow: "Services",
      heading: "Exactly the clean\nyour space needs.",
      intro: "Start with the right service. We agree on the scope before work begins, so expectations stay clear from the first message to the final check.",
      notSure: "NOT SURE?",
      tellUs: "Tell us about\nyour space.",
      tellUsSub: "We will help you choose the right service and prepare a clear quotation.",
      buildRequest: "Build your request",
    },
    standard: {
      eyebrow: "The Janor standard",
      heading: "Not just cleaned.\nChecked.",
      intro: "Hotel housekeeping taught us something simple: a room is not ready because the work is finished. It is ready when the result has been checked.",
      cta: "Plan your cleaning",
      items: [
        { number: "01", title: "Clear scope", text: "We agree what is included, what needs extra attention and how the space should look when finished." },
        { number: "02", title: "Room-by-room checklist", text: "A structured route keeps the work thorough and prevents small but important details from being missed." },
        { number: "03", title: "Final inspection", text: "The job is reviewed against the agreed scope before the space is considered ready." },
        { number: "04", title: "Direct communication", text: "You know who is responsible, what is happening and where to reach us when plans change." },
      ],
    },
    about: {
      eyebrow: "The standard behind Janor",
      heading: "One name.\nOne standard.",
      lead: "Janor is built around a simple promise: reliable work, clear communication and attention to the details that change how a space feels.",
      body: "Our operating standard is shaped by hands-on experience in hotel housekeeping and quality supervision. That experience becomes a practical system for private homes, offices, hospitality spaces and post-renovation cleaning: clear expectations, structured work and a final check.",
      values: ["Care", "Reliability", "Detail"],
    },
    pricing: {
      eyebrow: "Honest pricing",
      heading: "Clear before\nwe begin.",
      intro: "We do not advertise a cheap fixed price and surprise you later. Your quotation is based on the actual work required.",
      items: ["Service and frequency", "Floor area and rooms", "Current condition", "Requested extras"],
    },
    quote: {
      eyebrow: "Free quotation",
      heading: "Tell us what\nneeds cleaning.",
      intro: "Complete the details below. The clearer the request, the faster we can prepare an accurate quotation.",
      note: { title: "No instant fake price", sub: "A real quotation based on your space and requested work." },
      form: {
        service: "Service needed",
        serviceDefault: "Select a service",
        property: "Property type",
        propertyDefault: "Select property type",
        propertyOptions: ["Apartment", "House", "Office", "Hospitality space", "Other"],
        postcode: "Amsterdam postcode",
        postcodePlaceholder: "e.g. 1012 AB",
        size: "Approximate size",
        date: "Preferred date",
        name: "Your name",
        namePlaceholder: "Name",
        contact: "Email or phone",
        contactPlaceholder: "How should we contact you?",
        details: "Extra details",
        detailsPlaceholder: "Number of rooms, condition, extras or access details…",
        submit: "Send request to Janor",
        submitting: "Sending request…",
        privacy: "Your details are sent securely to Janor Cleaning and used only to respond to this request.",
        website: "Website",
      },
      ready: {
        sent: "Request sent",
        saved: "Request saved",
        titleSent: "Janor received your request.",
        titleReady: "Your request is ready.",
        bodySent: "We sent the details to Janor by email. You can also continue directly in WhatsApp.",
        bodyNotConnected: "Email delivery is not connected yet. Please continue by WhatsApp or call Janor.",
        sendWhatsApp: "Send by WhatsApp",
        sendEmail: "Send by email",
        copy: "Copy request",
        copied: "Copied ✓",
        edit: "Edit details",
      },
    },
    faq: {
      eyebrow: "Good to know",
      heading: "Frequently asked\nquestions.",
      items: [
        ["Do you bring cleaning products and equipment?", "We agree this before the appointment. Your quotation will clearly state which products and equipment are included or need to be available at the property."],
        ["How is the price calculated?", "The quotation depends on the service, floor area, number of rooms, current condition and any extras such as an oven, fridge or interior windows."],
        ["Do I need to be home during the cleaning?", "Not necessarily. We can agree on safe access and key handling in advance. For a first appointment, a short introduction is helpful."],
        ["Which areas do you serve?", "The first service area is Amsterdam. Requests just outside Amsterdam can be discussed depending on the location and size of the job."],
        ["Can I book recurring cleaning?", "Yes. Weekly, biweekly and monthly schedules can be arranged after the first clean and a clear assessment of the space."],
        ["Do you clean apartments and spaces after renovation?", "Yes. Post-renovation cleaning can include removal of fine construction dust and residue from surfaces, floors, kitchens, bathrooms and other agreed areas. The exact scope is confirmed before the quotation."],
      ],
    },
    reviews: {
      eyebrow: "Your experience counts",
      heading: "Customer reviews",
      note: "We are collecting our first reviews. The texts below are examples, not real customer reviews.",
      exampleLabel: "Example · not a real review",
      writeBtn: "Write a review",
      writeTitle: "Write about your experience",
      writeIntro: "Have you used Janor Cleaning? Share your honest experience. Your text will not be published on the website automatically.",
      nameLabel: "Your name",
      serviceLabel: "Service",
      reviewLabel: "Your review",
      prepareBtn: "Prepare review",
      preparedIntro: "Your review is ready. Send it via WhatsApp or email when available, or copy the text.",
      sendWhatsApp: "Send via WhatsApp",
      sendEmail: "Send via email",
      copyBtn: "Copy text",
      copiedBtn: "Copied",
      noContact: "Contact details will be added soon. You can copy the text now; it has not been sent yet.",
      copyError: "Copying failed. Select and copy the text above.",
      prepareReviewSummary: (name: string, service: string, text: string) =>
        `My review of Janor Cleaning\nName: ${name}\nService: ${service}\n\n${text}`,
    },
    whatsappMessage: "Hello Janor Cleaning, I would like a quotation.",
    whatsappDock: "Message us",
    callDock: "Call now",
    footer: {
      tagline: "Hotel-standard attention to detail for Amsterdam homes, offices and hospitality spaces.",
      explore: "Explore",
      navLinks: ["Services", "Our standard", "About", "Get a quote"],
      serviceArea: "Service area",
      serviceAreaSub: "Surrounding areas on request",
      company: "Company details",
      noContact: "Contact details to be connected",
      backToTop: "Back to top ↑",
      starsNote: "Five stars are a decorative brand element—not a customer rating.",
    },
  },
  nl: {
    nav: { services: "Diensten", standard: "Onze standaard", about: "Over ons", contact: "Contact" },
    header: { cta: "Gratis offerte" },
    hero: {
      eyebrow: "Schoonmaakbedrijf Amsterdam",
      cta: "Vraag een gratis offerte aan",
      whatsapp: "WhatsApp",
      call: "Bel nu",
      servicesLink: "Bekijk onze diensten",
      proof: [
        { icon: "★", title: "Hotelervaring", sub: "Details worden nooit overgeslagen" },
        { icon: "✓", title: "Duidelijke scope & prijs", sub: "Geen vage beloftes" },
        { icon: "◎", title: "Kwaliteitscontrole", sub: "Elke keer consistent" },
      ],
    },
    qualityCard: {
      standard: "JANOR STANDAARD",
      check: "KWALITEITSCONTROLE",
      roomStatus: "RUIMTESTATUS",
      ready: "Klaar.",
      items: ["Oppervlakken & details", "Keuken & badkamer", "Vloeren & eindresultaat"],
      footer: "Met zorg gecontroleerd",
      location: "JANOR · AMSTERDAM",
    },
    floatingNotes: [
      { title: "Detail voorop", sub: "Hotelniveau afwerking" },
      { title: "Persoonlijk gecontroleerd", sub: "Verantwoording ingebouwd" },
    ],
    services: {
      eyebrow: "Diensten",
      heading: "Precies de schoonmaak\ndie uw ruimte nodig heeft.",
      intro: "Begin met de juiste dienst. We spreken de omvang af voordat het werk begint, zodat de verwachtingen helder blijven van het eerste bericht tot de eindcontrole.",
      notSure: "NIET ZEKER?",
      tellUs: "Vertel ons over\nuw ruimte.",
      tellUsSub: "We helpen u de juiste dienst te kiezen en stellen een duidelijke offerte op.",
      buildRequest: "Stel uw aanvraag samen",
    },
    standard: {
      eyebrow: "De Janor standaard",
      heading: "Niet alleen schoon.\nGecontroleerd.",
      intro: "De hotelhuishouding leerde ons iets eenvoudigs: een kamer is niet klaar omdat het werk af is. Het is klaar als het resultaat is gecontroleerd.",
      cta: "Plan uw schoonmaak",
      items: [
        { number: "01", title: "Duidelijke scope", text: "We spreken af wat inbegrepen is, wat extra aandacht nodig heeft en hoe de ruimte er na afloop uit moet zien." },
        { number: "02", title: "Kamer-voor-kamer checklist", text: "Een gestructureerde route houdt het werk grondig en voorkomt dat kleine maar belangrijke details worden overgeslagen." },
        { number: "03", title: "Eindcontrole", text: "Het werk wordt getoetst aan de afgesproken scope voordat de ruimte als gereed wordt beschouwd." },
        { number: "04", title: "Directe communicatie", text: "U weet wie verantwoordelijk is, wat er gebeurt en waar u ons kunt bereiken als plannen veranderen." },
      ],
    },
    about: {
      eyebrow: "De standaard achter Janor",
      heading: "Één naam.\nÉén standaard.",
      lead: "Janor is gebouwd op een eenvoudige belofte: betrouwbaar werk, duidelijke communicatie en aandacht voor de details die bepalen hoe een ruimte aanvoelt.",
      body: "Onze werkstandaard is gevormd door praktijkervaring in de hotelhuishouding en kwaliteitstoezicht. Die ervaring wordt een praktisch systeem voor particuliere woningen, kantoren, horecagelegenheden en renovatieschoonmaak: duidelijke verwachtingen, gestructureerd werk en een eindcontrole.",
      values: ["Zorg", "Betrouwbaarheid", "Detail"],
    },
    pricing: {
      eyebrow: "Eerlijke prijzen",
      heading: "Duidelijk voor\nwe beginnen.",
      intro: "We adverteren geen goedkope vaste prijs en verrassen u later. Uw offerte is gebaseerd op het daadwerkelijk benodigde werk.",
      items: ["Dienst en frequentie", "Vloeroppervlak en kamers", "Huidige staat", "Gevraagde extra's"],
    },
    quote: {
      eyebrow: "Gratis offerte",
      heading: "Vertel ons wat\nschoongemaakt moet worden.",
      intro: "Vul de gegevens hieronder in. Hoe duidelijker de aanvraag, hoe sneller we een nauwkeurige offerte kunnen opstellen.",
      note: { title: "Geen nep-directe prijs", sub: "Een echte offerte op basis van uw ruimte en gevraagd werk." },
      form: {
        service: "Gewenste dienst",
        serviceDefault: "Selecteer een dienst",
        property: "Type eigendom",
        propertyDefault: "Selecteer type eigendom",
        propertyOptions: ["Appartement", "Huis", "Kantoor", "Horecagelegenheid", "Anders"],
        postcode: "Amsterdam postcode",
        postcodePlaceholder: "bijv. 1012 AB",
        size: "Geschatte oppervlakte",
        date: "Gewenste datum",
        name: "Uw naam",
        namePlaceholder: "Naam",
        contact: "E-mail of telefoon",
        contactPlaceholder: "Hoe kunnen we u bereiken?",
        details: "Extra details",
        detailsPlaceholder: "Aantal kamers, staat, extra's of toegangsgegevens…",
        submit: "Aanvraag versturen naar Janor",
        submitting: "Aanvraag verzenden…",
        privacy: "Uw gegevens worden veilig verzonden naar Janor Cleaning en uitsluitend gebruikt om op deze aanvraag te reageren.",
        website: "Website",
      },
      ready: {
        sent: "Aanvraag verzonden",
        saved: "Aanvraag opgeslagen",
        titleSent: "Janor heeft uw aanvraag ontvangen.",
        titleReady: "Uw aanvraag is klaar.",
        bodySent: "We hebben de gegevens per e-mail naar Janor gestuurd. U kunt ook direct doorgaan via WhatsApp.",
        bodyNotConnected: "E-mailbezorging is nog niet gekoppeld. Ga verder via WhatsApp of bel Janor.",
        sendWhatsApp: "Verstuur via WhatsApp",
        sendEmail: "Verstuur via e-mail",
        copy: "Aanvraag kopiëren",
        copied: "Gekopieerd ✓",
        edit: "Gegevens bewerken",
      },
    },
    faq: {
      eyebrow: "Goed om te weten",
      heading: "Veelgestelde\nvragen.",
      items: [
        ["Neemt u schoonmaakproducten en apparatuur mee?", "Dit spreken we af voor de afspraak. In uw offerte staat duidelijk welke producten en apparatuur inbegrepen zijn of beschikbaar moeten zijn op de locatie."],
        ["Hoe wordt de prijs berekend?", "De offerte is afhankelijk van de dienst, het vloeroppervlak, het aantal kamers, de huidige staat en eventuele extra's zoals een oven, koelkast of binnenramen."],
        ["Moet ik thuis zijn tijdens de schoonmaak?", "Niet per se. We kunnen vooraf veilige toegang en sleutelbeheer afspreken. Bij een eerste afspraak is een korte kennismaking wel prettig."],
        ["Welke gebieden bedient u?", "Het eerste servicegebied is Amsterdam. Aanvragen net buiten Amsterdam kunnen worden besproken afhankelijk van de locatie en omvang van de klus."],
        ["Kan ik terugkerende schoonmaak boeken?", "Ja. Wekelijkse, tweewekelijkse en maandelijkse schema's kunnen worden geregeld na de eerste schoonmaak en een duidelijke beoordeling van de ruimte."],
        ["Reinigt u appartementen en ruimtes na renovatie?", "Ja. Renovatieschoonmaak kan het verwijderen van fijn bouwstof en resten van oppervlakken, vloeren, keukens, badkamers en andere afgesproken gebieden omvatten. De exacte omvang wordt bevestigd voor de offerte."],
      ],
    },
    reviews: {
      eyebrow: "Uw ervaring telt",
      heading: "Klantbeoordelingen",
      note: "We verzamelen onze eerste beoordelingen. De onderstaande teksten zijn voorbeelden, geen echte klantbeoordelingen.",
      exampleLabel: "Voorbeeld · geen echte beoordeling",
      writeBtn: "Schrijf een beoordeling",
      writeTitle: "Schrijf over uw ervaring",
      writeIntro: "Heeft u Janor Cleaning ingeschakeld? Deel uw eerlijke ervaring. Uw tekst wordt niet automatisch op de website gepubliceerd.",
      nameLabel: "Uw naam",
      serviceLabel: "Dienst",
      reviewLabel: "Uw beoordeling",
      prepareBtn: "Beoordeling voorbereiden",
      preparedIntro: "Uw beoordeling is voorbereid. Verstuur deze via WhatsApp of e-mail wanneer beschikbaar, of kopieer de tekst.",
      sendWhatsApp: "Verstuur via WhatsApp",
      sendEmail: "Verstuur via e-mail",
      copyBtn: "Kopieer tekst",
      copiedBtn: "Tekst gekopieerd",
      noContact: "Contactgegevens worden binnenkort toegevoegd. U kunt de tekst nu kopiëren; deze is nog niet verstuurd.",
      copyError: "Kopiëren lukt niet. Selecteer en kopieer de tekst hierboven.",
      prepareReviewSummary: (name: string, service: string, text: string) =>
        `Mijn beoordeling van Janor Cleaning\nNaam: ${name}\nDienst: ${service}\n\n${text}`,
    },
    whatsappMessage: "Hallo Janor Cleaning, ik wil graag een offerte aanvragen.",
    whatsappDock: "Stuur bericht",
    callDock: "Bel nu",
    footer: {
      tagline: "Hotelstandaard aandacht voor detail voor Amsterdamse woningen, kantoren en horecagelegenheden.",
      explore: "Ontdek",
      navLinks: ["Diensten", "Onze standaard", "Over ons", "Offerte aanvragen"],
      serviceArea: "Servicegebied",
      serviceAreaSub: "Omliggende gebieden op aanvraag",
      company: "Bedrijfsgegevens",
      noContact: "Contactgegevens worden binnenkort toegevoegd",
      backToTop: "Terug naar boven ↑",
      starsNote: "Vijf sterren zijn een decoratief brandelement — geen klantbeoordeling.",
    },
  },
} as const;

type Lang = keyof typeof translations;

const reviewsData = {
  en: [
    { service: "Regular cleaning", text: "Pleasant communication and a fresh, clean home. The attention to the kitchen and bathroom made the difference." },
    { service: "Move in / out", text: "The move-out clean was clearly agreed upon. The apartment felt clean and ready for a fresh start." },
    { service: "Office cleaning", text: "A well-kept workplace and clear agreements about the cleaning. Great that the work could be done outside office hours." },
  ],
  nl: [
    { service: "Reguliere schoonmaak", text: "Prettige communicatie en een frisse, schone woning. Vooral de aandacht voor de keuken en badkamer maakte het verschil." },
    { service: "Verhuisschoonmaak", text: "De schoonmaak voor de verhuizing was duidelijk afgesproken. Het appartement voelde schoon en klaar voor een nieuwe start." },
    { service: "Kantoorschoonmaak", text: "Een verzorgde werkplek en duidelijke afspraken over de schoonmaak. Fijn dat de werkzaamheden buiten onze kantooruren konden plaatsvinden." },
  ],
};

// ─── Flag SVG components ───────────────────────────────────────────────────────
function FlagGB() {
  return (
    <svg width="22" height="16" viewBox="0 0 60 40" aria-hidden="true" style={{ display: "block" }}>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="5" />
      <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="13" />
      <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="8" />
    </svg>
  );
}

function FlagNL() {
  return (
    <svg width="22" height="16" viewBox="0 0 9 6" aria-hidden="true" style={{ display: "block" }}>
      <rect width="9" height="2" fill="#AE1C28" />
      <rect y="2" width="9" height="2" fill="#fff" />
      <rect y="4" width="9" height="2" fill="#21468B" />
    </svg>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.8c.65 5.88 3.72 9.03 10.2 10.2-6.48 1.17-9.55 4.32-10.2 10.2C11.35 16.32 8.28 13.17 1.8 12 8.28 10.83 11.35 7.68 12 1.8Z" fill="currentColor" />
    </svg>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function HomeClient({ config }: { config: SiteConfig }) {
  const { services, hero, business } = config;

  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang];

  const whatsappDigits = business.whatsapp.replace(/\D/g, "");
  const callDigits = business.phone.replace(/[^\d+]/g, "");
  const whatsappHref = whatsappDigits
    ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(t.whatsappMessage)}`
    : "#quote";
  const callHref = callDigits ? `tel:${callDigits}` : "#quote";

  const [menuOpen, setMenuOpen] = useState(false);
  const [requestSummary, setRequestSummary] = useState("");
  const [requestEmailed, setRequestEmailed] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reviewSummary, setReviewSummary] = useState("");
  const [reviewCopied, setReviewCopied] = useState(false);
  const [reviewCopyError, setReviewCopyError] = useState(false);

  // Persist language choice
  useEffect(() => {
    const saved = localStorage.getItem("janor-lang") as Lang | null;
    if (saved && (saved === "en" || saved === "nl")) setLang(saved);
  }, []);

  function switchLang(l: Lang) {
    setLang(l);
    localStorage.setItem("janor-lang", l);
  }

  function prepareReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setReviewSummary(t.reviews.prepareReviewSummary(
      String(data.get("reviewName")),
      String(data.get("reviewService")),
      String(data.get("reviewText")),
    ));
    setReviewCopied(false);
    setReviewCopyError(false);
  }

  async function copyReview() {
    try {
      await navigator.clipboard.writeText(reviewSummary);
      setReviewCopied(true);
      setReviewCopyError(false);
    } catch {
      setReviewCopyError(true);
    }
  }

  useEffect(() => {
    function openAdmin(event: KeyboardEvent) {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        window.location.assign("/admin");
      }
    }
    window.addEventListener("keydown", openAdmin);
    return () => window.removeEventListener("keydown", openAdmin);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  async function sendRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setRequestError("");
    const data = new FormData(event.currentTarget);
    const payload = {
      service: String(data.get("service") || ""),
      propertyType: String(data.get("property") || ""),
      postcode: String(data.get("postcode") || ""),
      approximateSize: String(data.get("size") || ""),
      preferredDate: String(data.get("date") || ""),
      name: String(data.get("name") || ""),
      contact: String(data.get("contact") || ""),
      details: String(data.get("details") || ""),
      website: String(data.get("website") || ""),
    };
    const summary = [
      t.whatsappMessage,
      `Service: ${payload.service}`,
      `Property: ${payload.propertyType}`,
      `Postcode: ${payload.postcode}`,
      `Approx. size: ${payload.approximateSize} m²`,
      `Preferred date: ${payload.preferredDate || "Flexible"}`,
      `Name: ${payload.name}`,
      `Contact: ${payload.contact}`,
      `Details: ${payload.details || "No extra details"}`,
    ].join("\n");
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { ok?: boolean; emailed?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "Something went wrong.");
      setRequestSummary(summary);
      setRequestEmailed(Boolean(result.emailed));
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyRequest() {
    await navigator.clipboard.writeText(requestSummary);
    setCopied(true);
  }

  const navHrefs = ["#services", "#standard", "#about", "#quote"];
  const navLabels = [t.nav.services, t.nav.standard, t.nav.about, t.nav.contact];

  return (
    <main>
      {/* ── Header ── */}
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Janor Cleaning home">
          <span className="brand-mark">
            <span>JN</span>
            <span className="brand-stars" aria-hidden="true">★★★★★</span>
          </span>
          <span className="brand-copy">
            <strong>Janor</strong>
            <small>Cleaning Amsterdam</small>
          </span>
        </a>

        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          {navLabels.map((label, i) => (
            <a key={label} href={navHrefs[i]} onClick={closeMenu}>{label}</a>
          ))}
        </nav>

        {/* Language switcher */}
        <div className="lang-switcher" role="group" aria-label="Language">
          <button
            className={`lang-btn${lang === "en" ? " lang-btn--active" : ""}`}
            onClick={() => switchLang("en")}
            aria-pressed={lang === "en"}
            title="English"
          >
            <FlagGB />
            <span>EN</span>
          </button>
          <button
            className={`lang-btn${lang === "nl" ? " lang-btn--active" : ""}`}
            onClick={() => switchLang("nl")}
            aria-pressed={lang === "nl"}
            title="Nederlands"
          >
            <FlagNL />
            <span>NL</span>
          </button>
        </div>

        <a className="header-cta" href="#quote">{t.header.cta} <span>↗</span></a>
        <button
          className="menu-button"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </header>

      {/* ── Hero ── */}
      <section className="hero" id="top">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> {t.hero.eyebrow}</p>
          <h1>{hero.lineOne}<br /><em>{hero.lineTwo}</em></h1>
          <p className="hero-intro">{hero.intro}</p>
          <div className="hero-actions">
            <a className="button button-light" href="#quote">{t.hero.cta} <span>↗</span></a>
            <a className="button button-whatsapp" href={whatsappHref} {...(whatsappDigits ? { target: "_blank", rel: "noreferrer" } : {})}><FaWhatsapp aria-hidden="true" /> {t.hero.whatsapp}</a>
            <a className="button button-call" href={callHref}><FiPhoneCall aria-hidden="true" /> {t.hero.call}</a>
          </div>
          <a className="text-link hero-services-link" href="#services">{t.hero.servicesLink} <span>↓</span></a>
          <div className="hero-proof" aria-label="Our service principles">
            {t.hero.proof.map((item) => (
              <div key={item.title}>
                <span className="proof-icon">{item.icon}</span>
                <span><strong>{item.title}</strong><small>{item.sub}</small></span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-stage" aria-label="Janor quality standard illustration">
          <div className="stage-grid" />
          <div className="stage-glow" />
          <div className="quality-card">
            <div className="quality-topline">
              <span>{t.qualityCard.standard}</span>
              <span className="live-dot"><i /> {t.qualityCard.check}</span>
            </div>
            <div className="quality-score">
              <span className="score-ring"><Sparkle /></span>
              <div><small>{t.qualityCard.roomStatus}</small><strong>{t.qualityCard.ready}</strong></div>
            </div>
            <div className="check-list">
              {t.qualityCard.items.map((item, i) => (
                <div key={i}><span>0{i + 1}</span><p>{item}</p><i>✓</i></div>
              ))}
            </div>
            <div className="quality-footer">
              <span>{t.qualityCard.footer}</span>
              <span>{t.qualityCard.location}</span>
            </div>
          </div>
          <div className="floating-note note-one"><Sparkle /><span><strong>{t.floatingNotes[0].title}</strong><small>{t.floatingNotes[0].sub}</small></span></div>
          <div className="floating-note note-two"><span className="note-check">✓</span><span><strong>{t.floatingNotes[1].title}</strong><small>{t.floatingNotes[1].sub}</small></span></div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="services-section" id="services">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark"><span /> {t.services.eyebrow}</p>
            <h2>{t.services.heading.split("\n").map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</h2>
          </div>
          <p>{t.services.intro}</p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.number}>
              <div className="service-photo">
                <img src={service.image} alt={service.alt} loading="lazy" width="1200" height="900" />
                <span className="service-number">{service.number}</span>
              </div>
              <div className="service-body">
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <div className="service-tag">{service.tag}</div>
              </div>
            </article>
          ))}
          <a className="service-card service-card-cta" href="#quote">
            <span className="service-number">{t.services.notSure}</span>
            <div className="service-cta-arrow">↗</div>
            <h3>{t.services.tellUs.split("\n").map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}</h3>
            <p>{t.services.tellUsSub}</p>
            <div className="service-tag">{t.services.buildRequest}</div>
          </a>
        </div>
      </section>

      {/* ── Standard ── */}
      <section className="standard-section" id="standard">
        <div className="standard-intro">
          <p className="eyebrow"><span /> {t.standard.eyebrow}</p>
          <h2>{t.standard.heading.split("\n").map((l, i) => <span key={i}>{i > 0 && <br />}<em>{l}</em></span>)}</h2>
          <p>{t.standard.intro}</p>
          <a className="text-link" href="#quote">{t.standard.cta} <span>↗</span></a>
        </div>
        <div className="standards-list">
          {t.standard.items.map((item) => (
            <article key={item.number}>
              <span>{item.number}</span>
              <div><h3>{item.title}</h3><p>{item.text}</p></div>
              <i>✓</i>
            </article>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section className="about-section" id="about">
        <div className="about-monogram" aria-hidden="true">
          <div className="about-ring ring-one" />
          <div className="about-ring ring-two" />
          <strong>Janor</strong>
          <small>{business.serviceArea.toUpperCase()} · EST. {business.establishedYear}</small>
        </div>
        <div className="about-copy">
          <p className="eyebrow dark"><span /> {t.about.eyebrow}</p>
          <h2>One name.<br />One standard.</h2>
          <p className="about-lead">{t.about.lead}</p>
          <p>{t.about.body}</p>
          <div className="about-values">
            {t.about.values.map((v, i) => <span key={v}><i>0{i + 1}</i> {v}</span>)}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="pricing-section">
        <div>
          <p className="eyebrow dark"><span /> {t.pricing.eyebrow}</p>
          <h2>{t.pricing.heading.split("\n").map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}</h2>
        </div>
        <div className="pricing-copy">
          <p>{t.pricing.intro}</p>
          <ul>
            {t.pricing.items.map((item, i) => (
              <li key={i}><span>0{i + 1}</span> {item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Quote ── */}
      <section className="quote-section" id="quote">
        <div className="quote-copy">
          <p className="eyebrow"><span /> {t.quote.eyebrow}</p>
          <h2>{t.quote.heading.split("\n").map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}</h2>
          <p>{t.quote.intro}</p>
          <div className="quote-side-note">
            <Sparkle />
            <div><strong>{t.quote.note.title}</strong><small>{t.quote.note.sub}</small></div>
          </div>
        </div>
        <div className="quote-panel">
          {!requestSummary ? (
            <form onSubmit={sendRequest}>
              <div className="form-grid">
                <label className="honeypot" aria-hidden="true">{t.quote.form.website}<input name="website" tabIndex={-1} autoComplete="off" /></label>
                <label>{t.quote.form.service}
                  <select name="service" required defaultValue="">
                    <option value="" disabled>{t.quote.form.serviceDefault}</option>
                    {services.map((s) => <option key={s.number}>{s.title}</option>)}
                  </select>
                </label>
                <label>{t.quote.form.property}
                  <select name="property" required defaultValue="">
                    <option value="" disabled>{t.quote.form.propertyDefault}</option>
                    {t.quote.form.propertyOptions.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </label>
                <label>{t.quote.form.postcode}
                  <input name="postcode" placeholder={t.quote.form.postcodePlaceholder} required />
                </label>
                <label>{t.quote.form.size}
                  <div className="input-suffix"><input name="size" type="number" min="10" max="2000" placeholder="75" required /><span>m²</span></div>
                </label>
                <label>{t.quote.form.date}
                  <input name="date" type="date" />
                </label>
                <label>{t.quote.form.name}
                  <input name="name" autoComplete="name" placeholder={t.quote.form.namePlaceholder} required />
                </label>
                <label className="wide-field">{t.quote.form.contact}
                  <input name="contact" autoComplete="email" placeholder={t.quote.form.contactPlaceholder} required />
                </label>
                <label className="wide-field">{t.quote.form.details}
                  <textarea name="details" rows={4} placeholder={t.quote.form.detailsPlaceholder} />
                </label>
              </div>
              {requestError && <p className="form-error" role="alert">{requestError}</p>}
              <button className="form-submit" type="submit" disabled={submitting}>
                {submitting ? t.quote.form.submitting : t.quote.form.submit} <span>↗</span>
              </button>
              <p className="form-note">{t.quote.form.privacy}</p>
            </form>
          ) : (
            <div className="request-ready" aria-live="polite">
              <span className="ready-icon">✓</span>
              <p className="eyebrow dark"><span /> {requestEmailed ? t.quote.ready.sent : t.quote.ready.saved}</p>
              <h3>{requestEmailed ? t.quote.ready.titleSent : t.quote.ready.titleReady}</h3>
              <p>{requestEmailed ? t.quote.ready.bodySent : t.quote.ready.bodyNotConnected}</p>
              <pre>{requestSummary}</pre>
              <div className="ready-actions">
                {business.whatsapp ? (
                  <a className="ready-action" href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(requestSummary)}`} target="_blank" rel="noreferrer"><FaWhatsapp aria-hidden="true" /> {t.quote.ready.sendWhatsApp}</a>
                ) : business.email ? (
                  <a className="ready-action" href={`mailto:${business.email}?subject=${encodeURIComponent("Cleaning quotation request")}&body=${encodeURIComponent(requestSummary)}`}>{t.quote.ready.sendEmail} ↗</a>
                ) : (
                  <button type="button" onClick={copyRequest}>{copied ? t.quote.ready.copied : t.quote.ready.copy}</button>
                )}
                <button className="secondary" type="button" onClick={() => setRequestSummary("")}>{t.quote.ready.edit}</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq-section">
        <div className="faq-heading">
          <p className="eyebrow dark"><span /> {t.faq.eyebrow}</p>
          <h2>{t.faq.heading.split("\n").map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}</h2>
        </div>
        <div className="faq-list">
          {t.faq.items.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary><span>0{index + 1}</span>{question}<i>+</i></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="reviews-section" id="reviews" aria-labelledby="reviews-title">
        <div className="reviews-heading">
          <div>
            <p className="eyebrow dark"><FiMessageSquare aria-hidden="true" /> {t.reviews.eyebrow}</p>
            <h2 id="reviews-title">{t.reviews.heading}</h2>
          </div>
          <a className="review-write-button" href="#write-review" onClick={() => { const el = document.getElementById("write-review"); if (el instanceof HTMLDetailsElement) el.open = true; }}><FiEdit3 aria-hidden="true" /> {t.reviews.writeBtn}</a>
        </div>
        <p className="reviews-note">{t.reviews.note}</p>
        <div className="reviews-grid">
          {reviewsData[lang].map((review) => (
            <article className="review-card" key={review.service}>
              <span className="review-example">{t.reviews.exampleLabel}</span>
              <FiMessageSquare className="review-card-icon" aria-hidden="true" />
              <blockquote>{review.text}</blockquote>
              <p>{review.service}</p>
            </article>
          ))}
        </div>
        <details className="review-editor" id="write-review">
          <summary><FiEdit3 aria-hidden="true" /> {t.reviews.writeTitle}</summary>
          <p>{t.reviews.writeIntro}</p>
          <form onSubmit={prepareReview} className="review-form">
            <label>{t.reviews.nameLabel}<input name="reviewName" autoComplete="name" maxLength={100} required /></label>
            <label>{t.reviews.serviceLabel}<select name="reviewService">{services.map((s) => <option key={s.number}>{s.title}</option>)}</select></label>
            <label className="review-text-field">{t.reviews.reviewLabel}<textarea name="reviewText" rows={4} maxLength={1200} required /></label>
            <button type="submit" className="review-write-button">{t.reviews.prepareBtn}</button>
          </form>
          {reviewSummary && (
            <div className="review-prepared" role="status">
              <p>{t.reviews.preparedIntro}</p>
              <pre>{reviewSummary}</pre>
              <div className="review-send-actions">
                {whatsappDigits && <a className="review-write-button" href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(reviewSummary)}`} target="_blank" rel="noreferrer"><FaWhatsapp aria-hidden="true" /> {t.reviews.sendWhatsApp}</a>}
                {business.email && <a className="review-write-button" href={`mailto:${business.email}?subject=${encodeURIComponent("Beoordeling Janor Cleaning")}&body=${encodeURIComponent(reviewSummary)}`}>{t.reviews.sendEmail}</a>}
                <button type="button" className="review-write-button" onClick={copyReview}>{reviewCopied ? t.reviews.copiedBtn : t.reviews.copyBtn}</button>
              </div>
              {!whatsappDigits && !business.email && <p>{t.reviews.noContact}</p>}
              {reviewCopyError && <p role="alert">{t.reviews.copyError}</p>}
            </div>
          )}
        </details>
      </section>

      {/* ── Contact dock ── */}
      {(whatsappDigits || callDigits) && (
        <aside className="contact-dock" aria-label="Quick contact">
          {whatsappDigits && (
            <a className="contact-dock-link whatsapp" href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(t.whatsappMessage)}`} target="_blank" rel="noreferrer" aria-label="Message Janor Cleaning on WhatsApp">
              <FaWhatsapp aria-hidden="true" /><strong>WhatsApp</strong><small>{t.whatsappDock}</small>
            </a>
          )}
          {callDigits && (
            <a className="contact-dock-link call" href={`tel:${callDigits}`} aria-label="Call Janor Cleaning">
              <FiPhoneCall aria-hidden="true" /><strong>{t.callDock}</strong><small>{business.phone}</small>
            </a>
          )}
        </aside>
      )}

      {/* ── Footer ── */}
      <footer>
        <div className="footer-top">
          <div>
            <a className="brand footer-brand" href="#top" aria-label="Janor Cleaning home">
              <span className="brand-mark"><span>JN</span><span className="brand-stars" aria-hidden="true">★★★★★</span></span>
              <span className="brand-copy"><strong>Janor</strong><small>Cleaning Amsterdam</small></span>
            </a>
            <p>{t.footer.tagline}</p>
          </div>
          <div className="footer-links">
            <strong>{t.footer.explore}</strong>
            {navHrefs.map((href, i) => <a key={href} href={href}>{t.footer.navLinks[i]}</a>)}
          </div>
          <div className="footer-links"><strong>{t.footer.serviceArea}</strong><span>{business.serviceArea}</span><span>{t.footer.serviceAreaSub}</span></div>
          <div className="footer-links"><strong>{t.footer.company}</strong><span>KVK: {business.kvk}</span>{business.email && <a href={`mailto:${business.email}`}>{business.email}</a>}{business.phone && <a href={`tel:${business.phone}`}>{business.phone}</a>}{!business.email && !business.phone && <span>{t.footer.noContact}</span>}</div>
        </div>
        <div className="footer-bottom">
          <span>© {business.establishedYear}–2026 Janor Cleaning</span>
          <span>{t.footer.starsNote}</span>
          <span className="footer-actions"><a href="#top">{t.footer.backToTop}</a></span>
        </div>
      </footer>
    </main>
  );
}
