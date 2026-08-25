# phases.md — PROVENANCE

Version 1.0 · The build order is the product strategy. Phases are sequential; starting a
phase before the previous phase's exit criteria are met is prohibited (rules.md §2).
Every phase has **kill criteria** — honest, pre-agreed conditions under which the project
stops cleanly. Given the track record (four ambitious projects abandoned mid-build),
the kill criteria are the most important lines in this file.

---

## Phase 0 — "One Page" · 2 days, hard cap

**Goal:** The Kingfisher diaspora page, live on a public URL, beautiful enough that you
want to build the second one. No pipeline. No database. No abstractions.

### What to download / set up (in order)
1. Node 20+, pnpm, Python 3.12 + uv (you likely have all of these).
2. `npx create-next-app@latest provenance --typescript --tailwind --app --src-dir`
3. Fonts: Newsreader, Inter, IBM Plex Mono via `next/font/google` — no font files to manage.
4. Repo on GitHub; connect to Vercel (free); confirm deploy of the scaffold before
   writing any feature code. Deployment is task 4, not task 40.
5. Nothing else. No MapLibre yet (Phase 0 dispersal map is deferred — see scope).

### The data task (the real work — budget a full half of Phase 0)
Hand-assemble `pipeline/curated/airlines/kingfisher.yaml` per architecture.md §5:
- Kingfisher operated roughly 60–70 airframes across A319/320/321, A330-200, and the
  ATR 42/72 fleet (plus the Deccan inheritance). Verify counts yourself — do not trust
  this doc's number; that's the point of the exercise.
- For each airframe: type, MSN, Kingfisher-era registration (VT-…), operator era dates
  (approximate months fine), current status + operator + registration OR fate
  (stored/scrapped, where, roughly when), and 1–2 citation URLs.
- Sources: public registry lookups (FAA for any US-registered fates, G-INFO singles,
  DGCA lookups), Wikipedia fleet tables (cite them), news coverage of the 2012 collapse
  and aircraft repossessions. Individual public facts, cited — no bulk scraping
  (rules.md §4).
- `confidence:` field honestly per airframe. `sketchy` is an allowed value; fake
  precision is not.
- Aim for 100% of the fleet listed, even if 30% of fates are `partial`. Complete roster,
  honest gaps.

### Build scope (and only this)
- Design tokens in `globals.css` exactly per design.md §3.
- Components: nav, eyebrow, fate chip, **mini-lifeline** (static SVG, no scrub yet),
  fleet row, fate strip.
- The page: header + obituary (you write it, ~150 words, humanizer-checked) + fate
  strip + the full dispersal **list** (two-pane map deferred to Phase 1).
- OG image route for this one page.
- Deployed at `/airlines/kingfisher`.

### Exit criteria
- Live URL renders correctly on your phone.
- You have sent the link to at least one person unprompted.
- You want to build Jet Airways next.

### Kill criteria (agree with yourself now)
- Day 3 arrives and the page isn't live → the scope was violated somewhere; cut to the
  list-only version and ship it that evening, or kill.
- The finished page bores *you* → kill. Total cost: one weekend, one reusable design
  system.

---

## Phase 1 — "The Format" · 2 weekends

**Goal:** Prove the page is a *format*, not a one-off. Five diasporas, the interactive
dispersal, the full lifeline, first public post.

### Tasks
1. Promote Phase-0 hardcoding into a real loader: pages render from curated YAML via a
   tiny `emit` script (YAML → JSON). Still no DuckDB.
2. Curate four more airlines: **Jet Airways, Air Deccan, Pan Am, Ansett** (mix of
   Indian resonance + global icons; Pan Am's fleet is heavily documented, which makes it
   the easy one). Same standard as Kingfisher. This is most of the phase's hours.
3. Build the **full Lifeline component** (scrub, keyboard, SR narration, draw-on) per
   design.md §7 — it now replaces the mini version everywhere.
4. Build the **dispersal two-pane** (MapLibre near-monochrome style + livery arcs) per
   design.md §8.
5. Airlines index page + home page v1 (design.md §5).
6. Post the Kingfisher page to r/aviation and X. Note every piece of feedback in
   memory.md, verbatim.

