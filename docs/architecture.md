# architecture.md — PROVENANCE

Version 1.0 · Binding for Phases 0–4. Changes require a dated entry in memory.md.

---

## 1. Architecture in one paragraph

A statically generated Next.js site fed by a Python data pipeline. The pipeline
(DuckDB + Polars) ingests public registry files into a canonical SQLite/Parquet store;
a build step emits per-entity JSON; Next.js renders pages from that JSON at build time
(SSG) with ISR for the long tail. No runtime database, no auth, no server state in
v1–v3. Interactive layers (lifeline, dispersal viz, lineage graph, ghosts) are client
components hydrating over static data. Total monthly cost target: ₹0.

```
 sources (FAA, OurAirports, Wikidata, hand-curated YAML)
        │  python pipeline (ingest → conform → join → validate)
        ▼
 canon/  provenance.duckdb  ──►  data/build/*.json  (per airframe, per airline)
        │                                 │
        ▼                                 ▼
 quality report (counts, gaps)     Next.js SSG/ISR  ──►  Vercel (static + edge)
```

## 2. Stack (pinned choices — do not relitigate mid-phase)

| Layer | Choice | Why this and not the obvious alternative |
|---|---|---|
| Framework | **Next.js 15, App Router, TypeScript strict** | SSG/ISR is exactly this product's shape; you know it |
| Styling | **Tailwind CSS v4** + CSS custom properties for design tokens | Tokens live in one file; design.md maps 1:1 to them |
| Motion | **Motion (framer-motion)** for UI; **rAF + custom easing** for lifeline scrub and ghost playback | Declarative for micro-interactions; imperative where 60fps matters |
| Data viz | **D3 (scales, shapes, force) rendering into SVG/Canvas inside React** | Lifeline and dispersal are bespoke; a chart library would fight us |
| Maps | **MapLibre GL** basemap + **deck.gl** (ArcLayer, TripsLayer) for ghosts | Zero-cost tiles (OpenFreeMap/Protomaps), you know this stack cold |
| Pipeline | **Python 3.12, uv, DuckDB, Polars, Pydantic** | Registry files are CSV/fixed-width monsters; DuckDB eats them |
| Canonical store | **DuckDB file in repo-adjacent storage; Parquet exports** | Queryable, diffable, no server |
| Page data | **Per-entity JSON emitted at build** (`data/build/airframes/<id>.json`) | Pages never query; they read one file |
| Hosting | **Vercel free tier** | SSG + ISR + OG image generation, zero ops |
| OG images | **@vercel/og** (satori) — every page gets a generated share card | Share cards are a growth feature, not decoration |
| Analytics | **Plausible CE self-host later / Vercel analytics free now** | Enough to see if anything resonates |
| Repo | Single monorepo: `apps/web` + `pipeline/` + `data/` | One clone, one truth |

Explicitly rejected: Postgres/Supabase (no runtime queries needed), any CMS (data is the
CMS), Three.js globe in v1 (deck.gl on MapLibre is 90% of the effect for 20% of the work;
revisit at Phase 4 polish), Prisma (no ORM without a database).

## 3. Repository layout

