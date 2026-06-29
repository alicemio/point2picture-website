# Point2Picture — Landing Page

A warm, responsive landing page for Point2Picture, a communication support tool for minimally-speaking and non-speaking children.

## Preview locally

Open `index.html` in a browser, or run a simple server:

```bash
cd point2picture-website
python3 -m http.server 8081
```

Then visit [http://localhost:8081](http://localhost:8081).

## Structure

- `index.html` — Semantic single-page layout with all homepage sections
- `css/main.css` — Design system (warm neutrals, restrained accents, mobile-first)
- `js/main.js` — Mobile navigation, scroll reveal, form handling
- `assets/` — Logo mark, hero illustration, and UI preview SVGs

## Sections

1. Hero with primary CTAs
2. Empathetic problem acknowledgment
3. Real-life routines use cases
4. Key features
5. Positioning (complements AAC)
6. Demo video placeholder
7. Founder story
8. FAQ
9. Final CTA with email signup

## Customization

Replace SVG illustrations in `assets/` with real photography when available:

- `hero-caregiving.svg` → candid caregiver/child photo
- `ui-board.svg` → actual app screenshots
- Connect the updates form to your email provider or backend

## Design notes

- **Typography:** Fraunces (headings) + DM Sans (body)
- **Palette:** Warm cream neutrals with soft teal, coral, sage, and blue accents
- **No build step** — static files, fast-loading
