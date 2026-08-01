const FAMILY_DEFINITIONS = [
  { key:'mobility', label:'Mobility & recovery', pattern:'mobility', muscles:['mobility','spine','hips'], goals:['mobility','balance','foundation'], names:[
    ['supine-breathing-brace','Supine Breathing Brace'],['cat-cow','Cat–Cow'],['thoracic-open-book','Thoracic Open Book'],['hip-flexor-rock','Hip Flexor Rock'],['adductor-rock-back','Adductor Rock-Back'],['ankle-rocker','Ankle Rocker'],['shoulder-wall-slide','Shoulder Wall Slide'],['child-s-pose-reach',"Child's Pose Reach"],['calf-stretch-at-wall','Calf Stretch at Wall'],['90-90-hip-switch','90/90 Hip Switch'],['standing-side-bend','Standing Side Bend'],['wrist-rock','Wrist Rock'] ] },
  { key:'low-cardio', label:'Low-impact conditioning', pattern:'cardio-low', muscles:['cardiovascular','legs','coordination'], goals:['conditioning','foundation','balanced'], names:[
    ['march-in-place','March in Place'],['cross-crawl-march','Cross-Crawl March'],['step-jack','Step Jack'],['shadow-boxing','Shadow Boxing'],['skater-step','Skater Step'],['knee-drive-march','Knee-Drive March'],['low-impact-burpee','Low-Impact Burpee'],['heel-dig','Alternating Heel Dig'],['toe-tap','Alternating Toe Tap'],['side-step','Side Step'],['hamstring-curl-step','Hamstring Curl Step'],['boxer-step','Boxer Step'] ] },
  { key:'squat-knee', label:'Squat & knee-dominant', pattern:'squat', muscles:['quadriceps','glutes','calves'], goals:['strength','balanced','calisthenics','balance'], names:[
    ['chair-sit-to-stand','Chair Sit-to-Stand'],['bodyweight-squat','Bodyweight Squat'],['split-squat','Split Squat'],['reverse-lunge','Reverse Lunge'],['forward-lunge','Forward Lunge'],['lateral-lunge','Lateral Lunge'],['squat-to-calf-raise','Squat to Calf Raise'],['wall-sit','Wall Sit'],['assisted-squat','Assisted Squat'],['tempo-squat','Tempo Squat'],['pulse-squat','Squat Pulse'],['cossack-shift','Cossack Shift'] ] },
  { key:'hinge-glute', label:'Hip hinge & posterior chain', pattern:'hinge', muscles:['glutes','hamstrings','posterior chain'], goals:['strength','balanced','core','balance'], names:[
    ['hip-hinge-drill','Hip Hinge Drill'],['bodyweight-good-morning','Bodyweight Good Morning'],['glute-bridge','Glute Bridge'],['bridge-march','Bridge March'],['single-leg-bridge','Single-Leg Bridge'],['hamstring-walkout','Hamstring Walkout'],['frog-pump','Frog Pump'],['quadruped-hip-extension','Quadruped Hip Extension'],['fire-hydrant','Fire Hydrant'],['standing-hip-extension','Standing Hip Extension'],['reverse-plank','Reverse Plank'],['hip-thrust-floor','Floor Hip Thrust'] ] },
  { key:'horizontal-push', label:'Horizontal pushing', pattern:'push', muscles:['chest','triceps','shoulders'], goals:['strength','balanced','calisthenics'], names:[
    ['wall-push-up','Wall Push-Up'],['high-incline-push-up','High Incline Push-Up'],['low-incline-push-up','Low Incline Push-Up'],['knee-push-up','Knee Push-Up'],['standard-push-up','Standard Push-Up'],['tempo-push-up','Tempo Push-Up'],['wide-push-up','Wide Push-Up'],['narrow-push-up','Narrow Push-Up'],['staggered-push-up','Staggered Push-Up'],['shoulder-tap-push-up','Shoulder-Tap Push-Up'],['decline-push-up','Decline Push-Up'],['push-up-hold','Push-Up Hold'] ] },
  { key:'vertical-push', label:'Vertical & shoulder pushing', pattern:'vertical-push', muscles:['shoulders','triceps','upper back'], goals:['strength','calisthenics'], names:[
    ['incline-pike-push-up','Incline Pike Push-Up'],['pike-hold','Pike Hold'],['pike-push-up','Pike Push-Up'],['dolphin-push-up','Dolphin Push-Up'],['downward-dog-press','Downward-Dog Press'],['wall-walk-prep','Wall-Walk Preparation'],['handstand-lean','Handstand Lean'],['kneeling-shoulder-isometric','Kneeling Shoulder Isometric'],['tripod-hold','Tripod Hold'],['elevated-pike-push-up','Elevated Pike Push-Up'],['wall-handstand-hold','Wall Handstand Hold'],['partial-handstand-push-up','Partial Handstand Push-Up'] ] },
  { key:'pull-back', label:'Pulling & posterior shoulder', pattern:'pull', muscles:['upper back','biceps','rear shoulders'], goals:['strength','balanced','calisthenics'], names:[
    ['prone-y-raise','Prone Y Raise'],['prone-t-raise','Prone T Raise'],['prone-w-raise','Prone W Raise'],['reverse-snow-angel','Reverse Snow Angel'],['floor-cobra','Floor Cobra'],['swimmer','Swimmer'],['table-row','Table Row'],['australian-row','Australian Row'],['scapular-pull-up','Scapular Pull-Up'],['dead-hang','Dead Hang'],['chin-up-negative','Chin-Up Negative'],['pull-up','Pull-Up'] ] },
  { key:'anterior-core', label:'Anterior core control', pattern:'core', muscles:['abdominals','deep core','hip flexors'], goals:['core','balanced','calisthenics'], names:[
    ['supine-knee-fold','Supine Knee Fold'],['dead-bug','Dead Bug'],['forearm-plank','Forearm Plank'],['high-plank','High Plank'],['hollow-tuck-hold','Hollow Tuck Hold'],['slow-mountain-climber','Slow Mountain Climber'],['plank-knee-drive','Plank Knee Drive'],['reverse-crunch','Reverse Crunch'],['curl-up','Controlled Curl-Up'],['leg-lowering','Leg Lowering'],['hollow-body-hold','Hollow Body Hold'],['body-saw','Body Saw'] ] },
  { key:'lateral-core', label:'Lateral & cross-body core', pattern:'lateral-core', muscles:['obliques','lateral hip','deep core'], goals:['core','balanced','balance'], names:[
    ['bent-knee-side-plank','Bent-Knee Side Plank'],['bird-dog','Bird Dog'],['standing-cross-body-crunch','Standing Cross-Body Crunch'],['side-lying-leg-lift','Side-Lying Leg Lift'],['side-plank','Side Plank'],['side-plank-hip-lift','Side-Plank Hip Lift'],['side-plank-reach-through','Side-Plank Reach-Through'],['bear-hover','Bear Hover'],['bear-shoulder-tap','Bear Shoulder Tap'],['cross-body-hold','Cross-Body Hold'],['side-plank-star','Side-Plank Star'],['long-lever-side-plank','Long-Lever Side Plank'] ] },
  { key:'locomotion', label:'Ground locomotion', pattern:'locomotion', muscles:['full body','shoulders','core'], goals:['conditioning','calisthenics','core'], names:[
    ['inchworm-walkout','Inchworm Walkout'],['crawl-hold','Crawl Hold'],['bear-crawl-forward','Bear Crawl Forward'],['bear-crawl-backward','Bear Crawl Backward'],['lateral-bear-crawl','Lateral Bear Crawl'],['crab-walk','Crab Walk'],['leopard-crawl','Leopard Crawl'],['plank-walk','Plank Walk'],['duck-walk','Duck Walk'],['ape-step','Ape Step'],['frogger-step','Frogger Step'],['low-crawl','Low Crawl'] ] },
  { key:'balance', label:'Balance & functional control', pattern:'balance', muscles:['ankles','hips','postural control'], goals:['balance','foundation','mobility'], names:[
    ['supported-single-leg-balance','Supported Single-Leg Balance'],['tandem-stance','Tandem Stance'],['heel-to-toe-rock','Heel-to-Toe Rock'],['balance-march-with-pause','Balance March with Pause'],['single-leg-balance','Single-Leg Balance'],['single-leg-reach','Single-Leg Reach'],['tandem-walk','Tandem Walk'],['toe-stand-balance','Toe-Stand Balance'],['heel-stand-balance','Heel-Stand Balance'],['clock-reach','Clock Reach'],['airplane-balance','Airplane Balance'],['eyes-closed-tandem','Eyes-Closed Tandem Stance'] ] },
  { key:'high-cardio', label:'Higher-impact conditioning', pattern:'cardio-high', muscles:['cardiovascular','legs','full body'], goals:['conditioning','calisthenics'], names:[
    ['jumping-jack','Jumping Jack'],['seal-jack','Seal Jack'],['high-knees','High Knees'],['mountain-climber','Mountain Climber'],['skater-hop','Skater Hop'],['squat-thrust','Squat Thrust'],['lateral-shuffle','Lateral Shuffle'],['plank-jack','Plank Jack'],['split-jack','Split Jack'],['squat-jack','Squat Jack'],['burpee','Burpee'],['tuck-jump','Tuck Jump'] ] }
];

