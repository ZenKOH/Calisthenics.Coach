/* Compatibility and resilience layer for Calisthenics.Coach 1.1.0. */
(function repairBootstrap(){
  const memory={sessions:[],customProgrammes:[],preferences:[]};
  const STORAGE_KEY='calisthenics-coach-fallback-v1';
  function loadMemory(){try{const value=localStorage.getItem(STORAGE_KEY);if(value)Object.assign(memory,JSON.parse(value));}catch{}}
  function saveMemory(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(memory));}catch{}}
  loadMemory();
  const primary=window.db;
  const fallback={
    async getAll(store){return structuredClone(memory[store]??[]);},
    async get(store,key){return structuredClone((memory[store]??[]).find(row=>(row.id??row.key)===key));},
    async put(store,value){const rows=memory[store]??(memory[store]=[]),key=value.id??value.key,index=rows.findIndex(row=>(row.id??row.key)===key);if(index>=0)rows[index]=structuredClone(value);else rows.push(structuredClone(value));saveMemory();return key;},
    async delete(store,key){memory[store]=(memory[store]??[]).filter(row=>(row.id??row.key)!==key);saveMemory();},
    async clear(store){memory[store]=[];saveMemory();},
    async getPreference(key,defaultValue=null){return (await this.get('preferences',key))?.value??defaultValue;},
    async setPreference(key,value){return this.put('preferences',{key,value,updatedAt:new Date().toISOString()});},
    async exportAll(){return{app:'Calisthenics.Coach',schemaVersion:1,exportedAt:new Date().toISOString(),sessions:await this.getAll('sessions'),customProgrammes:await this.getAll('customProgrammes'),preferences:await this.getAll('preferences')};},
    async importAll(payload){if(!payload||payload.app!=='Calisthenics.Coach'||payload.schemaVersion!==1)throw new Error('Unsupported Calisthenics.Coach backup file.');for(const store of ['sessions','customProgrammes','preferences'])memory[store]=structuredClone(Array.isArray(payload[store])?payload[store]:[]);saveMemory();},
    async deleteAll(){for(const store of ['sessions','customProgrammes','preferences'])memory[store]=[];saveMemory();}
  };
  function resilientMethod(name){return async(...args)=>{try{return await primary[name](...args);}catch(error){console.warn(`IndexedDB ${name} failed; using local fallback.`,error);return fallback[name](...args);}};}
  window.db={};
  for(const name of ['getAll','get','put','delete','clear','getPreference','setPreference','exportAll','importAll','deleteAll'])window.db[name]=resilientMethod(name);

  async function fetchJson(url){const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw new Error(`${url} returned ${response.status}`);return response.json();}
  async function loadCompressedCatalogue(){
    if(!('DecompressionStream'in window))throw new Error('The browser has no gzip stream decoder.');
    const index=await fetchJson('./content/catalogue-index.json');
    if(!Array.isArray(index.parts)||!index.parts.length)throw new Error('The catalogue index is invalid.');
    const buffers=await Promise.all(index.parts.map(async part=>{const response=await fetch(`./content/${String(part).replace('./','')}`,{cache:'no-store'});if(!response.ok)throw new Error(`Catalogue part ${part} returned ${response.status}`);return response.arrayBuffer();}));
    const size=buffers.reduce((sum,buffer)=>sum+buffer.byteLength,0),joined=new Uint8Array(size);let offset=0;
    for(const buffer of buffers){joined.set(new Uint8Array(buffer),offset);offset+=buffer.byteLength;}
    const stream=new Blob([joined]).stream().pipeThrough(new DecompressionStream('gzip'));
    const payload=JSON.parse(await new Response(stream).text());
    if(!Array.isArray(payload.exercises)||payload.exercises.length<24)throw new Error('The decoded catalogue is incomplete.');
    return payload.exercises;
  }
  async function loadCatalogue(){
    try{const payload=await fetchJson('./content/exercises.json');if(Array.isArray(payload.exercises)&&payload.exercises.length)return{exercises:payload.exercises,source:'plain catalogue'};}catch(error){console.info('Plain catalogue unavailable.',error.message);}
    try{return{exercises:await loadCompressedCatalogue(),source:'compressed catalogue'};}catch(error){console.warn('Compressed catalogue unavailable; using compatibility catalogue.',error);}
    return{exercises:createFallbackCatalogue(),source:'compatibility catalogue'};
  }
  async function loadProgrammeData(){
    try{const payload=await fetchJson('./content/programmes.json');if(Array.isArray(payload.programmes)&&payload.programmes.length)return payload.programmes;}catch(error){console.warn('Programme templates unavailable; using local templates.',error);}
    return createFallbackProgrammes();
  }

  window.loadData=async function loadData(){
    const [catalogue,programmes]=await Promise.all([loadCatalogue(),loadProgrammeData()]);
    state.exercises=catalogue.exercises;
    state.exerciseMap=new Map(state.exercises.map(exercise=>[exercise.id,exercise]));
    state.programmes=programmes.filter(programme=>programme.items?.every(item=>state.exerciseMap.has(item.exerciseId)));
    if(!state.programmes.length)state.programmes=createFallbackProgrammes();
    state.customProgrammes=await db.getAll('customProgrammes');
    state.sessions=(await db.getAll('sessions')).sort((a,b)=>String(b.completedAt).localeCompare(String(a.completedAt)));
    state.settings={voice:await db.getPreference('voice',true),sound:await db.getPreference('sound',true),reducedMotion:await db.getPreference('reducedMotion',false)};
    state.workout=new WorkoutEngine(state.exerciseMap);
    const version=document.getElementById('appVersion');if(version)version.textContent='1.1.0';
    document.documentElement.dataset.catalogueSource=catalogue.source;
  };

  window.addEventListener('error',event=>{console.error('Application error',event.error??event.message);});
  window.addEventListener('unhandledrejection',event=>{console.error('Unhandled application rejection',event.reason);});
})();
