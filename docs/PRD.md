# PRD — PROVENANCE

Version 1.0 · Owner: Atmadeep Dey · Status: Approved for Phase 0

---

## 1. One-line definition

A beautifully generated encyclopedia of aircraft lives, keyed on the airframe (MSN),
rendered as four connected views: diaspora pages, biographies, a lineage graph, and
ghost-flight playback.

## 2. The problem

Aviation data exists in abundance — registries, spotters' databases, tracking sites — but
it is all organized around *flights* or *registrations*, presented in database-grade UI,
and split across a dozen sites with no narrative connecting them. The object with the
actual story — the physical airframe, which keeps its manufacturer serial number through
every repaint, sale, and conversion — has no home on the web. There is no page you can
send someone that answers "what happened to Kingfisher's planes?" in a form that makes
them feel something.

## 3. The bet

People share stories, not databases. If airframe data is assembled into *lives* —
with names, eras, fates, and endings — the aviation community (large, obsessive,
underserved by good design) will browse it for hours and share it constantly. The design
quality IS the product differentiation: the data is public; the assembly and the
presentation are the moat.

## 4. Users

- **P0 — Aviation enthusiasts / avgeeks.** Spotters, sim pilots, r/aviation,
  #avgeek Twitter. They already memorize registrations. They are the sharing engine.
