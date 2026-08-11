# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary:** Recruiters and hiring managers evaluating Prasad Jawale for software engineering / AI-ML roles. They arrive with limited time, scan for proof of production experience and fit, and decide whether to advance to an interview.

**Secondary:** Photography enthusiasts browsing the creative portfolio for visual work and atmosphere.

## Product Purpose

A personal portfolio that presents engineering credentials, project proof, and photography so recruiters can quickly assess fit and invite Prasad to interview. Success means interview invites (and secondary engagement with the photography work).

## Positioning

Recruiter-first portfolio of a practicing SWE/AIML engineer who ships production NLP/ML systems and also maintains a serious photography practice — not a generic project dump or a photography site with a resume bolted on.

## Operating Context

- Single-page home with anchored sections: About → Experience → Projects → Portfolio (photography).
- Project detail pages for deeper technical write-ups.
- Admin tools for managing photography assets (Supabase-backed).
- Public links to GitHub, LinkedIn, and published research (Springer).
- Evaluated on desktop and mobile browsers; deployed as a Next.js frontend with a FastAPI backend.

## Capabilities and Constraints

- Frontend: Next.js (App Router), Tailwind, Geist Sans; backend: FastAPI; photos via Supabase/Cloudinary.
- Confirmed sections and content sources: hero/identity, resume (experience, education, skills, publication), featured projects, photography gallery with lightbox.
- Admin route for photo management; auth-gated.
- **Preserve the current visual design** as the incumbent system — future work should refine within it, not replace the look without an explicit redesign request.
- Undecided: whether photography-first visitors get a distinct entry path beyond the Portfolio section.

## Brand Commitments

- Name: **Prasad Jawale**
- Role line: Software Engineer / AIML
- Voice: professional, proof-led, concise — recruiter-scannable first; creative work present but secondary in IA
- Identity assets: portrait (`SITE.ogImage`), GitHub `@Tydos`, LinkedIn, Springer publication credit
- Visual identity: keep the current implemented design (tokens, layout language, component feel) unless explicitly redesigning

## Evidence on Hand

- Portrait image (Cloudinary)
- Resume data: Lyntra (SWE AI intern), Wisconsin School of Business, StoccGuru; UW–Madison M.S. Data Science; University of Mumbai B.Tech.
- Springer publication: LightGBM / gradient boosting pharmaceutical shipment-mode paper
- Featured projects and MDX project pages
- Live photography gallery (managed assets)
- Do not fabricate testimonials, employers, metrics, or press beyond what the repo and user confirm

## Product Principles

1. **Recruiter path first** — Identity, proof, and contact paths must be findable without hunting; photography never blocks the hiring story.
2. **Proof over decoration** — Real roles, projects, publication, and photos carry the site; no invented social proof.
3. **Two audiences, one site** — Engineering evaluation is primary; photography is a first-class secondary experience, not an afterthought dump.
4. **Preserve the incumbent look** — Extend and refine the current design system; do not silently rebrand.
5. **Scannable honesty** — Short, accurate claims a recruiter can verify against LinkedIn, GitHub, and the publication link.

## Accessibility & Inclusion

No product-specific standard beyond a solid web baseline was set; prior critique noted focus management and named controls as areas to maintain. Prefer keyboard-reachable navigation, focus-visible states, and meaningful image/link names for recruiter and gallery flows.
