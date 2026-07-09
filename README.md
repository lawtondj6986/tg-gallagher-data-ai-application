# TG Gallagher — Data & AI Platform · Candidate Briefing

A **website résumé and working prototype** built to win the **Head of Data Architecture & AI** role at **TG Gallagher** (Waltham, MA — New England's premier mechanical contractor, founded 1940).

Instead of a résumé, it's a live demonstration: a TG Gallagher–branded pitch **plus** a working **Command Center** — executive KPIs, live charts, an AI project copilot, a ⌘K command palette, data-source connectors, and a governance/admin panel.

> A construction-aware data leader who has already built and shipped modern data platforms and AI products — not just theorized about them.

---

## What's here

| File | What it is |
|---|---|
| `index.html` | The site — marketing pitch + command center (single page app) |
| `assets/styles.css` | Full design system (light corporate + dark command center) |
| `assets/app.js` | View switching, SVG charts, command palette, AI copilot, all panels |
| `assets/data.js` | Illustrative enterprise data + **candidate contact (edit here)** |
| `api/copilot.js` | Optional live Claude endpoint (Vercel serverless) — site works without it |
| `vercel.json` | Static + serverless deploy config |
| `TG-Gallagher-Head-of-Data-Architecture-AI-Package.md` | The full written strategy package (positioning, resume bullets, cover letter, 30-60-90, interview prep, capstone, roadmap) |

## Features (all working)

- **Marketing pitch** — hero, value prop, an **interactive medallion architecture blueprint** (click any layer), AI use cases, 12–18 month roadmap, candidate profile.
- **Command Center** (dark) — Executive Overview (animated KPIs + charts), Projects (sortable/filterable portfolio), Job Cost & WIP (cost-code variance, labor productivity), Data Sources (connector inventory), Governance (RLS/policy toggles), Control Panel (warehouse/AI/team).
- **AI Project Copilot** — grounded Q&A over the portfolio ("what's at risk?", "explain the architecture"). Simulated by default; **real Claude when deployed with an API key**.
- **⌘K command palette** — navigate and run actions ("flag at-risk projects", "generate WIP report").
- Fully responsive; zero dependencies; no build step.

## Run it locally

Just open `index.html` in a browser — or serve the folder:

```bash
python3 -m http.server 8080   # then visit http://localhost:8080
```

## Deploy (Vercel)

1. Import this repo in Vercel (framework preset: **Other / static**).
2. *(Optional, for real AI)* add env vars: `ANTHROPIC_API_KEY` and optionally `ANTHROPIC_MODEL`.
3. Deploy. Without the key, the copilot uses the built-in grounded answers.

## Make it yours

- **Contact / name:** edit `CANDIDATE` at the top of `assets/data.js`.
- **Portfolio data:** all illustrative — edit `PROJECTS`, `KPIS`, `TRENDS`, etc. in `data.js`.
- **Copilot answers:** edit `COPILOT_KB` in `data.js` (simulated) or the system prompt in `api/copilot.js` (live).

---

*Company facts (founded 1940, HVAC/plumbing/fire protection, Waltham MA, healthcare/higher-ed/life-sciences focus) are public. All platform metrics and project data are illustrative and generated for demonstration only.*
