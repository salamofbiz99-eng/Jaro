"use client";

import { FormEvent, useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiPhoneCall, FiEdit3, FiMessageSquare } from "react-icons/fi";
import type { SiteConfig } from "@/lib/site-config";

const standards = [
  { number: "01", title: "Clear scope", text: "We agree what is included, what needs extra attention and how the space should look when finished." },
  { number: "02", title: "Room-by-room checklist", text: "A structured route keeps the work thorough and prevents small but important details from being missed." },
  { number: "03", title: "Final inspection", text: "The job is reviewed against the agreed scope before the space is considered ready." },
  { number: "04", title: "Direct communication", text: "You know who is responsible, what is happening and where to reach us when plans change." },
];

const faqs = [
  ["Do you bring cleaning products and equipment?", "We agree this before the appointment. Your quotation will clearly state which products and equipment are included or need to be available at the property."],
  ["How is the price calculated?", "The quotation depends on the service, floor area, number of rooms, current condition and any extras such as an oven, fridge or interior windows."],
  ["Do I need to be home during the cleaning?", "Not necessarily. We can agree on safe access and key handling in advance. For a first appointment, a short introduction is helpful."],
  ["Which areas do you serve?", "The first service area is Amsterdam. Requests just outside Amsterdam can be discussed depending on the location and size of the job."],
  ["Can I book recurring cleaning?", "Yes. Weekly, biweekly and monthly schedules can be arranged after the first clean and a clear assessment of the space."],
  ["Do you clean apartments and spaces after renovation?", "Yes. Post-renovation cleaning can include removal of fine construction dust and residue from surfaces, floors, kitchens, bathrooms and other agreed areas. The exact scope is confirmed before the quotation."],
];

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.8c.65 5.88 3.72 9.03 10.2 10.2-6.48 1.17-9.55 4.32-10.2 10.2C11.35 16.32 8.28 13.17 1.8 12 8.28 10.83 11.35 7.68 12 1.8Z" fill="currentColor" />
    </svg>
  );
}

