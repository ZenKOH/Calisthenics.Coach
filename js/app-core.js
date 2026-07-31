const APP_VERSION = '1.0.0';
const EQUIPMENT_OPTIONS = [
  ['wall', 'Wall'], ['chair', 'Chair'], ['bench', 'Bench / step'], ['doorframe', 'Door frame'],
  ['stable-table', 'Stable table'], ['step', 'Step'], ['pull-up-bar', 'Pull-up bar'],
  ['low-bar', 'Low bar'], ['parallel-bars', 'Parallel bars']
];

const state = {
  exercises: [], exerciseMap: new Map(), programmes: [], customProgrammes: [], sessions: [],
  currentPlan: null, builderItems: [], settings: { voice: true, sound: true, reducedMotion: false },
  installPrompt: null, workout: null
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.text !== undefined) node.textContent = options.text;
  if (options.html !== undefined) node.innerHTML = options.html;
  if (options.attrs) Object.entries(options.attrs).forEach(([key, value]) => node.setAttribute(key, value));
  if (options.dataset) Object.entries(options.dataset).forEach(([key, value]) => { node.dataset[key] = value; });
  if (options.on) Object.entries(options.on).forEach(([event, handler]) => node.addEventListener(event, handler));
  const list = Array.isArray(children) ? children : [children];
  list.filter(Boolean).forEach(child => node.append(child));
  return node;
}

function toast(message) {
  const node = $('#toast');
  node.textContent = message;
  node.classList.add('show');
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => node.classList.remove('show'), 2600);
}

function route() {
  const page = location.hash.replace('#', '') || 'today';
  $$('.route-page').forEach(section => { section.hidden = section.dataset.page !== page; });
  $$('[data-route]').forEach(link => link.classList.toggle('active', link.dataset.route === page));
  $('#primaryNav').classList.remove('open');
  $('#menuButton').setAttribute('aria-expanded', 'false');
  if (page === 'progress') renderProgress();
  if (page === 'programmes') renderProgrammes();
  if (page === 'workout') renderWorkout();
  window.scrollTo({ top: 0, behavior: state.settings.reducedMotion ? 'auto' : 'smooth' });
}

function formatPrescription(item) {
  const metricLabel = item.metric === 'hold' || item.metric === 'duration'
    ? `${item.target}s`
    : item.metric === 'repsPerSide' ? `${item.target}/side` : `${item.target} reps`;
  return `${item.sets} × ${metricLabel}`;
}

function phaseLabel(phase) {
  return ({ warmup: 'Prepare', main: 'Main', conditioning: 'Condition', cooldown: 'Reset' })[phase] ?? phase;
}

function equipmentChecks(container, prefix) {
  container.replaceChildren();
  EQUIPMENT_OPTIONS.forEach(([value, label]) => {
    const input = el('input', { attrs: { type: 'checkbox', value, id: `${prefix}-${value}` } });
    const labelNode = el('label', { className: 'check' }, [input, document.createTextNode(label)]);
    container.append(labelNode);
  });
}

function selectedEquipment() {
  return $$('#plannerEquipment input:checked').map(input => input.value);
}

async function loadData() {
  const [catalogueIndex, programmePayload] = await Promise.all([
    fetch('./content/catalogue-index.json').then(r => { if (!r.ok) throw new Error('Exercise catalogue failed to load.'); return r.json(); }),
    fetch('./content/programmes.json').then(r => { if (!r.ok) throw new Error('Programmes failed to load.'); return r.json(); })
  ]);
  if (!('DecompressionStream' in window)) throw new Error('This browser does not support the offline catalogue decoder.');
  const buffers = await Promise.all(catalogueIndex.parts.map(part => fetch(`./content/${part.replace('./','')}`).then(r => { if (!r.ok) throw new Error(`Catalogue part failed to load: ${part}`); return r.arrayBuffer(); })));
  const size = buffers.reduce((sum, buffer) => sum + buffer.byteLength, 0);
  const joined = new Uint8Array(size);
  let offset = 0;
  for (const buffer of buffers) { joined.set(new Uint8Array(buffer), offset); offset += buffer.byteLength; }
  const stream = new Blob([joined]).stream().pipeThrough(new DecompressionStream('gzip'));
  const exercisePayload = JSON.parse(await new Response(stream).text());
  state.exercises = exercisePayload.exercises;
  state.exerciseMap = new Map(state.exercises.map(ex => [ex.id, ex]));
  state.programmes = programmePayload.programmes;
  state.customProgrammes = await db.getAll('customProgrammes');
  state.sessions = (await db.getAll('sessions')).sort((a, b) => String(b.completedAt).localeCompare(String(a.completedAt)));
  state.settings = {
    voice: await db.getPreference('voice', true),
    sound: await db.getPreference('sound', true),
    reducedMotion: await db.getPreference('reducedMotion', false)
  };
  state.workout = new WorkoutEngine(state.exerciseMap);
}

function renderFamilyOptions() {
  const select = $('#familyFilter');
  const families = [...new Map(state.exercises.map(ex => [ex.family, ex.familyLabel])).entries()];
  families.forEach(([value, label]) => select.append(el('option', { text: label, attrs: { value } })));
}