const EQUIPMENT_BY_ID = {
  'shoulder-wall-slide':['wall'], 'calf-stretch-at-wall':['wall'], 'chair-sit-to-stand':['chair'], 'wall-sit':['wall'],
  'assisted-squat':['chair'], 'wall-push-up':['wall'], 'high-incline-push-up':['bench'], 'low-incline-push-up':['bench'],
  'decline-push-up':['bench'], 'incline-pike-push-up':['bench'], 'elevated-pike-push-up':['bench'], 'wall-walk-prep':['wall'],
  'handstand-lean':['wall'], 'wall-handstand-hold':['wall'], 'partial-handstand-push-up':['wall'], 'table-row':['stable-table'],
  'australian-row':['low-bar'], 'scapular-pull-up':['pull-up-bar'], 'dead-hang':['pull-up-bar'], 'chin-up-negative':['pull-up-bar'],
  'pull-up':['pull-up-bar']
};

const HOLD_IDS = new Set(['supine-breathing-brace','calf-stretch-at-wall','wall-sit','push-up-hold','pike-hold','handstand-lean','kneeling-shoulder-isometric','tripod-hold','wall-handstand-hold','dead-hang','forearm-plank','high-plank','hollow-tuck-hold','hollow-body-hold','bent-knee-side-plank','side-plank','bear-hover','cross-body-hold','side-plank-star','long-lever-side-plank','crawl-hold','supported-single-leg-balance','tandem-stance','single-leg-balance','toe-stand-balance','heel-stand-balance','eyes-closed-tandem']);
const PER_SIDE_IDS = new Set(['thoracic-open-book','hip-flexor-rock','adductor-rock-back','ankle-rocker','split-squat','reverse-lunge','forward-lunge','lateral-lunge','cossack-shift','single-leg-bridge','quadruped-hip-extension','fire-hydrant','standing-hip-extension','staggered-push-up','dead-bug','slow-mountain-climber','plank-knee-drive','bird-dog','standing-cross-body-crunch','side-lying-leg-lift','side-plank-hip-lift','side-plank-reach-through','single-leg-reach','clock-reach','airplane-balance']);
const DURATION_FAMILIES = new Set(['low-cardio','high-cardio','locomotion']);

