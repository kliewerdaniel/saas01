# MASTER PROMPT — Generate the Local-First SaaS Boilerplate

You are CLIne (a code generation agent). Your task: generate a complete, runnable repository for a **local-first SaaS boilerplate** described below. Produce code, config files, scripts, documentation, and tests necessary to run the app locally and to deploy the frontend to Netlify for free. Keep a persistent checklist of tasks and mark them completed as you generate files. Prioritize a polished UI/UX, accessibility, and developer DX.

## Primary requirements (must be implemented exactly)

1. **Frontend**
   - Next.js (App Router) + TypeScript.
   - Tailwind CSS integrated.
   - Use **shadcn/ui** component approach (Radix primitives + atomic components). Build a minimal design system (tokens, theme switcher, accent color).
   - Provide pages/components:
     - Marketing: `/` (hero, features, pricing)
     - Auth: `/sign-in`, `/sign-up`, `/forgot-password`
     - Dashboard: `/dashboard` (metrics, list view)
     - Billing: `/billing` (Stripe subscription status)
     - LLM Jobs: `/llm` (submit job, view history, view job output)
     - Settings: `/account`
   - Implement form validation (Zod) and use React Hook Form.
   - Use fetch/axios wrapper `lib/pocketbase.ts` for PocketBase interactions.
   - Include a demo chart component (using Recharts or chart library) with placeholder data.
   - Include CSS variables for theming; dark mode toggle + persisted preference.

2. **Local Backend**
   - Integrate PocketBase:
     - Provide `pocketbase/` folder with a download script (`scripts/init-pb.sh` or `init-dev.sh`) and a `pb_data/` folder (gitignored) for sqlite and files.
     - Create sample collection schemas (users, subscriptions, llm_jobs, invoices) either by JSON export or provide a PocketBase setup script (curl to PB REST) that bootstraps sample collections on first run.
   - Provide `scripts/start-local.sh` that:
     - Starts PocketBase in the background (if not running)
     - Optionally starts a local LLM docker container (if user enabled)
     - Starts Next.js dev server
   - Add a small Node example in `examples/stripe/` showing how to create Stripe Checkout sessions and signing webhooks (for dev use), with README documenting ngrok flow for local dev.

3. **Payments**
   - Provide example Stripe integration:
     - Client flow to create Checkout session (calls `examples/stripe/create-checkout` server endpoint).
     - Webhook handler example and instructions for ngrok.
   - Provide alternative PayPal client-only example in `examples/paypal/`.

4. **Local inference**
   - `lib/llm.ts` wrapper implementing an interface:
     - `submitJob(prompt, metadata) -> jobId`
     - `getJob(jobId) -> {status, output, startedAt, finishedAt}`
   - Provide a mock LLM runner (node script) and a Docker-compose example to run a known local LLM (placeholder) or accept Ollama/local HTTP API.
   - Connect `LLM Jobs` UI to the wrapper so user can queue and view jobs.

5. **Auth**
   - Use PocketBase auth flows (email + password). UI flows for sign-up, email verification (simulate dev-mode verification), sign-in, forgot password.
   - Provide adapter files and instructions to swap PocketBase for Clerk/Supabase/NextAuth.

6. **Developer DX**
   - `README.md` (full) and `masterprompt.md` (this file) must be created at top level.
   - `.env.example` with required env vars (POCKETBASE_URL, STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, NGROK_TOKEN).
   - Husky pre-commit with lint-staged for formatting and types checks.
   - GitHub Actions workflow skeleton for running typecheck + lint + build.

7. **Design**
   - Use accessible components (aria attributes) and keyboard navigability.
   - Provide a small set of tokenized styles (spacing, colors, type scale).
   - Provide a landing page hero with SVG illustration and micro-interactions (hover, subtle motion via CSS).

8. **Netlify**
   - Add `netlify.toml` and build instructions to deploy frontend to Netlify (static build + rewrites as needed).
   - Document any environment differences between local and Netlify deployment. (Note: backend remains local; explain dev vs prod requirements.)

## Non-functional requirements

- **Type-safe** TypeScript; no implicit `any`.
- Clear, modular code with comments for important integration points.
- Small demo dataset seeded on first run.
- Minimal tests: at least smoke tests for `lib/pocketbase.ts`, `lib/llm.ts`, and one UI snapshot or react-testing-library test for the main dashboard component.
- Project must be runnable by following README steps.

## Checklist (persist and update — mark items 'DONE' when generated)
- [ ] repo scaffold (package.json, tsconfig, pnpm lock)
- [ ] frontend app basic pages (/, /dashboard, /auth)
- [ ] shadcn component primitives scaffold
- [ ] Tailwind config + tokens + dark mode
- [ ] pocketbase download script + pb_data gitignore
- [ ] pocketbase bootstrap collections script
- [ ] lib/pocketbase.ts wrapper
- [ ] lib/llm.ts wrapper + mock runner
- [ ] LLM Jobs UI + API wiring
- [ ] Stripe example server + client wiring
- [ ] PayPal client example
- [ ] ngrok helper scripts + docs
- [ ] start-local.sh and init-dev.sh
- [ ] README.md (complete)
- [ ] Tests + GitHub Actions skeleton
- [ ] netlify.toml + deploy notes
- [ ] Example environment file `.env.example`
- [ ] License & contributing guidelines

## How to generate files (instructions for CLIne)

- Generate files in this structure. For each file:
  - Ensure TypeScript types are defined.
  - Add comments in files where the user must add their own API keys or machine-specific settings.
  - Generate minimal but runnable code for all endpoints. If anything requires secrets (Stripe secret), wire a `TODO` and show an example `.env` value.
- For any external binary (pocketbase) include a small shell script that automatically downloads the correct binary for Linux/macOS/Windows (or points the user to the official PocketBase URL).
- Provide simple smoke-run instructions at end of generation (copy into README).

## Prioritization (if generation must be partial, do these first)
1. Repo scaffold, frontend basic pages, Tailwind, shadcn components.  
2. PocketBase download script + wrapper + basic auth flows.  
3. start-local script & README instructions to run locally.  
4. LLM wrapper + mock runner.  
5. Stripe example + ngrok docs.  
6. Tests & CI skeleton.  
7. Extras (Prisma templates, tRPC proxy).

## Output format and expectations

- I will create files directly into the repository, following the tree above.
- For every generated file, add a one-line summary comment at the top describing its purpose.
- When a step requires user credentials or an external binary to run (eg Stripe secret, ngrok), put a clear `### ACTION REQUIRED` comment at the top of the file and in README.
- After generating the initial commit, post a concise checklist of completed files and what remains (update the persistent checklist above).
- Provide example commands to run the dev environment and to deploy frontend to Netlify.

## Constraints / Caveats you must warn the user about in generated README

- PocketBase is excellent for local-first dev, but if you want production multi-tenant Postgres you must migrate; provide a small migration note.  [oai_citation:20‡GitHub](https://github.com/pocketbase/pocketbase/discussions/6540?utm_source=chatgpt.com)  
- Stripe webhooks require a public endpoint; local dev should use ngrok or similar — provide instructions and example env flow.  [oai_citation:21‡Latenode](https://latenode.com/integrations/stripe/netlify?utm_source=chatgpt.com)

## Final step for CLIne

When all files are generated, produce a short developer checklist to run:

1. `./scripts/init-dev.sh`  
2. `./scripts/start-local.sh`  
3. Visit `http://localhost:3000` and `http://localhost:8090/_/` (PB admin)

Then mark the master checklist items DONE accordingly.

---

# End master prompt

