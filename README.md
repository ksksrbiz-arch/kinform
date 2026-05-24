# KINFORM — Digital Foundation

A clean, premium, fast-loading marketing website and digital lookbook for **KINFORM**, a new contemporary women's clothing line.

**Live features delivered in this MVP:**
- Beautiful editorial presentation of the three debut designs (TETHER, CLASP, APERTURE)
- Rich brand story
- Fully functional **Tech Pack Generator** that produces professional, downloadable multi-page PDFs with measurements, construction notes, and custom options
- Working interest / wholesale / production inquiry form (ready for Formspree)
- Easy single-file content editing for the founder
- Clear placeholders and instructions for adding your professional flat sketches
- Elegant warm contemporary aesthetic (Reformation + modern quiet luxury)

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

### 2. Add Your Professional Flat Sketches
The site expects images at these exact paths:

```
public/images/
├── tether/
│   └── tether-flat.png          ← your professional flat for Design 01
├── clasp/
│   └── clasp-flat.png
├── aperture/
│   └── aperture-flat.png
└── hero/
    └── (optional editorial hero image)
```

**Recommended specs:**
- High-resolution PNG or SVG (minimum 1600–2000px wide)
- Clean white or cream background preferred (matches the aesthetic)
- Technical drawing / flat sketch style

Until you add the real files, the site shows elegant placeholders with the design names.

### 3. Set Up the Contact Form (Formspree — 3 minutes)
1. Go to [formspree.io](https://formspree.io) and create a free account + new form called “KINFORM Interest”.
2. Copy the form endpoint (e.g. `https://formspree.io/f/abc123`).
3. Create a file called `.env.local` in the project root (copy from `.env.example`).
4. Paste your endpoint:

```env
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/abc123
```

5. Restart the dev server (`npm run dev`).

Submissions will now go to your email (or wherever you configured in Formspree). Spam protection is included.

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
| `NEXT_PUBLIC_FORMSPREE_ENDPOINT`  | Recommended   | Your Formspree form endpoint (e.g. `https://formspree.io/f/xxxxx`) |
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
- For form issues: check Formspree dashboard + `.env.local`
- For anything visual or structural: reach out to your developer with this README

This foundation was built with deep respect for the founder’s time and the clothing itself.

Welcome to KINFORM.

---

*Built with care in April 2026 by Grok for the founder of KINFORM.*
