import { CasinoStatPage, casinoPage } from "@/components/CasinoStatPage";
import { pageMeta } from "@/lib/site";

const c = casinoPage("stake");
export const metadata = pageMeta(c.name, c.description, "/stake/", { image: c.logo });

export default function Page() {
  return <CasinoStatPage slug="stake" />;
}
