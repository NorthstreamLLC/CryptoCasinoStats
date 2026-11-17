import { notFound } from "next/navigation";
import { CasinoProfile } from "@/components/profile/CasinoProfile";
import { OPS, getCasino, isRootCasino } from "@/lib/casinos";
import { volumeFor } from "@/lib/volume";
import { pageMeta } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return OPS.filter((o) => !isRootCasino(o.slug)).map((o) => ({ slug: o.slug }));
}

function describe(slug: string) {
  const o = getCasino(slug)!;
  const v = volumeFor(slug);
  const dep = v?.deposits[0];
  return dep
    ? `${o.name} casino stats: ${dep.value} in 30-day on-chain deposits (${dep.source}), hot-wallet balance, KYC policy, withdrawal times and terms, each with its source.`
    : `${o.name} casino stats: KYC policy, withdrawal times, coins, licence and bonus terms, each taken from ${o.name}'s own pages with the source linked.`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const o = getCasino(slug);
  if (!o) return {};
  return pageMeta(`${o.name} Casino Stats`, describe(slug), `/casinos/${slug}/`);
}

export default async function CasinoPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  if (!getCasino(slug)) notFound();
  return <CasinoProfile slug={slug} path={`/casinos/${slug}/`} />;
}
