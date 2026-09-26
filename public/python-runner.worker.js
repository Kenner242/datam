"use strict";

const PYODIDE_INDEX = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/";
let runtimePromise;
let runtime;

async function getRuntime() {
  if (!runtimePromise) {
    importScripts(`${PYODIDE_INDEX}pyodide.js`);
    runtimePromise = self.loadPyodide({ indexURL: PYODIDE_INDEX }).then((instance) => {
      runtime = instance;
      return instance;
    });
  }
  return runtimePromise;
}

self.onmessage = async (event) => {
  const { id, code } = event.data ?? {};
  if (typeof id !== "number" || typeof code !== "string") return;

  try {
    self.postMessage({ id, state: "loading" });
    const pyodide = await getRuntime();
    self.postMessage({ id, state: "running" });
    pyodide.globals.set("_datam_source", code);
    const result = await pyodide.runPythonAsync(`
import contextlib as _contextlib
import ast as _ast
import io as _io
import json as _json

_datam_stdout = _io.StringIO()
_datam_stderr = _io.StringIO()
_datam_allowed_imports = {"asyncio", "functools", "itertools", "json", "math", "random", "unittest"}
_datam_original_import = __import__
def _datam_safe_import(name, globals=None, locals=None, fromlist=(), level=0):
  if name.split(".", 1)[0] not in _datam_allowed_imports:
    raise ImportError(f"El módulo {name!r} no está disponible en el laboratorio DataM.")
  return _datam_original_import(name, globals, locals, fromlist, level)

_datam_builtins = dict(vars(__builtins__)) if not isinstance(__builtins__, dict) else dict(__builtins__)
_datam_builtins["__import__"] = _datam_safe_import
_datam_scope = {"__name__": "__main__", "__builtins__": _datam_builtins}
_datam_error = None
try:
    with _contextlib.redirect_stdout(_datam_stdout), _contextlib.redirect_stderr(_datam_stderr):
      _datam_code = compile(_datam_source, "<DataM>", "exec", flags=_ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
      _datam_result = eval(_datam_code, _datam_scope, _datam_scope)
      if _datam_result is not None:
        await _datam_result
except BaseException as _datam_exception:
    _datam_error = f"{type(_datam_exception).__name__}: {_datam_exception}"

_datam_vars = {}
for _datam_key, _datam_value in _datam_scope.items():
    if not _datam_key.startswith("_") and _datam_key != "__builtins__":
        try:
            _json.dumps(_datam_value)
            _datam_vars[_datam_key] = _datam_value
        except (TypeError, ValueError):
            _datam_vars[_datam_key] = repr(_datam_value)

_json.dumps({
    "output": _datam_stdout.getvalue().splitlines(),
    "stderr": _datam_stderr.getvalue().splitlines(),
    "vars": _datam_vars,
    "error": _datam_error,
})
`);
    const serialized = typeof result === "string" ? result : result.toJs();
    self.postMessage({ id, state: "complete", result: serialized });
    if (result && typeof result.destroy === "function") result.destroy();
    pyodide.globals.delete("_datam_source");
  } catch (error) {
    self.postMessage({ id, state: "error", error: error instanceof Error ? error.message : String(error) });
  }
};