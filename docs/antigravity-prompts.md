# antigravity-prompts.md — Phase 0

How to use: one prompt per session, in order. Do not skip, do not merge two prompts into
one session. Each prompt ends with acceptance criteria — verify them yourself in the
browser before moving on. If a prompt's output fails acceptance, reply with the failing
criterion only; don't re-explain the whole task.

**Paste this preamble at the top of EVERY prompt below:**

> Read docs/rules.md and docs/memory.md before doing anything, and follow docs/design.md
> and docs/architecture.md exactly. Do not invent colors, sizes, shadows, animations, or
> dependencies that aren't in those files — if you think one is needed, stop and ask.
> We are in Phase 0. Anything outside Phase 0 scope in docs/phases.md is out of bounds.
> At the end, append a session entry to docs/memory.md.

---

## P0.1 — Scaffold and deploy an empty site

> Scaffold the project per docs/architecture.md §3.
>
> 1. Create a Next.js 15 app at `apps/web` with TypeScript (strict), Tailwind CSS v4,
>    App Router, `src/` dir, no ESLint prompts left unanswered.
> 2. Create the directory skeleton from architecture.md §3, with `.gitkeep` files where
>    folders are empty. Include `pipeline/curated/airlines/`, `data/build/`, `docs/`.
> 3. Add `.gitignore` entries for `data/raw/` and `data/canon/`.
> 4. Wire the three fonts via `next/font/google`: Newsreader (variable, optical sizing),
>    Inter (variable), IBM Plex Mono (400, 500). Expose them as CSS variables
>    `--font-display`, `--font-text`, `--font-mono` on `<html>`.
> 5. Replace the default home page with a single centered line: "PROVENANCE" in
>    Newsreader, and below it in IBM Plex Mono at 12px, letterspaced, uppercase:
>    "a register of aircraft lives". Nothing else. Paper background `#FAFAF7`,
>    ink `#16181D`.
> 6. Initialize git, commit as `chore: scaffold`.
>
> Then tell me the exact commands to run to (a) start the dev server and (b) connect this
> repo to Vercel for the first deploy. Do not attempt the deploy yourself.

**Acceptance:** dev server renders the two lines in the correct fonts; you have deployed
to Vercel and the public URL works on your phone. Do not proceed until the URL is live.

---

## P0.2 — Design tokens and primitives

> Implement the design system foundation from docs/design.md §3 and §4.
>
> 1. In `apps/web/src/app/globals.css`, define every token in design.md §3.1 as CSS
>    custom properties on `:root`, and map them into the Tailwind v4 `@theme` block so
>    they're usable as utility classes (`bg-paper`, `text-ink-2`, `border-rule`, etc.).
> 2. Define the type scale from §3.2 as theme font sizes with their specified
>    line-heights: display-xl, display, h2, h3, body, small, micro. Micro must carry
>    `letter-spacing: 0.06em; text-transform: uppercase`.
> 3. Define radius tokens (10/6/2px), `--shadow-plate`, and the container (1200px max,
>    24px gutters).
> 4. Add a global `@media (prefers-reduced-motion: reduce)` block that disables all
>    transitions and animations.
> 5. Add a visible focus style: 2px solid `--ink`, 2px offset, on all interactive
>    elements.
> 6. Build these primitives in `src/components/`:
>    - `Eyebrow` — micro type, `--ink-3`, renders children; optional `rule` prop that
>      adds a 1px `--rule` line under it with 8px gap.
>    - `FateChip` — props `{ status: 'active'|'stored'|'scrapped'|'preserved'|'written_off'|'unknown' }`.
>      Renders a 6px radius pill: 1px border and text in the matching `--fate-*` color,
>      background `--paper-raised`, label in mono micro type (FLYING / STORED / SCRAPPED /
>      PRESERVED / LOST / UNKNOWN).
>    - `Mono` — inline span forcing `--font-mono`, tabular numerals.
>    - `Container` — the layout wrapper.
> 7. Create a route at `/_kitchen` (noindex) that renders every token swatch, every type
>    size with its name, and all six FateChip states. This page is our design reference
>    and stays for the life of the project.
>
> Commit as `feat: design tokens and primitives`.

**Acceptance:** `/_kitchen` shows the full system; colors match design.md exactly
(check two hex values by eye against the doc); tab key shows visible focus rings.

---

## P0.3 — Site chrome