```
provenance/
├── docs/                      # this pack; memory.md is updated every session
├── apps/web/
│   ├── src/app/
│   │   ├── (site)/
│   │   │   ├── page.tsx                      # home: featured diaspora + obituary feed teaser
│   │   │   ├── airlines/[slug]/page.tsx      # diaspora pages
│   │   │   ├── aircraft/[id]/page.tsx        # biographies  (id = mfr-msn slug, §5)
│   │   │   ├── graph/page.tsx                # lineage explorer (Phase 3)
│   │   │   ├── survivors/page.tsx            # census (Phase 3)
│   │   │   ├── obituaries/page.tsx           # feed (Phase 3) + rss route
│   │   │   └── ghosts/[slug]/page.tsx        # playback (Phase 4)
│   │   ├── api/og/route.tsx                  # share-card generation
│   │   └── globals.css                       # design tokens (design.md §3)
│   ├── src/components/
│   │   ├── lifeline/          # the signature component; isolated, tested
│   │   ├── dispersal/
│   │   ├── dataplate/
│   │   ├── graph/
│   │   └── ghosts/
│   └── src/lib/               # data loaders, types (generated from schema)
├── pipeline/
│   ├── ingest/                # one module per source: faa.py, ourairports.py, wikidata.py
│   ├── conform/               # normalize → canonical schema
│   ├── curated/               # hand-maintained YAML (dead airlines, fleets) ← Phase 0 lives here
│   ├── emit/                  # canonical → data/build JSON
│   └── checks/                # validation + quality report
├── data/
│   ├── raw/          (gitignored)   # downloaded source files
│   ├── canon/        (gitignored)   # provenance.duckdb, parquet
│   └── build/        (committed for curated set; generated in CI later)
└── package.json / pyproject.toml / justfile
```

## 4. Data sources and their standing (binding — see rules.md)

| Source | What it gives | License / terms | Use |
|---|---|---|---|
| FAA Releasable Aircraft DB (bulk download) | US registrations, MSN, type, owner, status, dereg file | US public domain | ✅ Core of Phase 2 |
| OurAirports (CSV dumps) | Airports, runways, coordinates | Public domain | ✅ Ghosts, geography |
| Wikidata / Wikipedia | Airline lifespans, fleet histories, notable airframes | CC0 / CC-BY-SA (attribute) | ✅ With attribution |
| Published historical timetables (e.g. timetableimages, archives) | Ghost schedules | Facts are not copyrightable; images are | ✅ Transcribe facts, never rehost scans |
| OpenSky Network API | Recent tracks, live states | Free for non-commercial/research; check current terms | ⚠️ Lab features only; re-review at Phase 4 |
| ADS-B Exchange | Tracks | Commercial API paid; feeder-based free tier | ⚠️ Later, if ever |
| Planespotters / rzjets / airfleets | Rich production lists & histories | Their databases; scraping prohibited | ❌ Never scrape. Hand-research individual public facts and cite; use official photo API only if adopted, with attribution |
| DGCA (India), UK G-INFO, other national registers | Non-US registrations | Varies; some viewable, bulk terms unclear | ⚠️ Hand-verified single lookups OK; bulk only after reading terms, logged in memory.md |
| ASN / accident databases | Write-off events | Their compilation | ❌ No bulk use; cite individual public facts |

**Phase 0 data source is none of the above pipelines:** it is
`pipeline/curated/airlines/kingfisher.yaml`, hand-assembled by you from public
registries and cited per-airframe. Curated YAML remains a first-class source forever —
it is how every diaspora page is born, and pipeline data enriches it rather than
replacing it.

## 5. Canonical data model

Identifiers: `airframe_id = "<mfr_code>-<msn>"`, e.g. `airbus-3990`, `atr-798`.
Slugs are permanent once published (URLs are promises).

```yaml
# Airframe (the entity)
airframe_id: airbus-3990
manufacturer: Airbus
type: A320-232            # marketing type at build
msn: "3990"
first_flight: 2009-06     # month precision is normal; never invent days
line_status: active | stored | scrapped | preserved | written_off | unknown
fate:
  status: scrapped
  place: { name: "Roswell, NM", icao: KROW }   # optional
  date: 2021-04           # optional
  note: "parted out"      # optional, plain language
identities:               # ordered, non-overlapping where known
  - reg: VT-KFQ
    country: IN
    from: 2009-07
    to: 2012-10
  - reg: 9H-AMM
    country: MT
    from: 2013-02
    to: null
eras:                     # operator eras; drive lifeline colors
  - operator_id: kingfisher
    role: passenger
    from: 2009-07
    to: 2012-10
  - operator_id: airasia-x   # example
    role: passenger
    from: 2013-02
    to: null
conversions: []           # {kind: freighter|vip|tanker|test, date}
sources:                  # per-airframe citations; rendered in the footer
  - { ref: "FAA registry 2026-07 snapshot" }
  - { ref: "https://…", note: "final Kingfisher service" }
confidence: verified | partial | sketchy   # rendered honestly in UI

# Operator (airline)
operator_id: kingfisher
name: Kingfisher Airlines
country: IN
founded: 2003
ceased: 2012-10
livery:                   # feeds the design system (design.md §4)
  primary: "#B3202C"      # crimson
  secondary: "#EFE6D6"
obituary_md: >            # 120–180 words, written by you, humanizer-checked
  ...

# Edge (lineage)
edge: { from: airbus-3990, to: airbus-4021, kind: fleet_mate | dispersal | succession,
        via: kingfisher, note: "dispersed after collapse, 2013" }
```

