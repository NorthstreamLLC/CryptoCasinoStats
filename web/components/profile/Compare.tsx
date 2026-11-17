import { PartnerCards } from "@/components/PartnerCards";
import type { CasinoProfileData } from "@/lib/casino-profile";

export function Compare({ p }: { p: CasinoProfileData }) {
  return <PartnerCards cards={p.alternatives} placement="profile-compare" />;
}
