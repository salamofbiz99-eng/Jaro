import HomeClient from "./HomeClient";
import { getSiteConfig } from "@/db/site-config";

export const dynamic = "force-dynamic";

export default async function Home() {
  const config = await getSiteConfig();
  return <HomeClient config={config} />;
}