function difficultyFor(index){ return index < 3 ? 'foundation' : index < 7 ? 'beginner' : index < 10 ? 'intermediate' : 'advanced'; }
function prescriptionFor(id, family, difficulty){
  if (HOLD_IDS.has(id)) return { type:'hold', target:difficulty === 'advanced' ? 30 : 20, sets:2, restSeconds:45 };
  if (DURATION_FAMILIES.has(family)) return { type:'duration', target:difficulty === 'advanced' ? 40 : 30, sets:2, restSeconds:30 };
  if (PER_SIDE_IDS.has(id)) return { type:'repsPerSide', target:difficulty === 'foundation' ? 5 : 7, sets:2, restSeconds:45 };
  return { type:'reps', target:difficulty === 'foundation' ? 6 : difficulty === 'advanced' ? 10 : 8, sets:2, restSeconds:45 };
}
function phaseSet(family){
  const labels = family === 'mobility' ? ['Set up','Move gently','Pause','Return'] : family.includes('cardio') ? ['Ready','Move','Control','Reset'] : ['Set up','Lower / reach','End position','Return'];
  return labels.map((label,index)=>({label,cue:[
    'Choose a stable position and breathe normally.',
    'Move only through a range you can control.',
    'Keep the movement smooth without forcing the end position.',
    'Return with the same control and reset before continuing.'
  ][index]}));
}
function safetyNotes(difficulty, impact){
  const notes = ['Use a clear, stable training area and stop if you feel pain, dizziness or unusual discomfort.'];
  if (impact === 'moderate' || impact === 'high') notes.push('Use a lower-impact alternative when landing control or space is limited.');
  if (difficulty === 'advanced') notes.push('Attempt this progression only after you can perform its easier versions with consistent control.');
  return notes;
}

