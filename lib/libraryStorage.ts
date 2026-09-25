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
  blob: Blob;
};

const DB_NAME = "datam-library";
const STORE_NAME = "materials";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function listLibraryFiles(): Promise<StoredLibraryFile[]> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve((request.result as StoredLibraryFile[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    request.onerror = () => reject(request.error);
  });
}

export async function saveLibraryFile(file: StoredLibraryFile) {
  const database = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const request = database.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(file);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteLibraryFile(id: string) {
  const database = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const request = database.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
