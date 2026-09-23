import { headers } from "next/headers";
import { getSiteConfig } from "@/db/site-config";
import { isAdminEmail } from "@/lib/admin-auth";
import { getLocalAdminFromCookies, isLocalAdminConfigured } from "@/lib/local-auth";
import AdminEditor from "./AdminEditor";
import styles from "./admin.module.css";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Priority 1: local cookie session (from /admin/login form)
  const localAdmin = await getLocalAdminFromCookies();
  if (localAdmin) {
    const config = await getSiteConfig();
    return <AdminEditor initialConfig={config} adminEmail={localAdmin} />;
  }

  // Priority 2: HTTP Basic Auth via standalone-auth.ts (browser popup — Win+A style)
  // standalone-auth sets oai-authenticated-user-email header after verifying
  const requestHeaders = await headers();
  const basicAuthEmail = requestHeaders.get("oai-authenticated-user-email");
  if (basicAuthEmail && isAdminEmail(basicAuthEmail)) {
    const config = await getSiteConfig();
    return <AdminEditor initialConfig={config} adminEmail={basicAuthEmail} />;
  }

  // Not authenticated — show access info
  const localConfigured = isLocalAdminConfigured();
  const basicConfigured = Boolean(
    typeof process !== "undefined" && process.env.ADMIN_EMAILS && process.env.ADMIN_PASSWORD
  );
  const anyConfigured = localConfigured || basicConfigured;

  return (
    <main className={styles.lockedPage}>
      <section className={styles.lockedCard}>
        <span className={styles.lockIcon}>J</span>
        <p className={styles.kicker}>JARO CONTROL ROOM</p>
        <h1>{anyConfigured ? "Sign in required." : "Admin access not configured."}</h1>
        <p>
          {basicConfigured
            ? "Your browser will prompt for a username and password. Use the ADMIN_EMAILS address as username and ADMIN_PASSWORD as password."
            : localConfigured
              ? "Use the login form to sign in."
              : "Set ADMIN_EMAILS and ADMIN_PASSWORD environment variables in Render to enable admin access."}
        </p>
        {localConfigured && (
          <Link className={styles.darkButton} href="/admin/login">
            Open sign-in form
          </Link>
        )}
        <Link className={styles.textLink} href="/">Return to JARO Cleaning</Link>
      </section>
    </main>
  );
}