function renderLibrary() {
  const query = $('#exerciseSearch').value.trim().toLowerCase();
  const family = $('#familyFilter').value;
  const difficulty = $('#difficultyFilter').value;
  const tier = $('#equipmentTierFilter').value;
  const tracking = $('#trackingFilter').value;
  const quiet = $('#quietFilter').checked;
  const list = state.exercises.filter(ex => {
    const text = [ex.name, ex.familyLabel, ex.difficulty, ...ex.primaryMuscles, ...ex.goals].join(' ').toLowerCase();
    return (!query || text.includes(query)) &&
      (family === 'all' || ex.family === family) &&
      (difficulty === 'all' || ex.difficulty === difficulty) &&
      (tier === 'all' || ex.equipmentTier === tier) &&
      (tracking === 'all' || ex.detection.support === tracking) &&
      (!quiet || ex.noise === 'quiet');
  });
  $('#libraryCount').replaceChildren(el('strong', { text: String(list.length) }), el('small', { text: 'matching exercises' }));
  const grid = $('#exerciseGrid');
  grid.replaceChildren();
  if (!list.length) {
    grid.append(el('div', { className: 'panel empty-state', text: 'No exercises match these filters.' }));
    return;
  }
  list.forEach(exercise => grid.append(exerciseCard(exercise)));
}

function exerciseCard(exercise) {
  const title = el('h3', { text: exercise.name });
  const badge = el('span', { className: 'status-chip', text: exercise.difficulty });
  const card = el('article', { className: 'exercise-card' }, [
    el('div', { className: 'card-top' }, [title, badge]),
    el('p', { text: exercise.familyLabel }),
    el('div', { className: 'tag-row' }, [
      ...exercise.primaryMuscles.slice(0, 3).map(tag => el('span', { className: 'tag', text: tag })),
      el('span', { className: 'tag', text: exercise.equipment.length ? exercise.equipment.join(', ') : 'no equipment' }),
      el('span', { className: 'tag', text: exercise.prescription.type })
    ]),
    el('p', { text: exercise.coachingCues[0] }),
    el('div', { className: 'card-actions' }, [
      el('button', { className: 'button secondary', text: 'View', attrs: { type: 'button' }, on: { click: () => openExercise(exercise) } }),
      el('button', { className: 'button ghost', text: 'Add to builder', attrs: { type: 'button' }, on: { click: () => addToBuilder(exercise.id) } })
    ])
  ]);
  return card;
}

function openExercise(exercise) {
  const dialog = $('#exerciseDialog');
  const detail = $('#exerciseDetail');
  let phaseIndex = 0;
  const avatarContainer = el('div', { className: 'detail-avatar', html: avatarSvg(exercise.pattern, phaseIndex, `${exercise.name} demonstration`) });
  const cue = el('p', { text: exercise.phases[0].cue });
  const tabs = el('div', { className: 'phase-tabs' });
  exercise.phases.forEach((phase, index) => {
    const button = el('button', {
      text: phase.label, attrs: { type: 'button' }, className: index === 0 ? 'active' : '',
      on: { click: () => {
        phaseIndex = index;
        avatarContainer.innerHTML = avatarSvg(exercise.pattern, phaseIndex, `${exercise.name}: ${phase.label}`);
        cue.textContent = phase.cue;
        [...tabs.children].forEach((child, i) => child.classList.toggle('active', i === phaseIndex));
        if (state.settings.voice) speak(`${phase.label}. ${phase.cue}`);
      } }
    });
    tabs.append(button);
  });
  const regressions = exercise.regressions.map(id => state.exerciseMap.get(id)?.name).filter(Boolean);
  const progressions = exercise.progressions.map(id => state.exerciseMap.get(id)?.name).filter(Boolean);
  const left = el('div', {}, [avatarContainer, tabs, cue]);
  const right = el('div', {}, [
    el('p', { className: 'eyebrow', text: exercise.familyLabel }),
    el('h1', { text: exercise.name }),
    el('div', { className: 'tag-row' }, [
      el('span', { className: 'tag', text: exercise.difficulty }),
      el('span', { className: 'tag', text: `${exercise.impact} impact` }),
      el('span', { className: 'tag', text: exercise.detection.support.replaceAll('-', ' ') })
    ]),
    el('h3', { text: 'How to perform it' }),
    el('ol', { className: 'detail-list' }, exercise.instructions.map(step => el('li', { text: step }))),
    el('h3', { text: 'Coach cues' }),
    el('ul', { className: 'detail-list' }, exercise.coachingCues.map(step => el('li', { text: step }))),
    el('h3', { text: 'Common errors' }),
    el('ul', { className: 'detail-list' }, exercise.commonErrors.map(step => el('li', { text: step }))),
    el('div', { className: 'progression-box' }, [
      el('div', {}, [el('strong', { text: 'Easier / regression' }), el('p', { text: regressions.join(', ') || exercise.easierText })]),
      el('div', {}, [el('strong', { text: 'Harder / progression' }), el('p', { text: progressions.join(', ') || exercise.harderText })])
    ]),
    el('h3', { text: 'Safety scope' }),
    el('ul', { className: 'detail-list' }, exercise.safety.notes.map(note => el('li', { text: note }))),
    el('div', { className: 'button-row' }, [
      el('button', { className: 'button primary', text: 'Add to programme builder', attrs: { type: 'button' }, on: { click: () => { addToBuilder(exercise.id); dialog.close(); } } })
    ])
  ]);
  detail.replaceChildren(el('div', { className: 'detail-grid' }, [left, right]));
  dialog.showModal();
}
