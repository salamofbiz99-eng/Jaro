import Link from "next/link";
import { redirect } from "next/navigation";
import { getLocalAdminFromCookies, isLocalAdminConfigured } from "@/lib/local-auth";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (!isLocalAdminConfigured()) redirect("/admin");
  if (await getLocalAdminFromCookies()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <main className={styles.lockedPage}>
      <form className={styles.lockedCard} action="/api/admin/login" method="post">
        <span className={styles.lockIcon}>J</span>
        <p className={styles.kicker}>JARO CONTROL ROOM</p>
        <h1>Owner sign in</h1>
        <p>Enter the local administrator details created during setup.</p>
        {error && <div className={styles.errorNotice}>The username or password is incorrect.</div>}
        <label className={styles.loginField}>Username<input name="username" autoComplete="username" required /></label>
        <label className={styles.loginField}>Password<input name="password" type="password" autoComplete="current-password" required /></label>
        <button className={styles.darkButton} type="submit">Sign in</button>
        <Link className={styles.textLink} href="/">Return to JARO Cleaning</Link>
      </form>
    </main>
  );
}
