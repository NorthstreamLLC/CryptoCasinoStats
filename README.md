# Crypto Casino Stats

cryptocasinostats.com, rebuilt from WordPress as a Next.js 16 site on Vercel, on the same stack and conventions as CryptoSlotGuide. The app is in `web/` (set the Vercel project's **Root Directory** to `web`).

Read `web/AGENTS.md` first: this Next.js has breaking changes; the docs are in `web/node_modules/next/dist/docs/`.

## Rules for content
- Only publish a figure with a stated, checkable source and a date (on-chain trackers, the casino's own pages, studio-published slot data). No RTP above 100% is ever shown as an RTP.
- Never describe a casino as unlicensed, rigged or a scam: state what the data shows and cite it.
- Every URL from the old site keeps its exact path with the trailing slash (`trailingSlash: true`), plus `/feed/`, `/comments/feed/` and the Yoast sitemap filenames.

## Data
Shared with CryptoSlotGuide (read-only copy; refresh with `npm run sync:data -- /path/to/cryptoslotguide`):
`onChainVolume.json` (FairGambling/Tanzanite on-chain figures), `casinoSpecSheets.json`, `rtpWatch.json` (casino RTP readings), `gameCatalogue.json`, `ops.json` (partner links via `/go/<slug>/`), geo and legal tables used by `lib/partner-fit.ts` and `components/geo/GeoRanked.tsx`.

This site's own content: `data/ccs/casinoPages.json` (Stake, Roobet, Razed page copy) and `data/ccs/posts.json` (articles carried over from WordPress). Images from WordPress are served at their original paths under `public/wp-content/uploads/`.

## Commands (in `web/`)
- `npm run dev`, `npm run build`
- `npm run import:onchain -- file.csv`, `npm run import:rtp -- file.csv`
- `../scripts/ship.sh --check` runs the type check and full build; without `--check` it pushes to main (only after the owner has approved).
