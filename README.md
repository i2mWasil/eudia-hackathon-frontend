# ProBono

> Clarity and control over what you sign before and after you click “I agree.”

ProBono is a web platform that exposes the real “privacy cost” of digital services. It tackles two gambles users face today:

1. Before you sign up: You are forced to accept a dense, 30‑page policy you can’t realistically read or understand. You blindly trade personal data for functionality.
2. After you sign up: You receive vague “We updated our terms” emails. Hidden in those changes, a company may expand data sharing, tracking, or usage rights — silently eroding your privacy.

This opacity fuels digital distrust. ProBono reverses the imbalance by making privacy practices legible, comparable, and monitored.

Alongside the web app, a companion browser extension displays a concise, in‑page overview of the privacy policy for the site you are currently visiting—so you get context right where you need it.

![Product demo](./ProBono-launch.gif)

---

## Core Solution

ProBono consists of two tightly connected parts:

### 1. TrustScore Directory (Public)
A ratings-style directory that lets anyone look up a service before joining.

- TrustScore: An AI-generated score summarizing overall data respect and user empowerment.
- Color Bands: Green (Safe), Yellow (Caution), Red (High Risk) for instant perception.
- Plain-English Report Card:
  - Data Collection: Scope, depth, and sensitivity of data gathered.
  - Data Sharing: Sale, third-party sharing, cross-service profiling, advertising re-use.
  - User Control: Ease of deletion, export, consent withdrawal, and opt-outs.
  - Policy Stability (future): Frequency and magnitude of changes over time.

Users can quickly decide whether the value of a service outweighs its privacy cost.

### 2. Watchlist Dashboard (Private)
Your personal monitoring console once you are already a user.

- Track Services: Add platforms you currently use (social, productivity, media, utilities).
- Automated Policy Monitoring: System polls or ingests updated policy versions.
- Version Diffs: Highlights exactly what changed between EULA / Privacy Policy revisions.
- Historical Timeline (future): See evolution of a service’s stance on data collection and control.

This ensures you are never blindsided by post‑signup policy shifts.

---

## Transparency & Trust

ProBono creates:
- Transparency: Public, comparable privacy scores pressure companies toward better practices.
- Trust: Personal alerts transform obscure legal changes into actionable insights.

---

## Browser Extension (Current + Roadmap)

- Current:
  - Shows a concise overview of the current site’s privacy policy directly on the page you’re viewing.
- Roadmap:
  - Overlay TrustScore on signup / login pages.
  - Provide instant diff badges when revisiting a site whose policy changed.
  - Offer a “Sandbox” mode: Use a temporary, anonymous email or limited data profile for low‑trust trials.

---

## Technical Overview (Frontend)

This repository contains the frontend implementation of ProBono.

### Stack
- React 19 (function components, concurrent features ready)
- TypeScript (type safety across components and data flows)
- Vite 7 (fast dev server, optimized production builds)
- Tailwind CSS 4 + tailwind-merge (utility-first styling, conflict resolution)
- shadcn/ui + Radix UI primitives (accessible, themeable UI components)
- React Router DOM 7 (client-side routing)
- react-markdown + remark-gfm + rehype-raw (rendering AI summaries and policy excerpts)
- lucide-react (iconography)

### Directory Structure
```
frontend/
  index.html                 # Application HTML entry
  example.env                # Environment variable template
  package.json               # Scripts & dependencies
  vite.config.ts             # Vite build & dev configuration (alias, port)
  src/
    main.tsx                 # React bootstrap
    App.tsx                  # Global layout shell
    Routes.tsx               # Routing map
    components/              # Reusable UI building blocks
    pages/                   # Page-level screens (Directory, Watchlist, Detail, Diff)
    lib/                     # Utility & API access modules
    contexts/                # Global React Context providers (e.g., watchlist state)
    types/                   # Shared TypeScript interfaces & enums
    assets/                  # Logos, images, static media
    cache/                   # (Potential) local caching helpers
    index.css, App.css       # Tailwind layers & global overrides
```

### Build & Dev Scripts
From `frontend/package.json`:
- `dev` — Launch local development (port 3000 by default).
- `build` — Type-check (project references) then bundle production assets.
- `preview` — Serve the built `dist/` folder locally.
- `lint` — Run ESLint across the codebase.

