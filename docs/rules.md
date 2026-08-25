# rules.md — PROVENANCE

Version 1.0 · Load this file into every Antigravity session along with memory.md.
These rules bind the agent AND the human. When a rule blocks something desirable,
the move is to change the rule with a dated memory.md entry — never to silently ignore it.

---

## 1. Session protocol (agent)

1. Read `docs/memory.md` first, every session, before touching code.
2. State the phase you believe the project is in and the single task you're doing.
   If the task isn't in the current phase's list in phases.md, stop and say so.
3. End every session by appending to memory.md: what changed, decisions made,
   anything discovered (data quirks, source URLs, gotchas), next task.
4. Never claim something works without running it. "Should work" is banned vocabulary.

## 2. Scope discipline

- **No pipeline before pages.** Until Phase 2 begins, any work in `pipeline/` beyond
  curated YAML + a trivial YAML→JSON emit script is a violation.
- **No new abstractions for a second use that doesn't exist yet.** Copy-paste twice;
  abstract on the third occurrence.
- **No new dependencies** without a one-line justification logged in memory.md.
  The stack in architecture.md §2 is complete for Phases 0–2.
- **URLs are promises.** Once a slug is deployed, it never changes; only redirects.
- Feature ideas mid-phase go into memory.md § "Parking lot" — never into the sprint.
- The phase's kill criteria are read aloud (literally) at the start of each phase.

## 3. Design enforcement

- Every color, size, shadow, and animation must trace to a token or table in design.md.
  If it isn't there, it doesn't ship — propose the token first.
- Livery colors come from operator data only. No livery color appears outside its
  operator's context. No decorative gradients anywhere.
- The motion table (design.md §11) is exhaustive. New animation = new table row first.
- Every page ships with: OG card, mobile check at 360px, keyboard pass, reduced-motion
  pass. This is the definition of done for any page-level PR.
- Narrative copy (obituaries, ghost intros, home hero) is human-written and passed
  through the humanizer skill. The agent may draft; the human must rewrite.

## 4. Data & licensing (the rules that keep the project alive)

- **Allowed as bulk sources:** FAA Releasable Aircraft DB + deregistered file (public
  domain), OurAirports (public domain), Wikidata (CC0), Wikipedia facts with citation
  (CC-BY-SA for prose — so we cite, we don't copy prose).
- **Never scraped, never bulk-copied:** Planespotters, airfleets, rzjets, ASN, JetPhotos,
  FlightRadar24/FlightAware, or any spotters' database. Individual public facts may be
  hand-verified and cited like a journalist would; wholesale extraction is theft of the
  exact kind of assembly work we're doing ourselves.
- Historical timetables: transcribe facts (city pairs, times); never rehost scanned
  images without checking the archive's terms.
- Tracked-position data (OpenSky, ADS-B Exchange): terms reviewed and logged in
  memory.md **before** first use; assume non-commercial constraints until proven
  otherwise. Published-schedule reconstructions need none of this.
- Every airframe record carries `sources[]`. A fact without a source is `confidence:
  sketchy` at best and may not be upgraded without one.
- **Never invent data.** Unknown dates render as unknown. A fabricated fate on a
  memorial-toned site is a credibility-ending bug, not a typo.
- Raw source snapshots are immutable and dated. Reproducibility beats freshness.

## 5. Code conventions

- TypeScript strict; no `any` that isn't commented with why.
- Types for data entities are generated from the Pydantic schema — never hand-edited.
- Components: server by default; `"use client"` only where interaction demands it,
  and the interactive core isolated in the smallest possible leaf.
- The Lifeline component owns no page logic; pages own no lifeline logic.
- Python: uv-managed, ruff-formatted, every pipeline stage runnable standalone via
  `just`, every stage prints counts in/out (silent pipelines hide data loss).
- Commits: conventional (`feat:`, `fix:`, `data:`, `docs:`), small, deployable.
  `data:` commits state row counts ("data: kingfisher fleet 66 airframes, 41 verified").

## 6. Honesty rules (product-level)

- Coverage gaps are stated on-page, plainly, in the provenance footer.
- `confidence` renders visibly (a small mono marker on partial/sketchy records).
- Corrections: a `mailto:` link labeled "correct the register" on every biography.
  Incoming corrections get logged in memory.md and fixed within the monthly refresh.
- No dark patterns, no engagement mechanics, no "sign up to see the fate." The archive
  is open; that's the brand.

## 7. When the human drifts (agent, this one is for you)

If the human proposes work that violates phase order — "let's add the ACARS layer,"
"let's redesign the palette," "let's do the delay model real quick" — the agent's job is
to name the violation, point to the phases.md line, and offer the parking lot. The human
has explicitly authorized this pushback in advance, here, in writing. Four projects died
without it.
