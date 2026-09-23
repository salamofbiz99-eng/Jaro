import { chatGPTSignOutPath, requireChatGPTUser } from "@/app/chatgpt-auth";
import Link from "next/link";
import { getSiteConfig } from "@/db/site-config";
import { isAdminConfigured, isAdminEmail } from "@/lib/admin-auth";
import { getLocalAdminFromCookies, isLocalAdminConfigured } from "@/lib/local-auth";
import AdminEditor from "./AdminEditor";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const localAdmin = await getLocalAdminFromCookies();
  if (localAdmin) {
    const config = await getSiteConfig();
    return <AdminEditor initialConfig={config} adminEmail={localAdmin} />;
  }

  const configured = isAdminConfigured() || isLocalAdminConfigured();

  let userEmail: string | null = null;
  try {
    const user = await requireChatGPTUser("/admin");
    userEmail = user.email;
  } catch {
    // If requireChatGPTUser redirects, let Next.js handle the redirect
  }

  if (userEmail && isAdminEmail(userEmail)) {
    const config = await getSiteConfig();
    return <AdminEditor initialConfig={config} adminEmail={userEmail} />;
  }

  return (
    <main className={styles.lockedPage}>
      <section className={styles.lockedCard}>
        <span className={styles.lockIcon}>J</span>
        <p className={styles.kicker}>JARO CONTROL ROOM</p>
        <h1>{configured ? "Administrator access required." : "Administrator access is not connected yet."}</h1>
        <p>
          {configured
            ? `Sign in with your administrator account to access the control room.`
            : "The admin panel is ready. Set environment variables ADMIN_EMAILS & ADMIN_PASSWORD (or ADMIN_USERNAME & ADMIN_PASSWORD_SHA256) in Render to enable access."}
        </p>
        {isLocalAdminConfigured() && (
          <Link className={styles.darkButton} href="/admin/login">Sign in to Admin Panel</Link>
        )}
        {userEmail && (
          <a className={styles.textLink} href={chatGPTSignOutPath("/admin")}>Sign out ({userEmail})</a>
        )}
        <Link className={styles.textLink} href="/">Return to JARO Cleaning</Link>
      </section>
    </main>
  );
}
