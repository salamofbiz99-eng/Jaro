import { getSiteConfig } from "@/db/site-config";
import { getLocalAdminFromCookies, isLocalAdminConfigured } from "@/lib/local-auth";
import AdminEditor from "./AdminEditor";
import styles from "./admin.module.css";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const localAdmin = await getLocalAdminFromCookies();
  if (localAdmin) {
    const config = await getSiteConfig();
    return <AdminEditor initialConfig={config} adminEmail={localAdmin} />;
  }

  const { error } = (await searchParams) ?? {};
  const configured = isLocalAdminConfigured();

  return (
    <main className={styles.lockedPage}>
      {configured ? (
        <form className={styles.lockedCard} action="/api/admin/login" method="post">
          <span className={styles.lockIcon}>J</span>
          <p className={styles.kicker}>JANOR CONTROL ROOM</p>
          <h1>Owner sign in</h1>
          <p>Voer uw beheerdersgegevens in om de website te bewerken.</p>
          {error && (
            <div className={styles.errorNotice}>
              Onjuist e-mailadres/gebruikersnaam of wachtwoord.
            </div>
          )}
          <label className={styles.loginField}>
            E-mail of gebruikersnaam
            <input
              name="username"
              type="text"
              autoComplete="username"
              placeholder="uw e-mailadres"
              required
              autoFocus
            />
          </label>
          <label className={styles.loginField}>
            Wachtwoord
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </label>
          <button className={styles.darkButton} type="submit" style={{ width: "100%", marginTop: "10px" }}>
            Inloggen
          </button>
          <Link className={styles.textLink} href="/">
            Terug naar Janor Cleaning
          </Link>
        </form>
      ) : (
        <section className={styles.lockedCard}>
          <span className={styles.lockIcon}>J</span>
          <p className={styles.kicker}>JANOR CONTROL ROOM</p>
          <h1>Admin access not configured.</h1>
          <p>
            Please set <code>ADMIN_EMAILS</code> and <code>ADMIN_PASSWORD</code> in your Render environment variables.
          </p>
          <Link className={styles.textLink} href="/">
            Return to Janor Cleaning
          </Link>
        </section>
      )}
    </main>
  );
}
