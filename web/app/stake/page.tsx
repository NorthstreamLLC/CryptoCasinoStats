import { CasinoProfile, casinoCopy } from "@/components/profile/CasinoProfile";
import { pageMeta } from "@/lib/site";

const c = casinoCopy("stake")!;
export const metadata = pageMeta(c.name, c.description, "/stake/", { image: c.logo });

export default function Page() {
  return <CasinoProfile slug="stake" path="/stake/" />;
}