> Build the nav and footer from docs/design.md §4.
>
> 1. `SiteNav`: sticky top, `--paper` background, 1px `--rule` bottom border, backdrop
>    blur that only engages after 8px of scroll (use a scroll listener with
>    `requestAnimationFrame` throttling, client component, no library). Left: wordmark
>    "PROVENANCE" in Newsreader at h3 size, links to `/`. Right: text links —
>    airlines, aircraft, survivors, obituaries, ghosts — in body size, `--ink-2`,
>    hover to `--ink`. No buttons, no CTA. Links to unbuilt routes are rendered but
>    disabled with `--ink-3` and `aria-disabled`; only "airlines" is live in Phase 0.
> 2. Mobile (<768px): the nav collapses to wordmark + a text "menu" toggle that opens a
>    full-width paper panel below the bar with the same links stacked. No hamburger icon,
>    no slide-in drawer, no overlay dimming.
> 3. `SiteFooter`: a `--rule` top border, three stacked lines in small/micro type —
>    a `sources` slot (children, so pages inject their own citations), the line
>    "part of the PROVENANCE register", and a mono line "data snapshot: {date}" taking a
>    prop.
> 4. Apply both in the root layout.
>
> Commit as `feat: site chrome`.

**Acceptance:** nav is sticky and the hairline appears on scroll; mobile menu works at
360px; disabled links are not clickable and are announced as disabled.

---

## P0.4 — Data contract and the Kingfisher file (structure only)

> Set up the Phase 0 data contract. **Do not invent any aircraft data** — every value
> in the file must be a placeholder I will replace, or left empty.
>
> 1. Create `pipeline/curated/schema/airline.schema.json` — a JSON Schema for the
>    operator + airframe shapes exactly as specified in docs/architecture.md §5
>    (operator fields, airframes with airframe_id, manufacturer, type, msn, first_flight,
>    line_status, fate, identities[], eras[], conversions[], sources[], confidence).
> 2. Create `pipeline/curated/airlines/kingfisher.yaml` containing: the fully filled
>    operator block for Kingfisher Airlines (name, country IN, founded 2003, ceased
>    2012-10, livery primary `#B3202C` secondary `#EFE6D6`, empty obituary_md I will
>    write), and then exactly THREE example airframe entries filled with obviously fake
>    placeholder values (msn "XXXX", reg "VT-XXX") and extensive inline comments
>    explaining every field, so I can copy-paste the block sixty more times.
> 3. Create `pipeline/emit/build.mjs` — a plain Node script (no Python yet, Phase 0):
>    reads every YAML in `pipeline/curated/airlines/`, validates against the JSON Schema
>    (use `ajv` + `yaml`), and writes `data/build/airlines/<operator_id>.json`. On
>    validation failure it prints the offending file, path, and message, and exits 1.
>    It prints a summary: airframes in, airframes out, count by confidence.
> 4. Add `pnpm run build:data` to package.json, and make `pnpm build` run it first.
> 5. Generate `apps/web/src/lib/types.ts` by hand-writing TypeScript interfaces that
>    mirror the JSON Schema, plus a `getAirline(slug)` loader that reads the built JSON
>    from disk in a server component.
>
> Commit as `feat: phase 0 data contract`.

**Acceptance:** `pnpm run build:data` succeeds with the three placeholder airframes and
prints the summary; corrupting a field makes it fail with a clear message.

---

## P0.5 — YOUR TASK, NOT THE AGENT'S · fill the Kingfisher fleet

Close Antigravity. This is research, and it is the half of Phase 0 that decides whether
the project is yours.

- Work through Kingfisher's fleet airframe by airframe: type, MSN, VT- registration,
  era dates, and **where it is now** — current operator and registration, or scrapped
  (where, roughly when), or stored.
- Cite 1–2 URLs per airframe in `sources[]`. Set `confidence` honestly:
  `verified` / `partial` / `sketchy`.
- Rules from rules.md §4 apply: hand-verified public facts only, no bulk scraping of
  spotters' databases, and **never invent a fate**. `unknown` is a legitimate answer and
  will render honestly.
- Also write `obituary_md`: 150 words, your voice, on what Kingfisher was and how it
  ended. Run it through the humanizer skill afterwards.
- Target the complete roster even if a third of the fates are partial.

**Acceptance:** `pnpm run build:data` validates the full file. Note the airframe count
and the confidence breakdown in `docs/memory.md`.

---

## P0.6 — The mini-lifeline

> Build the static mini-lifeline from docs/design.md §7 (small variant only — no scrub,
> no keyboard, no draw-on animation; those arrive in Phase 1).
>
> Component `src/components/lifeline/MiniLifeline.tsx`, server-renderable pure SVG,
> default size 240×36, props `{ eras, identities, fate, from, to, liveryFallback }`.
>
> - Map the airframe's full timespan (first era start → today, or → fate date) onto the
>   x-axis with a D3 linear time scale.
> - Era segments: filled rects at 14px height, vertical center, in each era's operator
>   livery `primary` (pass a color per era; use `--ink-3` when an operator has no livery
>   in data).
> - Gaps between eras: `--paper-sunken` fill with a 45° 2px hatch pattern.
> - Identity changes: 1px `--ink` vertical ticks, full 20px height.
> - Fate terminal at the right edge, in the matching `--fate-*` color: active = a 6px
>   arrowhead continuing past the axis; stored = two 2px vertical bars; scrapped = a 7px
>   ✕ in 1.5px strokes; preserved = a 6px diamond; unknown = a 3px dot.
> - Accessibility: `role="img"` with an `aria-label` generated as
>   "1946 to 2019; operators: TWA, then Kalitta; scrapped."
> - No tooltips, no hover state, no client JS at all in this variant.
>
> Add every variant to `/_kitchen`: an active 2-era aircraft, a scrapped 3-era with a
> storage gap, and an unknown-fate single-era.
>
> Commit as `feat: mini lifeline`.

