import { CasinoStatPage, casinoPage } from "@/components/CasinoStatPage";
import { pageMeta } from "@/lib/site";

const c = casinoPage("razed");
export const metadata = pageMeta(c.name, c.description, "/razed/", { image: c.logo });

export default function Page() {
  return <CasinoStatPage slug="razed" />;
}