### Path Aliasing
`@` resolves to `./src` (configured in `vite.config.ts`), simplifying imports like:
```ts
import { PolicyCard } from "@/components/PolicyCard"
```

### Environment Variables
Defined via `.env` (copied from `example.env`):
```
VITE_SERVER_URL=your-backend-api-url
GEMINI_API_KEY=your-gemini-api-key
```
Notes:
- Only variables prefixed with `VITE_` are exposed to client code.
- For security, sensitive AI keys (e.g., Gemini) are best proxied through the backend; direct exposure enables client-side misuse.
- Consider switching to `VITE_GEMINI_API_KEY` naming for consistency or removing from frontend if not strictly necessary.

### Data & State Flow (Conceptual)
1. Directory Query:
   - Frontend requests aggregated service metadata + scores from backend (`GET /services`).
2. Service Detail:
   - Retrieves structured AI analysis (sections: collection, sharing, control).
   - Markdown rendered with `react-markdown` (sanitization recommended server-side because `rehype-raw` allows HTML).
3. Watchlist:
   - Client-side or server-backed list of tracked services.
   - Sync operations: `POST /watchlist` / `GET /watchlist`.
4. Policy Change Detection (Backend responsibility):
   - Backend periodically fetches policies, produces diffs, recalculates TrustScore.
   - Frontend polls or receives pushed notifications (future: WebSocket / SSE).
5. Version Diff View (Planned/Existing):
   - Diff tokens (added / removed clauses) highlighted—frontend renders structured diff response.

### Component & Styling Approach
- Tailwind utilities for layout + spacing; custom component classes merged using tailwind-merge.
- shadcn/ui & Radix ensure accessible keyboard interactions (menus, tooltips).
- Global theming possible via CSS variables or Tailwind config.

### Routing Strategy
`Routes.tsx` centralizes definition:
- `/` — TrustScore Directory
- `/service/:id` — Service Detail
- `/watchlist` — User Watchlist Dashboard
- `/service/:id/diff/:versionA/:versionB` — Diff view (example pattern)
(Adjust to actual implemented routes.)

### Contexts
Potential contexts:
- WatchlistContext — Holds user’s tracked services and sync status.
- Theme/UIContext — Visual mode preferences.
- PolicyCacheContext — Memoizes fetched policy analyses to reduce redundant API calls.

### Security & Privacy Considerations
- Avoid embedding raw private keys in frontend.
- Sanitize or trust-markdown content: AI-generated or scraped text should pass through a backend sanitizer.
- Rate-limit backend endpoints that trigger expensive AI analysis.
- Provide clear disclaimers for approximate TrustScore methodology.

### Performance Considerations
- Code splitting (React Router + dynamic imports) for heavy pages (policy diff viewer).
- Memoization for large markdown render areas.
- Cache previously fetched service data in localStorage or in-memory context.

---

## Installation

```bash
git clone https://github.com/i2mWasil/eudia-hackathon-frontend.git
cd eudia-hackathon-frontend/frontend
npm install
cp example.env .env
# edit .env with actual backend URL
npm run dev
```
Visit http://localhost:3000

## Production Build

```bash
npm run build
npm run preview
```

Outputs optimized assets to `dist/`.

---

## Troubleshooting

Port Conflict:
- Change `server.port` in `vite.config.ts`.

Stale Dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

Env Variables Not Loading:
- `.env` in `frontend/`
- Restart dev server after changes
- Prefix browser-exposed variables with `VITE_`

---

## Roadmap (Selected Ideas)

| Feature | Status | Notes |
|---------|--------|-------|
| Policy Version Diff Viewer | Partial / Planned | Highlight semantic vs textual changes |
| Automated Change Alerts | Planned | Email/Web push/WebSocket feed |
| Browser Extension Enhancements | Planned | TrustScore overlays, in-context diff badges |
| Sandbox Identity | Concept | Temporary anonymized account trials |
| Historical Trend Graphs | Planned | Visualize TrustScore over time |

---

## Why the Name?

ProBono evokes “for the public good.” The platform’s mission is to rebalance power toward users by exposing opaque privacy practices and giving actionable control.

---

## Summary

ProBono transforms passive acceptance into informed choice:
- Before you join: Understand the privacy trade-offs.
- After you join: Stay ahead of silent policy shifts.

Simple scores. Clear explanations. Real oversight.

Empowering digital citizens—one policy at a time.
