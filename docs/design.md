# design.md — PROVENANCE

Version 1.0 · Binding. The agent may not invent colors, type sizes, shadows, or motion
values outside this file. New tokens require a dated entry in memory.md.

---

## 1. Design thesis

PROVENANCE is an **archive that moves**. The reference (Dreelio) gives us the register:
light, calm, generously spaced, a disciplined grid, lowercase eyebrows, big confident
headlines, everything feeling machined. We keep that register and replace its SaaS soul
with the subject's own materials: **registry ledgers, engraved dataplates, and livery
paint**. The result should feel like a beautifully typeset national register that happens
to be alive under your cursor — not a dashboard, not a tracker, not a dark "hacker"
map site.

Three words to test every screen against: **archival, precise, elegiac.**
If a screen feels like analytics software, it's wrong. If it feels like a museum wall
label with perfect kerning, it's right.

## 2. The one aesthetic risk (spend boldness here)

**Color is data.** The site itself is nearly monochrome — paper and ink. The only
saturated color anywhere comes from **airline liveries**, applied as data: era segments
in a lifeline, the accent of a diaspora page, the tint of a card's hairline. A Kingfisher
page bleeds crimson because Kingfisher was crimson; a Pan Am page goes blue. The system
has no brand accent color of its own. This is unusual, it is subject-derived, and it
makes every page feel specific instead of themed.

Consequence (hard rule): livery colors are defined per-operator in data
(architecture.md §5), pass WCAG contrast when used on paper (each livery defines a
`primary` and an automatically derived `ink-safe` variant), and are **never** used
decoratively outside their operator's context.

## 3. Tokens

Defined once in `globals.css` as CSS custom properties; Tailwind v4 theme maps to them.

### 3.1 Color — "paper & ink"

```css
--paper:        #FAFAF7;  /* page ground — bone, cooler than cream, not #F4F1EA */
--paper-raised: #FFFFFF;  /* cards, plates */
--paper-sunken: #F1F1EC;  /* wells, code/reg chips, table stripes */
--ink:          #16181D;  /* primary text — blue-black, like registry ink */
--ink-2:        #4A4E58;  /* secondary text */
--ink-3:        #8B8F99;  /* captions, metadata */
--rule:         #E3E3DC;  /* hairlines — 1px, everywhere structure exists */
--rule-strong:  #C9C9C0;
--fate-active:    #2E7D57;  /* the only fixed semantic colors: fate states */
--fate-stored:    #B98A2F;
--fate-scrapped:  #9A3B3B;
--fate-preserved: #4C6FB3;
--fate-unknown:   #8B8F99;
/* livery colors arrive from data, never from this file */
```

Dark mode: **not in v1.** The archive is paper. (Ghost pages are the exception — §8.)

### 3.2 Type

| Role | Face | Usage |
|---|---|---|
| Display | **Newsreader** (variable, optical sizing on) | Page titles, obituaries, big numbers. Serif with a newspaper-memorial register. Weight 400–500 only; never bold-shouty. |
| Text | **Inter** (variable) | Everything readable. 400/500/600. |
| Registry | **IBM Plex Mono** | MSNs, registrations, dates, coordinates — every value that comes from a register is set in mono. Structure encodes provenance: if it's mono, it's data; if it's serif, it's story. |

Scale (px, desktop / mobile): display-xl 72/44 · display 48/32 · h2 30/24 · h3 21/18 ·
body 17/16 · small 14 · micro 12 (letter-spaced +0.06em, uppercase — eyebrows only).
Line-height: display 1.05, body 1.6. Max text measure: 68ch.

### 3.3 Space, radius, elevation

- 4px base grid; section rhythm 96/64/40 (desktop) — Dreelio's calm comes from big,
  consistent vertical intervals; keep them religious.
- Radius: 10px cards, 6px chips, 2px on the dataplate (machined, not friendly).
- Shadows: almost none. `--shadow-plate: 0 1px 2px rgb(22 24 29 / .06)`. Depth comes
  from hairlines and paper tones, not blur.
- Container: 1200px max, 24px gutters mobile; 12-col grid desktop.

## 4. Page anatomy (shared)

