# EUDIA Hackathon — Frontend

A modern web frontend for the EUDIA Hackathon project. This application implements the user-facing experience (pages, components, and flows) and communicates with the backend APIs to deliver the core features of the hackathon solution.

![Product demo](./ProBono-launch.gif)

---

## What this project does

- Delivers the UI for the hackathon solution, including navigation, forms, and rich interactive views.
- Integrates with a backend service to fetch, create, and update data via HTTP APIs.
- Implements resilient UX patterns (loading, empty, and error states).
- Provides a local developer experience with hot reloading for rapid iteration.
- Builds to an optimized, production-ready static bundle suitable for modern hosting platforms.

---

## Features

- Responsive layout and accessible components
- Client-side routing for fast page transitions
- Form handling and validation
- API abstraction for clean data access
- Environment-based configuration for easy deploys
- Production build with asset optimization and cache-friendly outputs

---

## Tech stack

This is the frontend application within this repository.

- Language: JavaScript/TypeScript (typical for modern frontends)
- Build tooling and framework: depends on the implementation in `frontend/` (e.g., Vite, Next.js, CRA, etc.)
- Package manager: npm, pnpm, or yarn (use whichever is configured locally)
- Linting/formatting/testing: if configured, run via package scripts

---

## Repository structure

```
.
├─ .gitignore
├─ LICENSE
├─ ProBono-launch.gif
├─ README.md        # This file
└─ frontend/        # Application source
```

- `frontend/` contains the actual frontend app source code, configuration, and scripts.
- Root-level assets (like the demo GIF) are referenced from the README and can be used in documentation or marketing.

---

## Getting started

### Prerequisites

- Node.js 18+ (recommended) and a package manager:
  - npm ≥ 9 (built-in), or
  - pnpm ≥ 8, or
  - yarn ≥ 1.22 / 4+
- A running backend API (local or remote), if required by the app

### 1) Install dependencies

From the repository root:

```bash
cd frontend
# choose one:
npm install
# pnpm install
# yarn install
```

### 2) Configure environment

Create an environment file in `frontend/` (for example, `.env.local`) and set any required variables.

Common patterns (adjust to your framework):
```
# If using Vite:
VITE_API_BASE_URL=https://your-api.example.com

# If using Next.js:
NEXT_PUBLIC_API_BASE_URL=https://your-api.example.com
```

### 3) Run the app in development

```bash
cd frontend
npm run dev
# or: pnpm dev
# or: yarn dev
```

The dev server URL will appear in the terminal (commonly http://localhost:3000 or http://localhost:5173).

### 4) Build for production

```bash
cd frontend
npm run build
```

Optional local preview (if supported):

```bash
npm run preview
```

---

## Available scripts

Open `frontend/package.json` to see the exact script names. Typical scripts include:

- `dev` — start the development server with HMR
- `build` — produce an optimized production build
- `preview` — locally preview the production build
- `lint` — run static analysis
- `format` — format codebase (e.g., Prettier)
- `test` — run unit/integration tests

---

## API and data

- All network requests are encapsulated in a small data-access layer to keep UI components simple and testable.
- Errors are surfaced with user-friendly messaging and sensible retries (if configured).

---

## Project decisions and conventions

- Component-first development with reusable UI primitives
- Co-located tests and styles with components (if configured)
- Environment isolation (development vs. production)
- Conventional commits or similar (optional but recommended)
  
---

## Deployment

- Output is a static build suitable for hosting on services like Vercel, Netlify, GitHub Pages, Cloudflare Pages, or a custom CDN.
- Configure environment variables in your hosting platform to match `.env` settings.

---

## Screenshots and demo

- See the launch/demonstration GIF above.
- Add more screenshots for key flows and pages.

---

## License

This project includes a `LICENSE` file in the repository root.  
If the file is currently empty or a placeholder, choose and apply a license (MIT, Apache-2.0, GPL-3.0, etc.).

---

## Acknowledgements

- Built for the EUDIA Hackathon
- Thanks to all contributors, mentors, and organizers

---
