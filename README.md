# Local-First SaaS Boilerplate — Modern UI/UX, Netlify Frontend, Local Backend & Inference

**Purpose:** a polished, production-minded SaaS starter that deploys the **frontend** (static + edge) for free on Netlify while the **backend, database, authentication, and inference** run **locally** on your machine (developer-first). The repo gives you a visually modern, accessible UI and the wiring to add payments (Stripe / PayPal) and local LLM inference, with clear developer workflows.

---

## High-level architecture (what you'll get)

- **Frontend:** Next.js (App Router) + TypeScript, Vite-style dev speed, server-side rendering where helpful; styled with **Tailwind CSS** and component system from **shadcn/ui** (Radix primitives) for accessible, modern UI/UX and rapid composition.  [oai_citation:1‡Shadcn UI](https://ui.shadcn.com/?utm_source=chatgpt.com)  
- **Local backend (production-mode optional):** **PocketBase** — single binary providing SQLite-based DB, user auth, file storage, and realtime websockets, perfect for local-first apps. Runs on your machine; no remote DB required.  [oai_citation:2‡pocketbase.io](https://pocketbase.io/?utm_source=chatgpt.com)  
- **Payments:** Stripe integration examples included (Checkout + server-signed session flow). For purely local development you can use tunneling (ngrok) for webhooks, or use client-only PayPal buttons as an easier alternative. (Docs and dev scripts included).  [oai_citation:3‡Latenode](https://latenode.com/integrations/stripe/netlify?utm_source=chatgpt.com)  
- **API layer:** direct calls to PocketBase REST + realtime for most features. Optional tRPC proxy example included to provide end-to-end TypeScript safety if you later add a custom Node server.  [oai_citation:4‡Medium](https://medium.com/%40sergey.prusov/graphql-vs-rest-vs-trpc-api-design-patterns-that-dont-overcomplicate-everything-b58b59fdb8b9?utm_source=chatgpt.com)  
- **Local inference:** example integration with local LLM servers (Ollama, Llama.cpp, or any HTTP-based local LLM endpoint). The repo provides a pluggable wrapper so you can swap in your chosen local inference binary or container.  
- **Database migration / local persistence:** PocketBase (SQLite) by default — optional Prisma/Drizzle examples if you want additional typed ORM layers for other local databases.  
- **Auth flows:** sign up / sign in / email verification / password reset out of the box via PocketBase. Examples show how to swap in Clerk, Supabase, or NextAuth if you prefer hosted or hybrid auth later.  [oai_citation:5‡DevTools Academy](https://www.devtoolsacademy.com/blog/supabase-vs-clerk/?utm_source=chatgpt.com)
- **Design system & components:** shadcn/ui + Radix primitives + Tailwind tokens; a ready-made, beautiful dashboard and marketing pages (auth screens, pricing, onboarding, subscription management, billing page, account settings, webhook logs, LLM jobs view, file uploads).  [oai_citation:6‡Shadcn UI](https://ui.shadcn.com/?utm_source=chatgpt.com)

---

## Why this stack? (short rationale)

- **Local-first:** PocketBase gives a single-file backend including auth, DB, files, and realtime — fastest route to a local backend you can distribute and run offline. Great for prototyping and local inference.  [oai_citation:7‡pocketbase.io](https://pocketbase.io/?utm_source=chatgpt.com)  
- **Frontend design & DX:** shadcn/ui + Tailwind provides modern, accessible UI foundations while letting you fully customize visuals. The Next.js ecosystem remains dominant for SaaS-style apps, and it pairs well with Netlify static/edge deployment.  [oai_citation:8‡Shadcn UI](https://ui.shadcn.com/?utm_source=chatgpt.com)  
- **Type-safe APIs:** if you add custom server logic, tRPC keeps type-safety without GraphQL complexity. Use it for internal procedures that interface with local services.  [oai_citation:9‡Medium](https://medium.com/%40sergey.prusov/graphql-vs-rest-vs-trpc-api-design-patterns-that-dont-overcomplicate-everything-b58b59fdb8b9?utm_source=chatgpt.com)

---

## Repo contents

/
├─ README.md
├─ masterprompt.md
├─ frontend/                # Next.js app (TypeScript)
│  ├─ app/
│  ├─ components/           # shadcn UI & Radix-based components
│  ├─ styles/
│  ├─ lib/pocketbase.ts     # client wrapper
│  └─ lib/llm.ts            # inference wrapper (local)
├─ pocketbase/              # pocketbase config & scripts
│  ├─ pb_data/              # SQLite & files (gitignored)
│  └─ pocketbase.exe / pocketbase (download script)
├─ infra/
│  ├─ ngrok/                # scripts to setup ngrok (local webhooks)
│  └─ docker/               # optional docker-compose (for LLM infra)
├─ examples/
│  ├─ stripe/               # example server code for signed Checkout sessions
│  └─ paypal/               # client-only PayPal buttons example
└─ scripts/
├─ start-local.sh        # boots pocketbase, local-llm, frontend
└─ init-dev.sh           # one-shot project init

---

## Quick start (local dev)

> Prereqs: Node 18+, pnpm (or npm/yarn), PocketBase binary (script downloads it), ngrok (optional, for Stripe webhooks), a Stripe test account if you want to exercise payments, and a local LLM binary or docker image if you plan to run inference.

1. Clone:
```bash
git clone <repo-url>
cd repo

	2.	Install frontend deps:

cd frontend
pnpm install
cp .env.example .env.local
# set POCKETBASE_URL=http://localhost:8090 in .env.local

	3.	Download PocketBase (one-command included):

./scripts/init-dev.sh
# -> downloads pocketbase to ./pocketbase/pocketbase and creates pb_data

	4.	Start everything locally:

./scripts/start-local.sh
# boots pocketbase, local-llm (if configured), and starts Next dev server
# frontend default at http://localhost:3000, PB at http://localhost:8090

	5.	Admin UI: PocketBase admin runs at http://localhost:8090/_/ — create a user, collections, configure email or use dev-mode email.  ￼
	6.	Payments (Stripe example):

	•	For test mode, run ngrok and expose your local ./examples/stripe/webhook endpoint. The README includes step-by-step instructions to register the webhook secret and test Checkout flows. If you prefer no tunneling, use the PayPal client-only example included.  ￼

⸻

Design & UX notes (what you’ll get out of the box)
	•	Pixel-perfect dashboard layout (responsive grid, charts placeholder, activity feed).
	•	Accessible modals, dropdowns, tooltips, and form elements using Radix and shadcn conventions.  ￼
	•	Theme switching (light/dark + accent color tokens).
	•	Onboarding flow with trial & subscription screens.
	•	Billing page that shows Stripe subscriptions, invoices, and simple cancellation flow.
	•	LLM Jobs page — queue jobs to your local LLM, show status, output, and allow re-run.

⸻

Extensibility & Advanced topics
	•	If you want to move from PocketBase to a hosted DB (Postgres/Neon) for production, the repo includes a migration guide and Prisma templates for seed + schema mapping. (PocketBase is great for local dev but production migration steps are provided.)  ￼
	•	Add tRPC server example if you want backend business logic with end-to-end types.  ￼
	•	Swap auth: examples included for Clerk, Supabase Auth, NextAuth.js (guides and small adapter layer).  ￼

⸻

Security & privacy (local-first considerations)
	•	Sensitive keys (Stripe secret, ngrok token) are never committed. Use .env and local secrets only.
	•	If you expose your machine for webhooks (ngrok), restrict origins and rotate test keys frequently.
	•	PocketBase runs local file storage by default — treat pb_data as sensitive and keep it out of source control.

⸻

What this repo intentionally does not do
	•	Does not provide a fully-managed multi-tenant SaaS production backend. It’s local-first and developer-focused — production hardened multi-tenant deployments are out-of-scope but migration guides are included.
	•	Does not host your inference model for you. It shows how to wire your local LLM and provides pluggable adapters for popular local LLM runtimes.

⸻

Roadmap (higher-level features you can enable quickly)
	•	Multi-tenant account plan support (organization/team model)
	•	Admin usage analytics (mixpanel/segment placeholders)
	•	Hosted mode (move PB -> Postgres + hosted auth)
	•	CI/CD templates for Netlify + GitHub Actions (Netlify deploy for frontend is ready)

⸻

References & ecosystem notes
	•	shadcn/ui — component library built on Radix and Tailwind, a great foundation for modern design systems.  ￼
	•	PocketBase — single-file open-source backend for local-first apps.  ￼
	•	tRPC — excellent for type-safe internal APIs when you control both client and server.  ￼
	•	Stripe + Netlify integration approaches & webhooks (dev tunneling recommended for local dev).  ￼

⸻

Next steps (how I suggest you use this)
	1.	Run local dev, explore PocketBase admin, and play with auth.
	2.	Replace sample marketing text and brand tokens to match your product.
	3.	Configure Stripe test keys and run a test Checkout flow using ngrok.
	4.	Plug your local LLM binary and run an example job from the UI.
	5.	Iterate UI using shadcn component pieces — everything is customizable.

⸻

Contributing

This repo is meant to be a highly opinionated starter. You’re welcome to fork and extend.

⸻

License

MIT

---
