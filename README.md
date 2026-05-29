# KINFORM — Digital Foundation

A clean, premium, fast-loading marketing website and digital lookbook for **KINFORM**, a new contemporary women's clothing line.

**Live features delivered in this MVP:**
- Beautiful editorial presentation of the three debut designs: **HALTER**, **FISHNET**, **ACADEMIC**
- Real product photography for the 12-piece statement earring accessories collection (ships immediately)
- Rich brand story + conversion-focused pre-order experience (zero-upfront launch)
- Fully functional **Tech Pack Generator** that produces professional, downloadable multi-page PDFs with measurements, construction notes, and custom options
- Working waitlist + request forms with Vercel Postgres logging
- Easy single-file content editing for the founder
- Elegant warm contemporary aesthetic (Reformation + modern quiet luxury) + premium client-side polish (framer-motion, dark mode, responsive)

---

## Quick Start (for the founder or developer)

```bash
# 1. Install dependencies (already done in this repo)
npm install

# 2. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The site is fully usable immediately (PDFs generate, forms show success states).

---

## Customization Guide (Non-Technical Founder)

### 1. Edit All Content in One Place
Open **`lib/designs.ts`**

This single file controls:
- All descriptions and copy on the site
- Every measurement in the tables
- Construction notes that appear in the PDFs
- Suggested fabrics and colorways

**Look for comments that say `// ← EDIT THIS` or `// ← CUSTOMIZE`**

Add a fourth design by copying one of the objects and updating the values + images.

### 2. Add Your Professional Flat Sketches (Current Designs)
The site expects images at these exact paths for the current collection:

```
public/images/
├── halter/
│   └── halter-flat.png
├── fishnet/
│   └── fishnet-flat.png
├── academic/
│   └── academic-flat.png
└── hero/
    └── og.jpg   ← recommended for Open Graph / social sharing (1200x630)
```

**Recommended specs:**
- High-resolution PNG or SVG (minimum 1600–2000px wide)
- Clean white or cream background preferred (matches the aesthetic)
- Technical drawing / flat sketch style

Until you add the real files, `FlatSketchImage` gracefully falls back to beautiful inline SVG technical drawings. Old `tether/clasp/aperture` folders are historical (empty post-rename).

**Note on recent earrings photography (completed):** 16 real product photos now live in `public/images/accessories/earrings/` (E1–E12 + .2 alternates). See `lib/earrings.ts` + `EarringPhoto.tsx` + the full accessories section. Large source PNGs (~2.5MB each) are optimized at runtime by Next.js (AVIF/WebP + responsive sizes). Consider compressing originals before future pushes.

### 2b. Real Earring Photography (Completed — High-Impact Launch Polish)
16 real product photos for the 12 earring designs (E1–E12 + .2 second angles) are integrated.

**Current state:**
- All files live in `public/images/accessories/earrings/` (18 files total, ~18MB raw).
- Fully wired: `lib/earrings.ts` (data + garment recs), `EarringPhoto.tsx` (blur-up, crossfade, interactive, fallback), grid + detail pages, `AccessoriesCrossSell` on HALTER/FISHNET/ACADEMIC, homepage teaser.
- Ships-immediately cash-flow companion to the zero-upfront garment pre-orders.

**Maintenance:**
- For future variants: add matching .png/.jpg and update `photo`/`photoSecondary` in `lib/earrings.ts`.
- Large PNG sources: Next.js serves optimized AVIF/WebP versions (see `next.config.ts`). Compress originals (Squoosh / ImageOptim) before git pushes to keep repo lean.

**Pro tips for even better results later:**
- For earrings that only have a .2 file right now (E10–E12), you can later add cleaner primary shots as `E10.png`, `E11.png`, `E12.png` and update the paths in `lib/earrings.ts`.
- The `EarringPhoto` component gracefully falls back to an elegant placeholder if a file is missing — no broken images.
- All earrings pages now deliver a true premium jewelry-browsing experience on desktop and mobile.

This was one of the highest-leverage remaining pieces for the zero-upfront launch.

### 3. Set Up Lead Logging (Vercel Postgres)
1. In Vercel, open your project → **Storage** → create/connect a Postgres database.
2. Ensure your project has the Postgres connection variables (`POSTGRES_URL`, etc.) in Environment Variables.
3. Redeploy (or restart local dev after pulling env vars with `vercel env pull`).

The app auto-creates two tables on first write:
- `waitlist_entries` for **Early Access List** submissions
- `inquiry_requests` for **Sample Request**, **Pre-Order**, **Wholesale**, and other request types

### 4. Changing Brand Name / Tagline
- The wordmark “KINFORM” appears in `components/layout/Header.tsx` and a few other places.
- Tagline and story live in `app/page.tsx` (hero) and `app/story/page.tsx`.
- For a full rebrand, global search/replace is safe because the design system is intentionally minimal.

### 5. Tech Pack PDF Content
Everything in the generated PDFs comes directly from `lib/designs.ts`.

When you update measurements or construction notes, the PDFs update instantly.

You can also pass custom notes from the generator UI (they appear in the PDF).

---

## Folder Structure (What You Can Safely Ignore)

```
app/                  → Next.js pages & routes (don't touch unless you love code)
components/           → Reusable UI (Header, forms, PDF generator)
lib/designs.ts        → ★ YOUR FILE — edit this for content
public/images/        → Drop your flat sketches here
```

You will almost never need to open anything except `lib/designs.ts` and the `public/images` folder.

---

## Deploying to Vercel (Recommended)

### 1. Prepare Environment Variables

Create the following variables in your Vercel project (or `.env.local` locally):

