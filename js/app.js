import { db } from './db.js';
import { generatePlan, explainPlan, estimatePlanMinutes } from './planner.js';
import { avatarSvg } from './avatar.js';
import { WorkoutEngine } from './workout.js';

Object.assign(window, { db, generatePlan, explainPlan, estimatePlanMinutes, avatarSvg, WorkoutEngine });

for (const source of ['./app-core.js', './app-training.js', './app-shell.js']) {
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = source;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${source}`));
    document.head.append(script);
  });
}