**Acceptance:** the three kitchen variants read correctly at 240px wide and still legible
at 180px; zero JS shipped for this component.

---

## P0.7 — The Kingfisher diaspora page

> Build `/airlines/[slug]` per docs/design.md §8, list-only (the two-pane map is Phase 1;
> do not build MapLibre).
>
> Layout, top to bottom, inside Container:
> 1. `Eyebrow` with rule: `airline · 2003–2012`.
> 2. Title "Kingfisher Airlines" in display size, Newsreader — the terminal period
>    rendered in the operator's livery primary via a span.
> 3. The obituary from `obituary_md`, set in Newsreader at h3 size, max 68ch,
>    `--ink-2`. Render markdown minimally (paragraphs, em) — no markdown library, write
>    a 15-line paragraph splitter.
> 4. **Fate strip**: a single 100%-width stacked bar, 10px tall, 6px radius, segments
>    in `--fate-*` colors proportional to fleet counts, with a mono legend beneath:
>    `14 flying · 6 stored · 7 scrapped · 3 unknown`. Above it, an Eyebrow: `the fleet
>    today`. Segments animate width from 0 over 500ms on mount, staggered 40ms, once —
>    add this row to the motion table in design.md §11 and note it in memory.md.
> 5. **The dispersal list**: an ordered list of fleet rows, sorted by fate (flying,
>    stored, scrapped, unknown) then by type. Each row is a grid:
>    `[MiniLifeline 240px] [type + MSN, mono] [VT-KFQ → 9H-AMM, mono, with a → in --ink-3]
>     [current operator, body] [FateChip]`.
>    Row hover: background to `--paper-sunken` over 120ms, nothing else. 1px `--rule`
>    between rows. Rows with `confidence: partial|sketchy` get a small mono `~` marker
>    before the fate chip with a `title` explaining the record is incomplete.
>    Mobile (<768px): the row reflows to two lines — lifeline full width on top,
>    then type/regs/fate wrapped, with the operator column dropped.
> 6. Filter chips above the list (sunken pills, mono micro labels): All / Flying /
>    Stored / Scrapped / Unknown. Client-side filter, no URL state in Phase 0.
> 7. Footer `sources` slot: the union of every `sources[].ref` on the page, deduplicated,
>    as a plain list of links.
>
> Also build `/airlines` as a simple index listing the one airline (card: name, years,
> fleet count, fate strip in miniature).
>
> Use `generateStaticParams` from the built JSON. `generateMetadata` sets title
> "Kingfisher Airlines — where the fleet went | PROVENANCE" and a description built from
> the fate counts.
>
> Commit as `feat: kingfisher diaspora page`.

**Acceptance:** every airframe in your YAML appears; filters work; the page is correct at
360px; no layout shift on load; keyboard reaches every filter chip.

---

## P0.8 — Share card and ship

> 1. Build `apps/web/src/app/api/og/route.tsx` using `next/og`. For an airline slug, it
>    renders a 1200×630 card: `--paper` background, the airline name in Newsreader at
>    72px with the livery-colored period, an Eyebrow line `airline · 2003–2012`, the fate
>    strip rendered as flat rects, and bottom-left "PROVENANCE" in mono micro. Fonts must
>    be loaded as ArrayBuffers per the next/og docs — verify it actually renders, don't
>    assume.
> 2. Wire it into `generateMetadata` for the airline route (openGraph + twitter
>    `summary_large_image`).
> 3. Add `robots.txt`, a `sitemap.ts` covering `/` and `/airlines/*`, and `noindex` on
>    `/_kitchen`.
> 4. Run a Lighthouse pass on the Kingfisher page; report the four scores and the LCP
>    number. Fix anything that puts LCP above 1.8s or a11y below 95.
> 5. Update docs/memory.md: mark Phase 0 complete, record the airframe count, confidence
>    breakdown, live URL, and the Phase 1 next task.
>
> Commit as `feat: share cards and phase 0 ship`.

**Acceptance:** paste the live URL into WhatsApp and the card renders. That's Phase 0.

---

## Then: the gate

Do not open Phase 1 the same day. Sit with the page for 24 hours. The only question that
matters is in phases.md: **do you want to build Jet Airways next?** Answer it honestly in
memory.md before writing another line of code.
