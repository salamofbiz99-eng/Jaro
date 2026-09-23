import { chatGPTSignOutPath, requireChatGPTUser } from "@/app/chatgpt-auth";
import Link from "next/link";
import { getSiteConfig } from "@/db/site-config";
import { isAdminConfigured, isAdminEmail } from "@/lib/admin-auth";
import AdminEditor from "./AdminEditor";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  const configured = isAdminConfigured();

  if (!isAdminEmail(user.email)) {
    return (
      <main className={styles.lockedPage}>
        <section className={styles.lockedCard}>
          <span className={styles.lockIcon}>J</span>
          <p className={styles.kicker}>JARO CONTROL ROOM</p>
          <h1>{configured ? "This account is not an administrator." : "Administrator access is not connected yet."}</h1>
          <p>
            {configured
              ? `You are signed in as ${user.email}. Use the administrator email configured for this website.`
              : "The panel is ready, but the owner email still needs to be connected before anyone can change the live website. Set ADMIN_EMAILS and the ADMIN_PASSWORD secret in Cloudflare."}
          </p>
          <a className={styles.darkButton} href={chatGPTSignOutPath("/admin")}>Sign out</a>
          <Link className={styles.textLink} href="/">Return to JARO Cleaning</Link>
        </section>
      </main>
    );
  }

  const config = await getSiteConfig();
  return <AdminEditor initialConfig={config} adminEmail={user.email} />;
}
