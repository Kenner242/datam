export type PythonRunResult = {
  output: string[];
  stderr: string[];
  vars: Record<string, unknown>;
  error: string | null;
};

type WorkerMessage = {
  id: number;
  state: "loading" | "running" | "complete" | "error";
  result?: string;
  error?: string;
};

type PendingRun = {
  resolve: (result: PythonRunResult) => void;
  reject: (error: Error) => void;
  timeout: ReturnType<typeof setTimeout>;
};

let worker: Worker | null = null;
let nextId = 0;
const pending = new Map<number, PendingRun>();

function rejectAll(error: Error) {
  for (const run of pending.values()) {
    clearTimeout(run.timeout);
    run.reject(error);
  }
  pending.clear();
}

function stopWorker(error: Error) {
  worker?.terminate();
  worker = null;
  rejectAll(error);
}

function getWorker() {
  if (worker) return worker;

  worker = new Worker("/python-runner.worker.js");
  worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
    const message = event.data;
    const run = pending.get(message.id);
    if (!run) return;

    clearTimeout(run.timeout);
    if (message.state === "loading") {
      run.timeout = setTimeout(() => stopWorker(new Error("Python tardó demasiado en iniciar. Comprueba tu conexión e inténtalo otra vez.")), 90_000);
      return;
    }
    if (message.state === "running") {
      run.timeout = setTimeout(() => stopWorker(new Error("La ejecución superó el límite de 6 segundos y se detuvo.")), 6_000);
      return;
    }

    pending.delete(message.id);
    if (message.state === "error" || !message.result) {
      run.reject(new Error(message.error ?? "No se pudo ejecutar el código Python."));
      return;
    }

    try {
      run.resolve(JSON.parse(message.result) as PythonRunResult);
    } catch {
      run.reject(new Error("El intérprete devolvió un resultado que no se pudo leer."));
    }
  };
  worker.onerror = (event) => stopWorker(new Error(event.message || "No se pudo iniciar el intérprete Python."));
  return worker;
}

export function runPython(code: string): Promise<PythonRunResult> {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    const timeout = setTimeout(() => stopWorker(new Error("Python tardó demasiado en iniciar. Comprueba tu conexión e inténtalo otra vez.")), 90_000);
    pending.set(id, { resolve, reject, timeout });
    try {
      getWorker().postMessage({ id, code });
    } catch (error) {
      pending.delete(id);
      clearTimeout(timeout);
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  });
}