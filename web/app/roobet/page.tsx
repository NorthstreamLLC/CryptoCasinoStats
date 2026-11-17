import { CasinoStatPage, casinoPage } from "@/components/CasinoStatPage";
import { pageMeta } from "@/lib/site";

const c = casinoPage("roobet");
export const metadata = pageMeta(c.name, c.description, "/roobet/", { image: c.logo });

export default function Page() {
  return <CasinoStatPage slug="roobet" />;
}