### Exit criteria
- 5 diaspora pages live; lifeline scrub works on touch; one public post made.

### Kill criteria
- Curating airline #2 was so miserable you dread #3 → the product's core loop doesn't
  fit you; kill before the pipeline sunk-cost trap. (Signal to watch: if curation feels
  like research-detective work, good; if it feels like data entry, bad.)

---

## Phase 2 — "The Register" · 3–4 weeks of evenings

**Goal:** Biographies at scale. The long tail begins.

### Tasks
1. Stand up `pipeline/` for real (architecture.md §6): FAA Releasable DB + deregistered
   file ingest → DuckDB canon; conform Kingfisher-set YAML into the same canon.
2. Join logic + conflict report. Hand-review the first conflict batch; write the rules
   down as code comments and memory.md entries.
3. Emit per-airframe JSON for the **curated ~2,000** (Phase-1 fleets + notable types +
   verifiable Indian-registered airframes).
4. Biography page per design.md §6–7: dataplate, lifeline, identities table, fate block,
   cross-links, provenance footer.
5. Client search over the prebuilt index; sitemaps; substance-bar noindex rule
   (architecture.md §8).
6. ISR path for non-curated FAA airframes (thin but honest pages, noindexed until they
   cross the substance bar).

### Exit criteria
- 2,000 biographies live, interlinked with diasporas; search works; Lighthouse budgets
  green (architecture.md §9).

### Kill criteria
- Two consecutive weeks with zero commits → the register freezes as-is (Phases 0–1
  remain a complete, finished artifact — this is why diasporas shipped first) and the
  project is declared done at v1 rather than abandoned. Write the closing memory.md
  entry either way.

---

## Phase 3 — "Lineage" · 2–3 weeks

**Goal:** The graph, the survivors census, the obituary feed — the site gets a heartbeat.

### Tasks
1. Edge generation in the pipeline (fleet_mate, dispersal, succession).
2. Graph explorer per design.md §9 (canvas force layout, damped; entry from any page).
3. Survivors census page with the year slider.
4. Obituary feed: FAA dereg deltas between snapshots → new fate events → elegy cards +
   RSS. Automate the snapshot diff as a monthly `just` task (manual trigger is fine;
   no cron infrastructure yet).
5. OG cards for all new page types.

### Exit criteria
- You can start at a Kingfisher A320, reach a Pan Am 747 through the graph in ≤4 hops,
  and explain the path. The obituary RSS validates.

---

## Phase 4 — "Ghosts" · 3 weeks

**Goal:** The showpiece. Skies that no longer exist.

### Tasks
1. Transcribe schedules (facts only) for three ghosts: Pan Am c.1971, Concorde's final
   decade, Kingfisher at 2011 peak. Curated YAML: city pairs, frequencies, equipment,
   block times.
2. Playback engine: simulated clock → active-flight interpolation along great circles →
   deck.gl TripsLayer/ArcLayer on the inverted night style (design.md §10).
3. Instrument-strip time controls sharing the lifeline's grammar.
4. Aircraft dots link to biographies where the airframe is in the register.
5. Review tracking-data terms (OpenSky etc.) before any *tracked* ghost (e.g. a specific
   final flight); published-schedule ghosts need no such data.

### Exit criteria
- One ghost gets shared by someone with an audience you don't know. If it doesn't, the
  ghosts remain a beloved feature and the register remains the product — proceed to
  Phase 5 regardless.

---

## Phase 5 — "Pulse" · ongoing, low-intensity

Monthly data refresh ritual (one command + conflict review + obituary post), SEO
tending, an email digest of the obituary feed, prints experiment (lifeline posters —
the Phase 5 monetization toe-dip per PRD §8), and the *decision log* on whether delay
forensics or ACARS ever get built — as separate products on top of the register, never
as scope creep inside it.

---

## Standing weekly rhythm (all phases)

- Every session starts by reading memory.md and ends by updating it (rules.md §1).
- Ship something visible every weekend, even if small — a new obituary, a fixed fate,
  one more curated airframe. The register grows by accretion; accretion is the habit
  that ambitious architecture never gave you.
