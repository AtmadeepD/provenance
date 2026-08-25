# PROVENANCE

**A registry of lives. Every airframe has one.**

Aircraft outlive the airlines that order them. They get sold, leased, repainted, converted,
stored in deserts, and eventually cut apart — and nobody tells that story anywhere on the
internet in a form a human being wants to read. PROVENANCE is a generated encyclopedia of
airframe lives: one page per aircraft, one page per dead airline's scattered fleet, a
lineage graph connecting them, and a playback engine that lets you watch skies that no
longer exist.

## The four lenses (one product)

| Lens | What it shows | Ships in |
|---|---|---|
| **Diaspora** | A dead airline's fleet and where every airframe went | Phase 0–1 |
| **Biography** | One airframe's whole life: identities, operators, fate | Phase 2 |
| **Lineage** | The graph between airframes — shared fleets, dispersals | Phase 3 |
| **Ghosts** | Historical schedules replayed on a live map | Phase 4 |

## Doc pack

Read in this order. Every doc is written to be consumed by both you and the coding agent
(Antigravity). `rules.md` and `memory.md` should be loaded into every agent session.

1. `docs/PRD.md` — what we are building and, critically, what we are not
2. `docs/architecture.md` — stack, data model, pipeline, repo layout
3. `docs/design.md` — the full visual and interaction system
4. `docs/phases.md` — the build order, with exit and kill criteria per phase
5. `docs/rules.md` — non-negotiable working rules for the agent and for you
6. `docs/memory.md` — the living context file; update it every session

## The one rule that matters more than the rest

**Phase 0 is one hand-built page.** No pipeline, no database, no CMS, no admin panel.
If the Kingfisher diaspora page doesn't make you want to build the second page,
the project dies cleanly at a cost of two days. That is a feature of this plan, not a risk.

## Start here (today)

```bash
npx create-next-app@latest provenance --typescript --tailwind --app --src-dir
cd provenance
git init && git add -A && git commit -m "chore: scaffold"
```

Then open `docs/phases.md` → Phase 0 → Task list, and go top to bottom.
