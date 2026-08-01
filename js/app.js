import { db } from './db.js';
import { generatePlan, explainPlan, estimatePlanMinutes } from './planner.js';
import { avatarSvg } from './avatar.js';
import { WorkoutEngine } from './workout.js';
import { createFallbackCatalogue, createFallbackProgrammes } from './catalogue-fallback.js';

Object.assign(window, {
  db,
  generatePlan,
  explainPlan,
  estimatePlanMinutes,
  avatarSvg,
  WorkoutEngine,
  createFallbackCatalogue,
  createFallbackProgrammes
});

for (const source of ['./app-core.js', './app-repair.js', './app-training.js', './app-shell.js']) {
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = source;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${source}`));
    document.head.append(script);
  });
}
