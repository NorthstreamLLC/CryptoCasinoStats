import { CasinoProfile, casinoCopy } from "@/components/profile/CasinoProfile";
import { pageMeta } from "@/lib/site";

const c = casinoCopy("roobet")!;
export const metadata = pageMeta(c.name, c.description, "/roobet/", { image: c.logo });

export default function Page() {
  return <CasinoProfile slug="roobet" path="/roobet/" />;
}
