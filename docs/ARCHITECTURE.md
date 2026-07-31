# Architecture

## Static application

The release intentionally avoids runtime package dependencies. Browser modules load directly from the repository, making the deployed artefact inspectable and reducing supply-chain risk.

## Data flow

```text
content/exercises.json
        ↓
application catalogue
        ├─ library filters
        ├─ exercise detail
        ├─ programme builder
        └─ planner eligibility

planner options + recent sessions
        ↓
deterministic scoring
        ↓
workout plan
        ↓
WorkoutEngine
        ↓
IndexedDB session summary
        ↓
progress dashboard
```

## Security posture

- No arbitrary HTML from user notes is rendered.
- Imported backups are checked for app and schema identifiers.
- Import size is limited.
- No third-party scripts are loaded.
- No remote images, analytics or advertising are used.
- Application content is served from the same origin.

## Future extension

The canonical JSON catalogue can later be transformed into Swift `Codable` models for an Apple Watch client or used by an on-device pose-analysis module. Detection support must remain an explicit per-exercise capability label.
