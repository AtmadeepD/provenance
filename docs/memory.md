# memory.md — PROVENANCE (living document)

Purpose: the single continuity file. Read at the start of every session (human and
agent), appended at the end of every session. Newest entries at the top of the log.
This file is allowed to be messy; it is not allowed to be stale.

---

## Current state

- **Phase:** 0 — "One Page" (not started)
- **Live URL:** —
- **Next task:** Scaffold repo + Vercel deploy (phases.md → Phase 0 → setup steps 1–4)
- **Blocking:** nothing

## Standing decisions (summarized; details in the docs)

- D-001 · 2026-08-25 · Entity = airframe keyed by manufacturer+MSN; registrations are
  identities, not entities. (PRD §5)
- D-002 · 2026-08-25 · Wedge = diaspora pages; Kingfisher first; no pipeline before
  Phase 2. (phases.md)
- D-003 · 2026-08-25 · Design = paper & ink; the only saturated color is livery data.
  Dark mode only on ghost pages. (design.md §2)
- D-004 · 2026-08-25 · Stack pinned: Next 15 / Tailwind v4 / Motion / D3 / MapLibre +
  deck.gl / Python+DuckDB pipeline / Vercel. (architecture.md §2)
- D-005 · 2026-08-25 · Licensing: FAA/OurAirports/Wikidata bulk-OK; spotters' DBs
  never scraped; unknowns rendered honestly. (rules.md §4)
- D-006 · 2026-08-25 · Deferred: delay forensics, ACARS, accounts, dark-mode-global,
  Three.js globe. (PRD §6.5)

## Glossary (keep the agent fluent)

- **MSN** — manufacturer serial number; permanent per airframe. Our primary key.
- **Registration** — the tail identity (VT-KFQ, N747PA); changes with country/owner.
- **Era** — a continuous operator period; drives lifeline segments and livery color.
- **Fate** — active | stored | scrapped | preserved | written_off | unknown.
- **Diaspora** — where a dead airline's airframes went.
- **Ghost** — a schedule-reconstructed historical network, replayed.
- **Dataplate** — the biography header component (design.md §6).
- **Lifeline** — the signature scrubbable life-strip component (design.md §7).

## Data source notes (append as learned)

- FAA Releasable Aircraft DB: bulk download page on faa.gov; refreshed regularly;
  includes deregistered file — the obituary feed's raw material. (verify current URL at
  Phase 2 start; log it here)
- OurAirports: full CSVs, public domain, includes closed airports (useful for ghosts).
- Kingfisher curation leads: Wikipedia fleet table (cite), 2012–13 repossession news
  coverage, DGCA/G-INFO single lookups for fates. Fill in verified URLs as used.

## Parking lot (ideas that tried to jump the queue)

- Delay forensics product (PRD §6.5)
- ACARS live layer on biographies
- "The last passenger" — final revenue flight of scrapped airframes
- "Reincarnation" tag — pax→tanker/VIP conversions as a browsable collection
- Lifeline print/poster generator (Phase 5 candidate)
- India-first registry deep-dive (post-Phase 2 curation sprint)

## Feedback log (verbatim, dated)

- (empty — first entries arrive after the Phase 1 public post)

## Session log (newest first)

### 2026-08-25 · Session 0.6 — The mini-lifeline
- Created the static `MiniLifeline` component (240x36 pure SVG, using `d3-scale`).
- Implemented all fate terminal symbols (active, stored, scrapped, preserved, unknown) and correctly mapped `--fate-writtenoff`.
- Handled edge cases explicitly, rendering a single muted bar when dates are unknown, and omitting fate color for unknown states.
- Showcased all variants in the `/_kitchen` route.

### 2026-08-25 · Session 0.5b — Roster converter
- Wrote `pipeline/emit/roster-to-yaml.mjs` to convert the `kingfisher-roster.psv` data into schema-valid YAML entries.
- Fixed JSON Schema `identities` rule to make the `country` field optional to accommodate post-Kingfisher partial identities.
- Parsed and merged all 68 aircraft into `kingfisher.yaml`, replacing placeholders.
- Verified validation via `npm run build:data`, ensuring all 68 airframes built correctly.

### 2026-08-25 · Session 0.4b — Schema v2 migration
- Rewrote `pipeline/curated/schema/airline.schema.json` to schema v2, removing `line_status` and `fate`, and adding `status`, `events`, and split `confidence`.
- Updated `apps/web/src/lib/types.ts` to reflect the new structure perfectly.
- Updated `kingfisher.yaml` placeholders and operator block to conform to schema v2.
- Updated `pipeline/emit/build.mjs` with custom validation checking for missing `confidence.status` on known states, and mapped Ajv errors to output the aircraft registration on failure.

### 2026-08-25 · Session 0.4 — Data Contract
- Defined JSON schema for airlines and airframes in `pipeline/curated/schema/airline.schema.json`.
- Hand-assembled the initial structural template for `pipeline/curated/airlines/kingfisher.yaml` with 3 placeholder airframes.
- Built Node.js script `pipeline/emit/build.mjs` to validate YAMLs against the schema using `ajv` and compile to `data/build/airlines/kingfisher.json`.
- Configured Next.js `build:data` script in package.json to run data compilation before the UI build.
- Generated matching TypeScript interfaces in `lib/types.ts` and a server-side JSON loader `lib/data.ts`.

### 2026-08-25 · Session 0.3 — Site Chrome
- Built `SiteNav` component with sticky behavior, backdrop blur on scroll, and mobile menu toggle.
- Handled disabled states for unbuilt routes with `aria-disabled` and --ink-3 styling.
- Built `SiteFooter` component for citations and snapshot date.
- Added both components to `layout.tsx` to apply globally.

### 2026-08-25 · Session 0.2 — Design Tokens
- Set up globals.css with complete design.md §3 tokens (colors, typography scale, radii, shadows).
- Configured reduced-motion media query and global visible focus rings.
- Created UI primitives: Eyebrow, FateChip, Mono, Container.
- Created `/kitchen` reference route (noindex) showcasing all primitives and tokens.

### 2026-08-25 · Session 0.1 — Scaffold
- Next.js 15, Tailwind v4, and fonts (Newsreader, Inter, IBM Plex Mono) set up.
- Directory skeleton initialized with .gitignore.
- Home page set to PROVENANCE static title.
- Next: Vercel deploy, then begin `pipeline/curated/airlines/kingfisher.yaml`.

### 2026-08-25 · Session 0 — project defined
- Doc pack created: PRD, architecture, design, phases, rules, memory.
- Project named PROVENANCE. Phase 0 scope locked: Kingfisher diaspora page,
  2-day cap, list-only dispersal, deploy before feature code.
- Next: scaffold + deploy, then begin `pipeline/curated/airlines/kingfisher.yaml`.