| Variable                          | Required?     | Description |
|-----------------------------------|---------------|-----------|
| `POSTGRES_URL`                    | Required      | Vercel Postgres connection string for inquiry + waitlist logging |
| `PRODUCTION_PASSWORD`             | Strongly recommended | Secret password to access `/atelier` internal tools |
| `RESEND_API_KEY`                  | Optional      | For sending email notifications on new inquiries |
| `RESEND_FROM`                     | Optional      | Email address to send from (e.g. `hello@kinform.studio`) |

### 2. Deployment Steps

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project → Import your `kinform` repo.
3. In **Environment Variables**, add the keys above.
4. Click **Deploy**.

After the first deployment:
- Set up a custom domain if desired.
- Redeploy after changing env vars.

### 3. Post-Deployment Checklist

- [ ] Set a strong `PRODUCTION_PASSWORD`
- [ ] Test the login at `https://yourdomain.com/atelier/login`
- [ ] Verify new inquiries appear in the dashboard
- [ ] Test PDF downloads from all production tools
- [ ] (Optional) Connect Resend and test email notifications

The production tools (`/atelier`, `/atelier/inquiries`, `/atelier/costs`) are now protected behind the password you set.

---

## Future Roadmap (Already Planned in the Code)

- E-commerce integration placeholders (add-to-cart buttons open the interest form with context)
- Full production suite inside `/atelier` (graded specs, BOM export, etc.)
- Real photography + lifestyle images
- Newsletter / SMS capture
- Size guide page

All of these are easy extensions because the foundation is solid.

---

## Tech Stack (for developers)

- Next.js 16 (App Router) + TypeScript
- Tailwind 4 + custom warm luxury design system
- jsPDF + jspdf-autotable (client-side professional PDFs)
- React Hook Form + Zod (robust forms)
- Framer Motion (subtle, intentional motion)
- Sonner (beautiful toasts)

Performance, accessibility, and SEO were prioritized from day one.

---

## Need Help?

- For content or image updates: edit `lib/designs.ts` + drop images
- For form issues: check Vercel Postgres connection env vars + project logs
- For anything visual or structural: reach out to your developer with this README

This foundation was built with deep respect for the founder’s time and the clothing itself.

Welcome to KINFORM.

---

*Built with care in April 2026 by Grok for the founder of KINFORM.*

---

## KINFORM Autonomous Ecosystem Orchestrator (KINFORM-AEO)

In addition to the marketing site above, this repo now hosts the
**KINFORM-AEO** monorepo — the autonomous physical-to-digital platform that
turns Torqued Affiliation™ into a governed, end-to-end runnable system.

| Component                          | Path                            | Purpose                                                    |
| ---------------------------------- | ------------------------------- | ---------------------------------------------------------- |
| **PersonaGenAI** (backend)         | `apps/persona-genai/`           | FastAPI + LangGraph multi-agent campaign orchestrator      |
| **Payload Studio** (IDE)           | `apps/payload-studio/`          | Next.js 15 visual IDE + Polymorphic Bootstrapping Compiler |
| **Torqued Graph** (DB)             | `packages/torqued-graph/`       | Prisma schema + SQLAlchemy models (bipartite affiliate)    |
| **Shared governance**              | `packages/shared/`              | Cross-language rule engine (Python + TypeScript)           |
| **Governance Pipeline**            | `infra/github-actions/` + `.github/workflows/kinform-governance.yml` | CI-time enforcement of every rule |
| **Architecture**                   | `docs/architecture.md`          | ADRs and end-to-end diagrams                               |

### Quickstart (KINFORM-AEO)

```bash
# 1. Backend orchestrator
cd apps/persona-genai
python -m venv .venv && source .venv/bin/activate
pip install -e ../../packages/shared -e ../../packages/torqued-graph -e .
uvicorn app.main:app --reload --port 8000

# 2. Seed the Torqued Graph (optional — creates one drop, 3 products, 2 affiliates)
python ../../packages/torqued-graph/seed/seed.py

# 3. Visual IDE
cd ../payload-studio
npm install
npm run dev          # http://localhost:3001

# 4. End-to-end:
#    - Open the Studio, click "+ New campaign via PersonaGenAI"
#    - Simulate → Approve → Production
#    - Click "Compile & Download Bootstrapper" with Production-only ON
#    - Run: python kinform-bootstrap-*.py --target ./my-drop
```

### Environment

See `.env.example`. The two ORMs share `DATABASE_URL` (SQLite by default,
Postgres-ready). The Payload Studio finds the FastAPI service via
`NEXT_PUBLIC_PERSONA_GENAI_URL`. The deterministic Brand Voice agent runs
without an LLM key; set `KINFORM_LLM_PROVIDER=openai` to enable real LLM
copy.

### Tests

```bash
# Backend
cd apps/persona-genai && pytest -q       # 14 tests

# Compiler
cd ../payload-studio && npm test         # 3 tests (executes the generated .py)

# Governance CI (locally)
python infra/github-actions/governance_check.py \
  --paths 'apps/payload-studio/**/campaigns/**/*.json' \
          'packages/**/seed/campaigns/*.json'
```

### What "governed" means here

- **No campaign reaches production without two explicit human approvals.**
  Stage transitions are enforced in `app/simulation.py`; the human gate
  re-runs governance with a fresh `ValidationLog` row.
- **Same rules everywhere.** `packages/shared` is the single source of
  truth. The Studio, the orchestrator, the CI pipeline, and the generated
  bootstrap script all pin on `GOVERNANCE_RULES_VERSION`.
- **The compiler refuses to compile** unapproved files when
  "Production-only" is on, and the generated script independently
  re-validates the rules version at runtime.

Read `docs/architecture.md` for the full design rationale.