- **Nav**: sticky, paper with a hairline bottom edge and slight blur on scroll;
  left: wordmark PROVENANCE in Newsreader; right: airlines · aircraft · survivors ·
  obituaries · ghosts. No CTA button — this is an archive, not a funnel.
- **Eyebrows**: micro type, lowercase, `--ink-3`, always paired with a hairline —
  `airline · ceased 2012`, `airframe · msn 3990`. Eyebrows state facts, never vibes.
- **Footer**: sources for this page, "part of the PROVENANCE register," last data
  snapshot date in mono. Every page is honest about where it came from.

## 5. Home page

Hero is a thesis, not a pitch. Full-width, paper, one Newsreader display-xl line:

> **Aircraft outlive their airlines.**

Beneath it, small: "PROVENANCE is a register of their lives." Then — the hero's living
element — a single real lifeline (a Kingfisher A320's) rendered large, slowly
auto-scrubbing once on load, ending on its fate chip. Below: the featured diaspora
(Kingfisher card), three recent obituaries, and a mono strip of register stats
("2,147 airframes · 5 diasporas · 61 survivors older than 1970") that count up on
first scroll into view. No testimonials, no logo marquee, no pricing — the Dreelio
*rhythm* without its furniture.

## 6. The Dataplate (biography header) — secondary signature

Every aircraft carries a riveted metal dataplate; ours opens every biography. A
`--paper-raised` plate, 2px radius, hairline border, subtle plate shadow, contents laid
out like the real thing: manufacturer wordmark-small, then in engraved-feel Plex Mono:
`MSN 3990 · A320-232 · 2009`, and a fate chip (semantic color + label: FLYING / STORED /
SCRAPPED / PRESERVED / LOST). Micro-interaction: on hover, a specular sheen sweeps the
plate once (600ms, masked gradient) — the only "shiny" effect in the entire product.
Reduced-motion: no sheen.

## 7. The Lifeline — THE signature component

One horizontal strip, full container width, ~120px tall, that is the airframe's life:

```
1946 ─┬────────────────┬──────┬───────────────────┬──── 2026
      │  era: TWA      │ gap  │  era: cargo op    │ ✕ scrapped
      █████████████████░░░░░░░█████████████████████ ▍
      ▲ ticks: identity changes (reg swaps)        ▲ fate terminal
```

Spec:
- Era segments filled with the operator's livery `primary`; storage gaps in
  `--paper-sunken` diagonal hatch; the strip terminates in a **fate terminal**: a small
  engraved symbol (✈ active arrowhead continuing off-edge · ⏸ stored · ✕ scrapped ·
  ◆ preserved) in its semantic color.
- Identity changes are 1px `--ink` ticks with the registration in mono above on hover.
- **Scrub interaction**: pointer anywhere on the strip moves a hairline playhead; a
  floating mono caption updates live: `1987 · N741PA · Pan Am · passenger`. Drag inertia
  none — it's an instrument, not a toy. Keyboard: ←/→ steps era boundaries, Home/End.
- Page-load orchestration (the one big motion moment per biography): the strip draws
  left→right over 900ms (`cubic-bezier(.22,.8,.26,.99)`), era colors fading in as the
  playhead passes, fate terminal snapping in last with a 60ms settle. Then the page is
  still. Reduced-motion: render complete, no draw-on.
- Implementation: SVG, server-rendered static frame, hydrated scrub; exposed as
  `<Lifeline data={eras} …/>` from `components/lifeline` with zero page-specific logic.
- SR narration: an ordered list mirroring the eras, visually hidden.

The lifeline also renders at small scale (240×36, no interaction) as the visual on every
aircraft card anywhere in the product — the product's identicon.

## 8. Diaspora pages

- Header: eyebrow `airline · 2003–2012`, display title, the 120–180 word obituary set in
  Newsreader at h3 size (this is where the serif earns its place), livery `primary`
  applied to: the title's terminal period, the header hairline, and era segments below.
  Restraint: livery never floods backgrounds.
- **Fate strip**: a single stacked bar of the whole fleet by fate, mono legend
  (`14 flying · 6 stored · 7 scrapped`). Sits directly under the obituary; it is the
  page's statistical thesis.
- **The dispersal**: the interactive centerpiece. Desktop: a two-pane layout — left, the
  fleet list (rows: mini-lifeline, type, `VT-KFQ → 9H-AMM` in mono with an arrow, fate
  chip); right, a quiet paper-toned world map (MapLibre, custom near-monochrome style)
  where hovering a row draws a single livery-colored arc from the airline's home base to
  the airframe's current/final location, with previous arcs ghosting to 12% opacity —
  browse the list for ten seconds and the map accumulates the scatter of a dead fleet.
  Mobile: list first; map as a collapsed "see the dispersal" panel.
- Sort/filter chips: by fate, by type, by destination country. Chips are sunken-paper
  pills, mono labels.

## 9. Graph, survivors, obituaries (Phase 3 direction)

- **Lineage graph**: ink nodes on paper, hairline edges; selected node's eras bloom in
  livery color; everything else stays monochrome. Force layout damped hard — an archive
  diagram, not a physics demo. Canvas, with an SVG overlay for labels.
- **Survivors**: a census table done perfectly — sticky year column, mono values,
  age rendered as `78y` next to a tiny full-life lifeline. A single slider: "older
  than [year]". Top of page: the count in display type: **"61 aircraft flying today are
  older than 1970."**
- **Obituary cards**: small plates — mini-lifeline, name line
  (`Boeing 747-438 · MSN 25067`), one serif sentence ("Flew for Qantas for 27 years;
  broken up at Victorville, June 2026."), date in mono. The feed reads like a memorial
  column. RSS gets the same sentence.
- Loading states are designed, not defaulted: skeletons are hairline boxes with a slow
  paper shimmer; the graph and ghosts show an eyebrow caption ("assembling the
  register…") — never a spinner.

## 10. Ghosts (Phase 4 direction — the sanctioned exception)

Ghost pages invert the system: `--ink` becomes the ground (night sky #101216), paper
becomes the line color. Routes draw as thin paper-white arcs; the era's airline livery
colors the moving aircraft dots. Time controls are an instrument strip along the bottom:
mono date, play/pause, 1×/24×/240×, a scrubber styled exactly like the lifeline (the
same component grammar — users already know how to hold it). A permanent caption:
"Reconstruction from published schedules." Entering a ghost from a paper page gets a
600ms cross-fade through black — stepping into the past should feel like a lights-off
moment. Reduced-motion: cut, no fade.

## 11. Motion system (complete list — nothing else animates)

| Moment | Spec |
|---|---|
| Lifeline draw-on | 900ms, `cubic-bezier(.22,.8,.26,.99)`, once per page load |
| Dataplate sheen | 600ms sweep on hover, once per hover intent (150ms delay) |
| Dispersal arc | 350ms draw per arc; ghost trails to 12% over 250ms |
| Count-up stats | 800ms, starts at 40% viewport entry, once |
| Hover on rows/cards | background to `--paper-sunken` 120ms; translate ≤1px; no scale |
| Page transitions | none, except the ghost cross-fade |
| Scroll effects | none. No parallax, no scroll-jacking, ever. |

`prefers-reduced-motion` collapses all of the above to instant states. This table is a
contract: an animation not listed here is a bug.

## 12. Copy voice

Registry facts in registry language; endings in human language. Mono values never carry
adjectives; serif sentences never carry hedges. Say "we don't know" plainly:
`fate: unknown · last confirmed 2014, Lagos` beats an invented ending. Sentence case
everywhere except eyebrows and fate chips. No exclamation marks anywhere in the product.
All narrative copy (obituaries, ghost intros) is written by you and passed through the
humanizer skill before shipping — generated-sounding prose on a memorial page is fatal
to the whole premise.

## 13. Quality floor (unannounced, non-negotiable)

Responsive to 360px · visible keyboard focus (2px `--ink` offset ring) · all viz
keyboard-operable with SR equivalents · contrast AA everywhere including livery-on-paper
(auto-derived ink-safe variants) · OG share card for every page, generated from the same
tokens (paper card, lifeline, mono caption) so shared links look like the product.