Pydantic models in `pipeline/conform/schema.py` are the single source of truth;
`pipeline/emit` generates matching TypeScript types into `apps/web/src/lib/types.gen.ts`
(via datamodel-to-typescript step in the justfile). Nobody hand-edits generated types.

## 6. Pipeline stages (Phase 2+; forbidden earlier)

1. **ingest/** — download + snapshot raw files into `data/raw/<source>/<date>/`.
   Idempotent; every snapshot dated. Never mutate raw.
2. **conform/** — parse into canonical tables in DuckDB: `airframes`, `identities`,
   `eras`, `operators`, `edges`, each row carrying `source` + `ingested_at`.
3. **join/** — the hard part: matching identities to airframes across sources by
   (MSN, type) with explicit conflict rules; conflicts land in `conflicts.parquet`
   for hand review, never silently resolved.
4. **checks/** — validation (overlapping eras, impossible dates, orphan edges) and a
   quality report printed at the end of every run: counts, coverage %, unknowns.
5. **emit/** — write `data/build/airframes/*.json`, `airlines/*.json`, `feeds/*.json`
   plus small denormalized indexes (`search.json` with id, regs, type, operators for
   client-side search via a prebuilt index — Pagefind or minisearch; decide in Phase 2
   and record in memory.md).

Everything runs from a `justfile`: `just ingest faa`, `just build-data`, `just check`.
One command, deterministic, boring.

## 7. Frontend data flow

- Server components read JSON from `data/build` at build time. Zero client fetching for
  page content.
- Interactive components receive typed props; heavy ones (`ghosts/`, `graph/`) are
  `dynamic(() => import(...))` with designed loading states (design.md §9).
- Lifeline renders as SVG server-side for the static frame, hydrates scrub interaction
  client-side — the page is meaningful with JS disabled.

## 8. Scale plan for biographies

- Phase 2 launch: **curated ~2,000 airframes** (every airframe in the Phase 1 diasporas
  + notable types + everything Indian-registered we can verify) fully SSG.
- Long tail (US registry breadth): `generateStaticParams` returns the curated set;
  everything else renders on-demand via ISR (`revalidate: false`, generated on first
  hit, cached forever until data redeploy). Vercel free tier handles this shape.
- Sitemaps chunked at 10k URLs; only pages meeting a minimum-substance bar (≥1 era or a
  fate) get indexed — thin pages are `noindex` to protect search reputation.

## 9. Performance and quality budgets (CI-enforced from Phase 1)

- LCP < 1.8s on 4G mid-tier mobile for biography and diaspora pages.
- JS shipped on a biography page < 120KB gz before the graph/ghost routes.
- CLS ≈ 0 (all viz containers have reserved aspect boxes).
- Lighthouse a11y ≥ 95; the lifeline is keyboard-scrubbable and screen-reader
  narratable ("1 of 3 eras: Kingfisher Airlines, 2009 to 2012").

## 10. Environments and CI

- GitHub repo, trunk-based, deploy on merge to `main` via Vercel.
- CI: typecheck, lint, `just check` (data validation) when `pipeline/` or `data/`
  changed, Playwright smoke on the two core page types.
- No secrets in v1 (no keyed APIs at runtime). Any future key goes in Vercel env only.
