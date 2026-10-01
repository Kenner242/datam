export type StoredLibraryFile = {
  id: string;
  name: string;
  type: string;
  mimeType: string;
  size: number;
  text: string;
  summary: string;
  concepts: string[];
  missions: string[];
  flashcards: { term: string; definition: string }[];
  analysisWarnings?: string[];
  createdAt: string;
  deletedAt?: string;
  blob: Blob;
};

const DB_NAME = "datam-library";
const STORE_NAME = "materials";
const TRASH_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAllRecords(): Promise<StoredLibraryFile[]> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result as StoredLibraryFile[]);
    request.onerror = () => reject(request.error);
  });
}

async function purgeExpiredTrash(records: StoredLibraryFile[]) {
  const cutoff = Date.now() - TRASH_RETENTION_MS;
  const expired = records.filter((record) => record.deletedAt && new Date(record.deletedAt).getTime() < cutoff);
  await Promise.all(expired.map((record) => deleteLibraryFile(record.id)));
  return expired.map((record) => record.id);
}

export async function listLibraryFiles(): Promise<StoredLibraryFile[]> {
  const records = await getAllRecords();
  const expiredIds = await purgeExpiredTrash(records);
  return records.filter((record) => !record.deletedAt && !expiredIds.includes(record.id)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listTrashedLibraryFiles(): Promise<StoredLibraryFile[]> {
  const records = await getAllRecords();
  const expiredIds = await purgeExpiredTrash(records);
  return records.filter((record) => record.deletedAt && !expiredIds.includes(record.id)).sort((a, b) => (b.deletedAt ?? "").localeCompare(a.deletedAt ?? ""));
}

export async function saveLibraryFile(file: StoredLibraryFile) {
  const database = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const request = database.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(file);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function softDeleteLibraryFile(id: string) {
  const records = await getAllRecords();
  const record = records.find((item) => item.id === id);
  if (!record) return;
  await saveLibraryFile({ ...record, deletedAt: new Date().toISOString() });
}

export async function restoreLibraryFile(id: string) {
  const records = await getAllRecords();
  const record = records.find((item) => item.id === id);
  if (!record) return;
  const { deletedAt: _removed, ...restored } = record;
  await saveLibraryFile(restored);
}

export async function deleteLibraryFile(id: string) {
  const database = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const request = database.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