export default function HomeClient({ config }: { config: SiteConfig }) {
  const { services, hero, business } = config;
  const whatsappDigits = business.whatsapp.replace(/\D/g, "");
  const callDigits = business.phone.replace(/[^\d+]/g, "");
  const whatsappHref = whatsappDigits
    ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent("Hello JARO Cleaning, I would like a quotation.")}`
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

  function prepareReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setReviewSummary(`Mijn beoordeling van JARO Cleaning\nNaam: ${data.get("reviewName")}\nDienst: ${data.get("reviewService")}\n\n${data.get("reviewText")}`);
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
      "Hello JARO Cleaning, I would like a quotation.",
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
      if (!response.ok || !result.ok) throw new Error(result.error || "Your request could not be sent.");
      setRequestSummary(summary);
      setRequestEmailed(Boolean(result.emailed));
      setCopied(false);
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "Your request could not be sent.");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyRequest() {
    await navigator.clipboard.writeText(requestSummary);
    setCopied(true);
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="JARO Cleaning home">
          <span className="brand-mark">
            <span>JR</span>
            <span className="brand-stars" aria-hidden="true">★★★★★</span>
          </span>
          <span className="brand-copy">
            <strong>JARO</strong>
            <small>Cleaning Amsterdam</small>
          </span>
        </a>

        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#standard" onClick={closeMenu}>Our standard</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#quote" onClick={closeMenu}>Contact</a>
        </nav>

        <a className="header-cta" href="#quote">Get a free quote <span>↗</span></a>
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

      <section className="hero" id="top">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> Amsterdam cleaning company</p>
          <h1>{hero.lineOne}<br /><em>{hero.lineTwo}</em></h1>
          <p className="hero-intro">
            {hero.intro}
          </p>
          <div className="hero-actions">
            <a className="button button-light" href="#quote">Request a free quote <span>↗</span></a>
            <a
              className="button button-whatsapp"
              href={whatsappHref}
              {...(whatsappDigits ? { target: "_blank", rel: "noreferrer" } : {})}
            ><FaWhatsapp aria-hidden="true" /> WhatsApp</a>
            <a className="button button-call" href={callHref}><FiPhoneCall aria-hidden="true" /> Call now</a>
          </div>
          <a className="text-link hero-services-link" href="#services">Explore our services <span>↓</span></a>
          <div className="hero-proof" aria-label="Our service principles">
            <div><Sparkle /><span><strong>Hotel-trained eye</strong><small>Details never skipped</small></span></div>
            <div><span className="proof-icon">✓</span><span><strong>Clear scope & quote</strong><small>No vague promises</small></span></div>
            <div><span className="proof-icon">◎</span><span><strong>Quality checked</strong><small>Consistent every time</small></span></div>
          </div>
        </div>

        <div className="hero-stage" aria-label="JARO quality standard illustration">
          <div className="stage-grid" />
          <div className="stage-glow" />
          <div className="quality-card">
            <div className="quality-topline">
              <span>JARO STANDARD</span>
              <span className="live-dot"><i /> QUALITY CHECK</span>
            </div>
            <div className="quality-score">
              <span className="score-ring"><Sparkle /></span>
              <div><small>ROOM STATUS</small><strong>Ready.</strong></div>
            </div>
            <div className="check-list">
              <div><span>01</span><p>Surfaces & details</p><i>✓</i></div>
              <div><span>02</span><p>Kitchen & bathroom</p><i>✓</i></div>
              <div><span>03</span><p>Floors & final finish</p><i>✓</i></div>
            </div>
            <div className="quality-footer">
              <span>Checked with care</span>
              <span>JARO · AMSTERDAM</span>
            </div>
          </div>
          <div className="floating-note note-one"><Sparkle /><span><strong>Detail first</strong><small>Hotel-level finish</small></span></div>
          <div className="floating-note note-two"><span className="note-check">✓</span><span><strong>Personally checked</strong><small>Accountability built in</small></span></div>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark"><span /> Services</p>
            <h2>Exactly the clean<br />your space needs.</h2>
          </div>
          <p>Start with the right service. We agree on the scope before work begins, so expectations stay clear from the first message to the final check.</p>
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
            <span className="service-number">NOT SURE?</span>
            <div className="service-cta-arrow">↗</div>
            <h3>Tell us about<br />your space.</h3>
            <p>We will help you choose the right service and prepare a clear quotation.</p>
            <div className="service-tag">Build your request</div>
          </a>
        </div>
      </section>

      <section className="standard-section" id="standard">
        <div className="standard-intro">
          <p className="eyebrow"><span /> The JARO standard</p>
          <h2>Not just cleaned.<br /><em>Checked.</em></h2>
          <p>Hotel housekeeping taught us something simple: a room is not ready because the work is finished. It is ready when the result has been checked.</p>
          <a className="text-link" href="#quote">Plan your cleaning <span>↗</span></a>
        </div>
        <div className="standards-list">
          {standards.map((item) => (
            <article key={item.number}>
              <span>{item.number}</span>
              <div><h3>{item.title}</h3><p>{item.text}</p></div>
              <i>✓</i>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-monogram" aria-hidden="true">
          <div className="about-ring ring-one" />
          <div className="about-ring ring-two" />
          <strong>JARO</strong>
          <small>{business.serviceArea.toUpperCase()} · EST. {business.establishedYear}</small>
        </div>
        <div className="about-copy">
          <p className="eyebrow dark"><span /> The standard behind JARO</p>
          <h2>One name.<br />One standard.</h2>
          <p className="about-lead">JARO is built around a simple promise: reliable work, clear communication and attention to the details that change how a space feels.</p>
          <p>Our operating standard is shaped by hands-on experience in hotel housekeeping and quality supervision. That experience becomes a practical system for private homes, offices, hospitality spaces and post-renovation cleaning: clear expectations, structured work and a final check.</p>
          <div className="about-values">
            <span><i>01</i> Care</span>
            <span><i>02</i> Reliability</span>
            <span><i>03</i> Detail</span>
          </div>
        </div>
      </section>

      <section className="pricing-section">
        <div>
          <p className="eyebrow dark"><span /> Honest pricing</p>
          <h2>Clear before<br />we begin.</h2>
        </div>
        <div className="pricing-copy">
          <p>We do not advertise a cheap fixed price and surprise you later. Your quotation is based on the actual work required.</p>
          <ul>
            <li><span>01</span> Service and frequency</li>
            <li><span>02</span> Floor area and rooms</li>
            <li><span>03</span> Current condition</li>
            <li><span>04</span> Requested extras</li>
          </ul>
        </div>
      </section>

      <section className="quote-section" id="quote">
        <div className="quote-copy">
          <p className="eyebrow"><span /> Free quotation</p>
          <h2>Tell us what<br />needs cleaning.</h2>
          <p>Complete the details below. The clearer the request, the faster we can prepare an accurate quotation.</p>
          <div className="quote-side-note">
            <Sparkle />
            <div><strong>No instant fake price</strong><small>A real quotation based on your space and requested work.</small></div>
          </div>
        </div>

        <div className="quote-panel">
          {!requestSummary ? (
            <form onSubmit={sendRequest}>
              <div className="form-grid">
                <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
                <label>Service needed
                  <select name="service" required defaultValue="">
                    <option value="" disabled>Select a service</option>
                    {services.map((service) => <option key={service.number}>{service.title}</option>)}
                  </select>
                </label>
                <label>Property type
                  <select name="property" required defaultValue="">
                    <option value="" disabled>Select property type</option>
                    <option>Apartment</option><option>House</option><option>Office</option><option>Hospitality space</option><option>Other</option>
                  </select>
                </label>
                <label>Amsterdam postcode
                  <input name="postcode" placeholder="e.g. 1012 AB" required />
                </label>
                <label>Approximate size
                  <div className="input-suffix"><input name="size" type="number" min="10" max="2000" placeholder="75" required /><span>m²</span></div>
                </label>
                <label>Preferred date
                  <input name="date" type="date" />
                </label>
                <label>Your name
                  <input name="name" autoComplete="name" placeholder="Name" required />
                </label>
                <label className="wide-field">Email or phone
                  <input name="contact" autoComplete="email" placeholder="How should we contact you?" required />
                </label>
                <label className="wide-field">Extra details
                  <textarea name="details" rows={4} placeholder="Number of rooms, condition, extras or access details…" />
                </label>
              </div>
              {requestError && <p className="form-error" role="alert">{requestError}</p>}
              <button className="form-submit" type="submit" disabled={submitting}>{submitting ? "Sending request…" : "Send request to JARO"} <span>↗</span></button>
              <p className="form-note">Your details are sent securely to JARO Cleaning and used only to respond to this request.</p>
            </form>
          ) : (
            <div className="request-ready" aria-live="polite">
              <span className="ready-icon">✓</span>
              <p className="eyebrow dark"><span /> {requestEmailed ? "Request sent" : "Request saved"}</p>
              <h3>{requestEmailed ? "JARO received your request." : "Your request is ready."}</h3>
              <p>{requestEmailed ? "We sent the details to JARO by email. You can also continue directly in WhatsApp." : "Email delivery is not connected yet. Please continue by WhatsApp or call JARO."}</p>
              <pre>{requestSummary}</pre>
              <div className="ready-actions">
                {business.whatsapp ? (
                  <a
                    className="ready-action"
                    href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(requestSummary)}`}
                    target="_blank"
                    rel="noreferrer"
                  ><FaWhatsapp aria-hidden="true" /> Send by WhatsApp</a>
                ) : business.email ? (
                  <a className="ready-action" href={`mailto:${business.email}?subject=${encodeURIComponent("Cleaning quotation request")}&body=${encodeURIComponent(requestSummary)}`}>Send by email ↗</a>
                ) : (
                  <button type="button" onClick={copyRequest}>{copied ? "Copied ✓" : "Copy request"}</button>
                )}
                <button className="secondary" type="button" onClick={() => setRequestSummary("")}>Edit details</button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-heading">
          <p className="eyebrow dark"><span /> Good to know</p>
          <h2>Frequently asked<br />questions.</h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary><span>0{index + 1}</span>{question}<i>+</i></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="reviews-section" id="reviews" lang="nl" aria-labelledby="reviews-title">
        <div className="reviews-heading">
          <div>
            <p className="eyebrow dark"><FiMessageSquare aria-hidden="true" /> Uw ervaring telt</p>
            <h2 id="reviews-title">Klantbeoordelingen</h2>
          </div>
          <a className="review-write-button" href="#write-review" onClick={() => { const editor = document.getElementById("write-review"); if (editor instanceof HTMLDetailsElement) editor.open = true; }}><FiEdit3 aria-hidden="true" /> Schrijf een beoordeling</a>
        </div>
        <p className="reviews-note">We verzamelen onze eerste beoordelingen. De onderstaande teksten zijn voorbeelden, geen echte klantbeoordelingen.</p>
        <div className="reviews-grid">
          {[
            { service: "Regular cleaning", text: "Prettige communicatie en een frisse, schone woning. Vooral de aandacht voor de keuken en badkamer maakte het verschil." },
            { service: "Move in / out", text: "De schoonmaak voor de verhuizing was duidelijk afgesproken. Het appartement voelde schoon en klaar voor een nieuwe start." },
            { service: "Office cleaning", text: "Een verzorgde werkplek en duidelijke afspraken over de schoonmaak. Fijn dat de werkzaamheden buiten onze kantooruren konden plaatsvinden." },
          ].map((review) => (
            <article className="review-card" key={review.service}>
              <span className="review-example">Voorbeeld · geen echte beoordeling</span>
              <FiMessageSquare className="review-card-icon" aria-hidden="true" />
              <blockquote>{review.text}</blockquote>
              <p>{review.service}</p>
            </article>
          ))}
        </div>
        <details className="review-editor" id="write-review">
          <summary><FiEdit3 aria-hidden="true" /> Schrijf over uw ervaring</summary>
          <p>Heeft u JARO Cleaning ingeschakeld? Deel uw eerlijke ervaring. Uw tekst wordt niet automatisch op de website gepubliceerd.</p>
          <form onSubmit={prepareReview} className="review-form">
            <label>Uw naam<input name="reviewName" autoComplete="name" maxLength={100} required /></label>
            <label>Dienst<select name="reviewService">{services.map((service) => <option key={service.number}>{service.title}</option>)}</select></label>
            <label className="review-text-field">Uw beoordeling<textarea name="reviewText" rows={4} maxLength={1200} required /></label>
            <button type="submit" className="review-write-button">Beoordeling voorbereiden</button>
          </form>
          {reviewSummary && <div className="review-prepared" role="status">
            <p>Uw beoordeling is voorbereid. Verstuur deze via WhatsApp of e-mail wanneer beschikbaar, of kopieer de tekst.</p>
            <pre>{reviewSummary}</pre>
            <div className="review-send-actions">
              {whatsappDigits && <a className="review-write-button" href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(reviewSummary)}`} target="_blank" rel="noreferrer"><FaWhatsapp aria-hidden="true" /> Verstuur via WhatsApp</a>}
              {business.email && <a className="review-write-button" href={`mailto:${business.email}?subject=${encodeURIComponent("Beoordeling JARO Cleaning")}&body=${encodeURIComponent(reviewSummary)}`}>Verstuur via e-mail</a>}
              <button type="button" className="review-write-button" onClick={copyReview}>{reviewCopied ? "Tekst gekopieerd" : "Kopieer tekst"}</button>
            </div>
            {!whatsappDigits && !business.email && <p>Contactgegevens worden binnenkort toegevoegd. U kunt de tekst nu kopiëren; deze is nog niet verstuurd.</p>}
            {reviewCopyError && <p role="alert">Kopiëren lukt niet. Selecteer en kopieer de tekst hierboven.</p>}
          </div>}
        </details>
      </section>

      {(whatsappDigits || callDigits) && (
        <aside className="contact-dock" aria-label="Quick contact">
          {whatsappDigits && (
            <a
              className="contact-dock-link whatsapp"
              href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent("Hello JARO Cleaning, I would like a quotation.")}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Message JARO Cleaning on WhatsApp"
            >
              <FaWhatsapp aria-hidden="true" /><strong>WhatsApp</strong><small>Message us</small>
            </a>
          )}
          {callDigits && (
            <a className="contact-dock-link call" href={`tel:${callDigits}`} aria-label="Call JARO Cleaning">
              <FiPhoneCall aria-hidden="true" /><strong>Call now</strong><small>{business.phone}</small>
            </a>
          )}
        </aside>
      )}

      <footer>
        <div className="footer-top">
          <div>
            <a className="brand footer-brand" href="#top" aria-label="JARO Cleaning home">
              <span className="brand-mark"><span>JR</span><span className="brand-stars" aria-hidden="true">★★★★★</span></span>
              <span className="brand-copy"><strong>JARO</strong><small>Cleaning Amsterdam</small></span>
            </a>
            <p>Hotel-standard attention to detail for Amsterdam homes, offices and hospitality spaces.</p>
          </div>
          <div className="footer-links"><strong>Explore</strong><a href="#services">Services</a><a href="#standard">Our standard</a><a href="#about">About</a><a href="#quote">Get a quote</a></div>
          <div className="footer-links"><strong>Service area</strong><span>{business.serviceArea}</span><span>Surrounding areas on request</span></div>
          <div className="footer-links"><strong>Company details</strong><span>KVK: {business.kvk}</span>{business.email && <a href={`mailto:${business.email}`}>{business.email}</a>}{business.phone && <a href={`tel:${business.phone}`}>{business.phone}</a>}{!business.email && !business.phone && <span>Contact details to be connected</span>}</div>
        </div>
        <div className="footer-bottom"><span>© {business.establishedYear}–2026 JARO Cleaning</span><span>Five stars are a decorative brand element—not a customer rating.</span><span className="footer-actions"><a href="#top">Back to top ↑</a></span></div>
      </footer>
    </main>
  );
}
