# Calisthenics.Coach

**A private, local-first bodyweight training PWA for exercise learning, deterministic session planning, guided workouts and progress tracking.**

Calisthenics.Coach runs as a static Progressive Web App on GitHub Pages. It does not require an account, API key, backend, camera or wearable.

## Live application

After GitHub Pages is enabled with **GitHub Actions** as the source:

```text
https://zenkoh.github.io/Calisthenics.Coach/
```

## Release features

- 144 structured exercises across 12 movement families.
- No-equipment, environmental-support and calisthenics-equipment tiers.
- Search and filters for family, difficulty, equipment and tracking mode.
- Progression and regression links for every exercise family.
- Accessible four-phase SVG demonstrations with optional voice cues.
- Deterministic, explainable session planner.
- Eight built-in programmes.
- Custom programme builder with reordering.
- Guided workout player for repetitions, per-side work, timed holds and intervals.
- Manual `+1 / -1`, pause, skip, rest extension and hard stop controls.
- IndexedDB workout history and movement-family coverage.
- Export, import and delete-all-data controls.
- Installable web app manifest and offline service worker.
- Responsive mobile, tablet and desktop interface.
- Automated catalogue, planner and syntax validation.
- GitHub Actions continuous integration and Pages deployment.

## Product principles

- Health and function over appearance.
- Consistency over unnecessary complexity.
- Progress one variable at a time.
- Regressions are normal training tools.
- Manual control remains available.
- Advanced and higher-impact movements are gated by level and impact settings.
- General fitness education only; no diagnosis or injury assessment.

## Architecture

```text
index.html                   Application shell and route sections
styles.css                   Responsive design system
js/app*.js                   Modular UI orchestration and application state
js/planner.js                Deterministic constraint-aware planner
js/workout.js                Rep, timer, set, rest and completion engine
js/db.js                     IndexedDB persistence and backup
js/avatar.js                 Local SVG pose renderer
content/catalogue*.gz        Compressed canonical 144-exercise catalogue
content/programmes.json      Built-in programme templates
service-worker.js            Offline cache and update lifecycle
manifest.webmanifest         PWA install metadata
tests/                       Node test suite
scripts/validate-content.mjs Content and reference validator
```

## Run locally

No compilation is required.

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Validate

```bash
npm install --ignore-scripts
npm run check
```

## GitHub Pages

The repository includes `.github/workflows/pages.yml` using the official Pages actions. In GitHub, open **Settings → Pages**, choose **GitHub Actions**, then push or merge to `main`.

## Safety and privacy

This is educational fitness software, not medical advice, physiotherapy, diagnosis or emergency guidance. All app-created data remains in the current browser unless the user exports it. See [Safety and scope](safety.html) and [Privacy](privacy.html).

## Licence

MIT for application code. Exercise content is prototype educational content and should receive qualified domain review before clinical, school or commercial deployment.