- **P1 — Curious civilians.** Arrive via a shared link ("the plane you flew to Goa in
  2011 is now a firefighting tanker in Spain"). Must be able to understand every page
  with zero aviation knowledge.
- **P2 — Journalists and researchers.** Use it as a citable reference for fleet
  histories. Arrive via search. (Longer term; shapes SEO decisions, not v1 features.)

## 5. The core entity

**Airframe, keyed by MSN (manufacturer serial number) + manufacturer.** Registrations
(VT-ABC, N123AA) are *identities the airframe wears*, not the airframe itself. Every
feature in this product is a projection of the airframe entity:

```
AIRFRAME (MSN)
 ├─ identities[]      (registrations over time)
 ├─ operator eras[]   (who flew it, when, in what livery)
 ├─ conversions[]     (pax → freighter, VIP, tanker…)
 ├─ fate              (active | stored | scrapped | preserved | written off)
 └─ edges[]           (fleet-mates, dispersal targets, successors)
```

This decision is load-bearing. If any feature proposal cannot be expressed as a view over
this entity, it is out of scope (see §9).

## 6. Features by lens

### 6.1 Diaspora pages (Phase 0–1) — the wedge
One page per dead airline. Content:
- Airline header: name, lifespan (founded → ceased), one-paragraph obituary, livery-derived
  accent color used throughout the page.
- **The dispersal**: every airframe the airline operated, as an interactive grid/list.
  Each card: type, MSN, the registration it wore *then*, and — the emotional payload —
  **where it is now**: current operator + registration, or "scrapped, Roswell, 2019,"
  or "stored, Alice Springs, since 2020."
- Fate summary strip: e.g. "of 27 airframes: 14 still flying · 6 stored · 7 scrapped."
- A dispersal visualization: the fleet fanning out from the airline's collapse to
  destinations (design.md §7 defines this).
- Launch set (Phase 1): Kingfisher Airlines, Jet Airways, Air Deccan, Pan Am, Ansett.
  (Phase 0 is Kingfisher only.)

### 6.2 Biography pages (Phase 2) — the long tail
One generated page per airframe (start: US registry ≈ 280k aircraft; curated subset
first — see phases.md). Content:
- The dataplate header (design.md §6): MSN, type, first flight/manufacture year, status.
- **The lifeline**: a horizontal, scrubbable strip of the airframe's life — operator eras
  as colored segments, identity changes as ticks, conversion events as markers, ending in
  its fate. This is the signature UI element of the whole product.
- Identity history table: every registration, with country flags and dates where known.
- Fate block: where it is / how it ended, stated plainly.
- Cross-links: fleet-mates ("flew alongside…"), diaspora page of any dead operator,
  same-type siblings.
- Honest data provenance footer: which sources, which fields are unknown. We never fake
  completeness.

### 6.3 Lineage graph (Phase 3)
An explorable graph: airframes as nodes, edges for shared operator eras and dispersal
("when X collapsed, this airframe went to Y"). Entry points from any biography or
diaspora page. Plus two derived editorial views:
- **Survivors**: a census of the oldest airframes still flying, filterable by year —
  "every aircraft still in service older than you."
- **The obituary feed**: a reverse-chron feed of recently scrapped/retired airframes,
  each a small elegy card. This becomes the site's heartbeat and its RSS/newsletter.

### 6.4 Ghost flights (Phase 4)
Playback of skies that no longer exist, on a dark MapLibre globe/map with deck.gl arcs:
- Curated "ghosts" v1: Pan Am's network circa 1971 (from published timetables),
  Concorde's scheduled services in its final decade, and one India ghost
  (Kingfisher's network at its 2011 peak).
- Time controls: play/pause, speed, date scrub. Aircraft move along great-circle
  interpolations of scheduled city pairs. Clearly labeled as schedule reconstructions,
  not tracked positions.
- Each ghost aircraft links to its biography if we have it.

### 6.5 Explicitly deferred (recorded so they stop tempting us)
- **Delay forensics** ("why is this flight always late") — different data acquisition,
  different audience, real product on its own. Revisit only after Phase 5 ships.
- **ACARS/CPDLC decoding** — requires receivers/feeds; phase-6+ layer on top of
  biographies, never a v1 dependency.
- User accounts, comments, contributions, corrections form (a mailto is enough for a year).
- Mobile app. Native anything.

## 7. Success metrics

- **Phase 0 gate (the only metric that matters first):** you, personally, want to build
  page two. Binary.
- Phase 1: one post of the Kingfisher page to r/aviation + X. Success = any organic
  resharing at all (>50 upvotes or equivalent). This validates the format publicly.
- Phase 2–3: 1,000 organic weekly visitors from long-tail search within 8 weeks of the
  biography corpus indexing; median session > 2 pages (cross-linking works).
- Phase 4: one ghost gets picked up by an aviation account/newsletter without outreach.
- Anti-metric: time spent on ingestion tooling before a page exists. Target: zero.

## 8. Monetization (later, and honestly)

Not a Phase 0–3 concern. The realistic sequence once traffic exists: (1) prints of
lifelines and dispersal maps; (2) a small sponsor slot on the obituary feed/newsletter;
(3) the cleaned, joined dataset as a paid API — the assembly is the sellable asset.
No ads plastered on pages; it would poison the design premise. Nothing in the
architecture may depend on future revenue.

## 9. Non-goals (hard)

- Not a flight tracker. We do not compete with live-position sites, ever.
- Not a photo site. We may link photos with attribution later; we do not host scraped
  images (see rules.md §Licensing).
- Not a wiki. No user editing in v1–v3.
- Not global-complete. Honest partial coverage beats fake completeness. Every page states
  its sources and gaps.

## 10. Risks and mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Founder loses interest (base rate: 4 prior projects) | **Critical** | Phase 0 = 2 days, hard kill criteria per phase (phases.md); pipeline forbidden before pages exist |
| Ownership-chain data is fragmentary outside the US | High | Wedge on hand-verified diaspora pages; biographies launch US-first where FAA data is public domain; every page shows provenance and gaps |
| Licensing mistakes (scraping spotters' DBs) | High | rules.md licensing table is binding; only public-domain/CC0/permitted-API sources ship |
| Design ambition slows shipping | Medium | Design system fully specified up front (design.md); agent builds within tokens, no redesign loops mid-phase |
| SSG at 280k pages strains free hosting | Medium | Curated subset first; ISR/on-demand rendering path defined in architecture.md §8 |
| OpenSky/tracking terms limit commercial use | Medium | Ghosts v1 use published timetables (facts, not tracked data); tracking data only for lab features, terms reviewed at Phase 4 |

## 11. Naming

**PROVENANCE** — the documented history of an object's ownership. Fits the product
exactly and sits naturally beside PALIMPSEST and AIRLEDGER. Domain hunting is a
Phase 1 task, not a Phase 0 task (rules.md forbids yak-shaving on domains before the
first page exists). Working URLs: provenance.vercel.app until then.
