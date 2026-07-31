const DB_NAME = 'calisthenics-coach';
const DB_VERSION = 1;
const STORES = ['sessions', 'customProgrammes', 'preferences'];

export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains('sessions')) {
        const sessions = database.createObjectStore('sessions', { keyPath: 'id' });
        sessions.createIndex('completedAt', 'completedAt');
      }
      if (!database.objectStoreNames.contains('customProgrammes')) database.createObjectStore('customProgrammes', { keyPath: 'id' });
      if (!database.objectStoreNames.contains('preferences')) database.createObjectStore('preferences', { keyPath: 'key' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function runRequest(storeName, mode, operation) {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    let request;
    let requestResult;
    try { request = operation(store); }
    catch (error) { database.close(); reject(error); return; }
    request.onsuccess = () => { requestResult = request.result; };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => { database.close(); resolve(requestResult); };
    tx.onerror = () => { database.close(); reject(tx.error); };
    tx.onabort = () => { database.close(); reject(tx.error ?? new Error('IndexedDB transaction aborted.')); };
  });
}

export const db = {
  getAll(storeName) { return runRequest(storeName, 'readonly', store => store.getAll()); },
  get(storeName, key) { return runRequest(storeName, 'readonly', store => store.get(key)); },
  put(storeName, value) { return runRequest(storeName, 'readwrite', store => store.put(value)); },
  delete(storeName, key) { return runRequest(storeName, 'readwrite', store => store.delete(key)); },
  clear(storeName) { return runRequest(storeName, 'readwrite', store => store.clear()); },
  async getPreference(key, fallback = null) { const value = await this.get('preferences', key); return value?.value ?? fallback; },
  setPreference(key, value) { return this.put('preferences', { key, value, updatedAt: new Date().toISOString() }); },
  async exportAll() {
    const [sessions, customProgrammes, preferences] = await Promise.all(STORES.map(store => this.getAll(store)));
    return { app:'Calisthenics.Coach', schemaVersion:1, exportedAt:new Date().toISOString(), sessions, customProgrammes, preferences };
  },
  async importAll(payload) {
    if (!payload || payload.app !== 'Calisthenics.Coach' || payload.schemaVersion !== 1) throw new Error('Unsupported Calisthenics.Coach backup file.');
    for (const storeName of STORES) {
      const rows = Array.isArray(payload[storeName]) ? payload[storeName] : [];
      await this.clear(storeName);
      for (const row of rows) await this.put(storeName, row);
    }
  },
  async deleteAll() { for (const store of STORES) await this.clear(store); }
};
