// IndexedDB-based session history for DocuSûr — 100% local, zero server

const DB_NAME = 'docusur-history';
const STORE_NAME = 'sessions';
const DB_VERSION = 1;
const MAX_AGE_MS = 60 * 60 * 1000; // 1 hour

export interface HistoryEntry {
  id: string;
  fileName: string;
  toolId: string;
  toolName: string;
  timestamp: number;
  fileSize: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function addHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.add({
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  });
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getRecentHistory(): Promise<HistoryEntry[]> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const all: HistoryEntry[] = await new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  const cutoff = Date.now() - MAX_AGE_MS;
  return all.filter(e => e.timestamp >= cutoff).sort((a, b) => b.timestamp - a.timestamp);
}

export async function clearHistory(): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).clear();
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function purgeExpired(): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const cutoff = Date.now() - MAX_AGE_MS;
  const all: HistoryEntry[] = await new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  all.filter(e => e.timestamp < cutoff).forEach(e => store.delete(e.id));
}