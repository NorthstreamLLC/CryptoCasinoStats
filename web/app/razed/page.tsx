import { CasinoProfile, casinoCopy } from "@/components/profile/CasinoProfile";
import { pageMeta } from "@/lib/site";

const c = casinoCopy("razed")!;
export const metadata = pageMeta(c.name, c.description, "/razed/", { image: c.logo });

export default function Page() {
  return <CasinoProfile slug="razed" path="/razed/" />;
}