export function createFallbackCatalogue(){
  const exercises=[];
  for(const family of FAMILY_DEFINITIONS){
    family.names.forEach(([slug,name],index)=>{
      const difficulty=difficultyFor(index);
      const equipment=EQUIPMENT_BY_ID[slug] ?? [];
      const impact=family.key === 'high-cardio' ? (index < 4 ? 'moderate' : 'high') : family.key === 'low-cardio' ? 'low' : 'none';
      exercises.push({
        id:`ex-${slug}`, slug, name, family:family.key, familyLabel:family.label, pattern:family.pattern,
        difficulty, impact, noise:family.key === 'high-cardio' ? 'normal' : 'quiet', space:['locomotion','high-cardio'].includes(family.key) ? 'medium' : 'small',
        equipmentTier:equipment.length ? (equipment.some(item=>['pull-up-bar','low-bar','parallel-bars'].includes(item)) ? 'calisthenics' : 'environmental') : 'none',
        equipment, primaryMuscles:family.muscles, goals:family.goals,
        prescription:prescriptionFor(slug,family.key,difficulty),
        instructions:['Set up in a stable position with enough clear space.','Begin slowly and maintain a comfortable breathing rhythm.','Use only the range and speed you can control.','Return to the start position before the next repetition or interval.'],
        phases:phaseSet(family.key),
        coachingCues:['Move with control and keep breathing.','Keep the movement smooth rather than rushing.','Use an easier variation whenever technique becomes inconsistent.'],
        commonErrors:['Moving too quickly to maintain control.','Using more range than can be managed comfortably.','Holding the breath unnecessarily.'],
        regressions:[], progressions:[], substitutions:[], easierText:'Reduce the range, use support or select an earlier exercise in this family.', harderText:'Increase control, range or leverage only after the current version is consistent.',
        detection:{support:HOLD_IDS.has(slug)||DURATION_FAMILIES.has(family.key)?'timer-guided':'manual-only'},
        safety:{notes:safetyNotes(difficulty,impact)}
      });
    });
  }
  for(const family of FAMILY_DEFINITIONS){
    const ids=family.names.map(([slug])=>`ex-${slug}`);
    ids.forEach((id,index)=>{
      const exercise=exercises.find(item=>item.id===id);
      exercise.regressions=index>0?[ids[index-1]]:[];
      exercise.progressions=index<ids.length-1?[ids[index+1]]:[];
      exercise.substitutions=ids.filter(other=>other!==id).slice(Math.max(0,index-1),Math.max(0,index-1)+2);
    });
  }
  return exercises;
}

export function createFallbackProgrammes(){
  const item=(exerciseId,phase='main',metric='reps',target=8,sets=2,restSeconds=45)=>({exerciseId,phase,metric,target,sets,restSeconds});
  return [
    {id:'fallback-foundation',name:'Foundation 20',description:'A calm, low-impact full-body session.',goal:'foundation',level:'foundation',durationMinutes:20,items:[item('ex-march-in-place','warmup','duration',45,1,30),item('ex-cat-cow','warmup','reps',6,1),item('ex-chair-sit-to-stand'),item('ex-wall-push-up'),item('ex-glute-bridge'),item('ex-dead-bug','main','repsPerSide',6),item('ex-supported-single-leg-balance','main','hold',15),item('ex-thoracic-open-book','cooldown','repsPerSide',5,1)]},
    {id:'fallback-strength',name:'Full-Body Strength 30',description:'Balanced squat, push, hinge, pull and core work.',goal:'strength',level:'beginner',durationMinutes:30,items:[item('ex-cross-crawl-march','warmup','duration',45,1,30),item('ex-bodyweight-squat'),item('ex-low-incline-push-up'),item('ex-bodyweight-good-morning'),item('ex-table-row'),item('ex-forearm-plank','main','hold',20),item('ex-thoracic-open-book','cooldown','repsPerSide',5,1)]},
    {id:'fallback-mobility',name:'Mobility Reset 15',description:'Controlled mobility for the spine, hips, ankles and shoulders.',goal:'mobility',level:'foundation',durationMinutes:15,items:[item('ex-supine-breathing-brace','warmup','hold',30,1),item('ex-cat-cow'),item('ex-thoracic-open-book','main','repsPerSide',6,1),item('ex-hip-flexor-rock','main','repsPerSide',6,1),item('ex-ankle-rocker','main','repsPerSide',8,1),item('ex-shoulder-wall-slide','main','reps',8,1),item('ex-child-s-pose-reach','cooldown','duration',30,1,30)]}
  ];
}
