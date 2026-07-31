# Calisthenics.Coach Build Proposal and Release Scope

## Product decision

Calisthenics.Coach is implemented as a GitHub Pages Progressive Web App. The web release owns exercise education, planning, guided sessions, local history and offline operation. Native Apple Watch sensing and HealthKit remain a separate future client because native Apple frameworks cannot execute inside GitHub Pages.

## Delivered release

### Exercise knowledge system

- 144 structured exercises.
- Twelve movement families.
- Three equipment tiers.
- Four difficulty levels.
- Impact, noise and space metadata.
- Rep, per-side, hold and duration prescriptions.
- Four demonstration phases per exercise.
- Progression, regression and substitution references.
- Tracking-support labels that distinguish timer, manual and experimental wearable concepts.

### Planner

The planner filters by:

- goal;
- experience;
- available time;
- current energy preference;
- impact ceiling;
- noise constraint;
- space constraint;
- available support or equipment;
- recent exercise exposure.

Eligible movements receive deterministic scores. The same input on the same date produces the same plan, allowing reliable testing and clear explanations.

### Workout player

The workout engine supports:

- repetitions;
- repetitions per side;
- timed holds;
- duration intervals;
- sets and rest;
- transitions;
- pause and resume;
- manual rep correction;
- skip;
- rest extension;
- stop;
- local completion records.

### Local-first data

IndexedDB stores:

- completed sessions;
- custom programmes;
- preferences.

Users can export, import and delete all stored data. No account or cloud database is required.

### Progressive Web App

The release includes:

- web app manifest;
- install icons;
- service worker;
- offline app shell;
- cache versioning;
- Pages deployment workflow.

## Architecture boundary

```text
GitHub Pages PWA
  ├─ exercise catalogue
  ├─ programme engine
  ├─ guided workout player
  ├─ local progress
  └─ offline operation

Future native Apple client
  ├─ HealthKit workout lifecycle
  ├─ Apple Watch motion collection
  ├─ haptics
  └─ individually validated exercise detectors
```

Automatic repetition recognition is not claimed in the current web release. The interface remains fully usable with timers and manual counting.

## Quality gates

- Catalogue contains at least 120 exercises.
- Exercise IDs and slugs are unique.
- Every cross-reference resolves.
- Every exercise has four instruction and demonstration phases.
- Every programme references valid exercises and metrics.
- Quiet plans contain only quiet movements.
- Foundation plans exclude higher levels and impact.
- JavaScript syntax validation passes.
- Node tests pass before Pages deployment.

## Next native phase

A future Apple client should use one canonical exercise schema, proper `HKWorkoutSession` and `HKLiveWorkoutBuilder` lifecycle management, exercise-specific detector protocols, sample timestamps, timeout resets rather than forced transitions, sensor replay and published validation metrics.
