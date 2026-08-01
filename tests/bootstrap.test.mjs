import test from 'node:test';
import assert from 'node:assert/strict';
import { createFallbackCatalogue, createFallbackProgrammes } from '../js/catalogue-fallback.js';
import { generatePlan } from '../js/planner.js';

test('compatibility catalogue remains complete and programme-safe', () => {
  const exercises = createFallbackCatalogue();
  const ids = new Set(exercises.map(exercise => exercise.id));
  assert.equal(exercises.length, 144);
  assert.equal(new Set(exercises.map(exercise => exercise.family)).size, 12);
  for (const programme of createFallbackProgrammes()) {
    assert.ok(programme.items.length > 0);
    assert.ok(programme.items.every(item => ids.has(item.exerciseId)));
  }
});

test('planner generates a usable session from the compatibility catalogue', () => {
  const exercises = createFallbackCatalogue();
  const options = { goal:'balanced', level:'beginner', duration:25, energy:3, impact:'low', quiet:true, smallSpace:true, equipment:[] };
  const plan = generatePlan(exercises, options, []);
  assert.ok(plan.items.length >= 5);
  assert.ok(plan.items.some(item => item.phase === 'main'));
  assert.ok(plan.items.every(item => exercises.some(exercise => exercise.id === item.exerciseId)));
});
