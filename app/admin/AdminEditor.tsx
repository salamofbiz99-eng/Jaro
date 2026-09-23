"use client";

import { useState } from "react";
import Link from "next/link";
import type { SiteConfig } from "@/lib/site-config";
import styles from "./admin.module.css";

type SaveState = "idle" | "saving" | "saved" | "error";
type UploadState = Record<number, "idle" | "uploading" | "done" | "error">;

export default function AdminEditor({ initialConfig, adminEmail }: { initialConfig: SiteConfig; adminEmail: string }) {
  const [config, setConfig] = useState(initialConfig);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [uploadState, setUploadState] = useState<UploadState>({});
  const [message, setMessage] = useState("");

  function updateHero(field: keyof SiteConfig["hero"], value: string) {
    setConfig((current) => ({ ...current, hero: { ...current.hero, [field]: value } }));
    setSaveState("idle");
  }

  function updateBusiness(field: keyof SiteConfig["business"], value: string) {
    setConfig((current) => ({ ...current, business: { ...current.business, [field]: value } }));
    setSaveState("idle");
  }

  function updateService(index: number, field: "title" | "text" | "tag" | "image" | "alt", value: string) {
    setConfig((current) => ({
      ...current,
      services: current.services.map((service, serviceIndex) =>
        serviceIndex === index ? { ...service, [field]: value } : service,
      ),
    }));
    setSaveState("idle");
  }

  async function uploadServiceImage(index: number, file: File) {
    setUploadState((current) => ({ ...current, [index]: "uploading" }));
    setMessage("");
    try {
      const form = new FormData();
      form.append("image", file);
      form.append("serviceNumber", config.services[index].number);
      const response = await fetch("/api/admin/service-image", { method: "POST", body: form });
      const result = await response.json() as { ok?: boolean; url?: string; error?: string };
      if (!response.ok || !result.ok || !result.url) throw new Error(result.error || "The photo could not be uploaded.");
      updateService(index, "image", result.url);
      updateService(index, "alt", `${config.services[index].title} — JARO Cleaning`);
      setUploadState((current) => ({ ...current, [index]: "done" }));
      setMessage("Photo uploaded. Click Save & publish to use it on the public website.");
    } catch (error) {
      setUploadState((current) => ({ ...current, [index]: "error" }));
      setMessage(error instanceof Error ? error.message : "The photo could not be uploaded.");
    }
  }

  async function saveChanges() {
    setSaveState("saving");
    setMessage("");
    try {
      const response = await fetch("/api/admin/site-config", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(config),
      });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "The changes could not be saved.");
      setSaveState("saved");
      setMessage("Published. The public website now uses these details.");
    } catch (error) {
      setSaveState("error");
      setMessage(error instanceof Error ? error.message : "The changes could not be saved.");
    }
  }

  return (
    <main className={styles.adminShell}>
      <aside className={styles.sidebar}>
        <Link className={styles.adminBrand} href="/" aria-label="Open JARO website">
          <span>JR</span>
          <div><strong>JARO</strong><small>ADMIN PANEL</small></div>
        </Link>
        <nav aria-label="Admin sections">
          <a href="#overview">Overview</a>
          <a href="#homepage">Homepage</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className={styles.sidebarBottom}>
          <small>Signed in as</small>
          <strong>{adminEmail}</strong>
          <a href="/admin/logout">Sign out</a>
        </div>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <div><p>JARO CONTROL ROOM</p><h1>Website content</h1></div>
          <div className={styles.topActions}>
            <Link href="/" target="_blank" rel="noreferrer">View live site ↗</Link>
            <button type="button" onClick={saveChanges} disabled={saveState === "saving"}>
              {saveState === "saving" ? "Publishing…" : saveState === "saved" ? "Published ✓" : "Save & publish"}
            </button>
          </div>
        </header>

        {message && <div className={saveState === "error" ? styles.errorNotice : styles.successNotice}>{message}</div>}

        <section className={styles.overview} id="overview">
          <article><span>01</span><div><small>Website</small><strong>Live</strong></div><i className={styles.statusDot} /></article>
          <article><span>02</span><div><small>Services</small><strong>{config.services.length} active</strong></div></article>
          <article><span>03</span><div><small>Contact buttons</small><strong>{config.business.whatsapp || config.business.phone ? "Connected" : "Not connected"}</strong></div></article>
        </section>

        <section className={styles.panel} id="homepage">
          <div className={styles.panelHeading}>
            <div><p>01 · HOMEPAGE</p><h2>First impression</h2></div>
            <span>Changes appear on the public homepage after publishing.</span>
          </div>
          <div className={styles.formGrid}>
            <label>Headline — first line<input value={config.hero.lineOne} maxLength={80} onChange={(event) => updateHero("lineOne", event.target.value)} /></label>
            <label>Headline — green line<input value={config.hero.lineTwo} maxLength={90} onChange={(event) => updateHero("lineTwo", event.target.value)} /></label>
            <label className={styles.wide}>Introduction<textarea rows={4} value={config.hero.intro} maxLength={360} onChange={(event) => updateHero("intro", event.target.value)} /></label>
          </div>
        </section>

        <section className={styles.panel} id="services">
          <div className={styles.panelHeading}>
            <div><p>02 · SERVICES</p><h2>What JARO offers</h2></div>
            <span>Upload a JPG, PNG or WebP photo. Maximum file size: 8 MB.</span>
          </div>
          <div className={styles.serviceEditorGrid}>
            {config.services.map((service, index) => (
              <article className={styles.serviceEditor} key={service.number}>
                <div className={styles.serviceEditorTop}><span>{service.number}</span><strong>{service.title}</strong></div>
                <div className={styles.photoEditor}>
                  <img src={service.image} alt={service.alt} />
                  <label className={styles.photoUpload}>
                    <span>{uploadState[index] === "uploading" ? "Uploading…" : uploadState[index] === "done" ? "Photo ready ✓" : "Change photo"}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={uploadState[index] === "uploading"}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void uploadServiceImage(index, file);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>
                <label>Service name<input value={service.title} maxLength={80} onChange={(event) => updateService(index, "title", event.target.value)} /></label>
                <label>Description<textarea rows={4} value={service.text} maxLength={280} onChange={(event) => updateService(index, "text", event.target.value)} /></label>
                <label>Short label<input value={service.tag} maxLength={100} onChange={(event) => updateService(index, "tag", event.target.value)} /></label>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.panel} id="contact">
          <div className={styles.panelHeading}>
            <div><p>03 · CONTACT & COMPANY</p><h2>How clients reach you</h2></div>
            <span>Use the international WhatsApp format, for example +31612345678.</span>
          </div>
          <div className={styles.formGrid}>
            <label>Request notification email<input type="email" value={config.business.email} placeholder="hello@jarocleaning.nl" onChange={(event) => updateBusiness("email", event.target.value)} /><small>New cleaning requests are delivered to this address after the mail service is connected.</small></label>
            <label>WhatsApp message button<input value={config.business.whatsapp} placeholder="+31 6 12 34 56 78" onChange={(event) => updateBusiness("whatsapp", event.target.value)} /><small>Opens a direct WhatsApp conversation.</small></label>
            <label>Direct call button<input value={config.business.phone} placeholder="+31 6 12 34 56 78" onChange={(event) => updateBusiness("phone", event.target.value)} /><small>Starts a phone call on mobile.</small></label>
            <label>Service area<input value={config.business.serviceArea} maxLength={120} onChange={(event) => updateBusiness("serviceArea", event.target.value)} /></label>
            <label>KVK number<input value={config.business.kvk} maxLength={30} onChange={(event) => updateBusiness("kvk", event.target.value)} /></label>
            <label>Established year<input inputMode="numeric" value={config.business.establishedYear} maxLength={4} onChange={(event) => updateBusiness("establishedYear", event.target.value)} /></label>
          </div>
        </section>

        <footer className={styles.adminFooter}>JARO Cleaning · Amsterdam · Owner control panel</footer>
      </section>
    </main>
  );
}
