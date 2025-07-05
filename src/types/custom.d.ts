// Custom global type declarations

// 1. Vite worker import (e.g. "foo?worker")
// These modules export a constructor that returns a new Worker instance.
declare module "*?worker" {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}

declare module "*?worker&inline" {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}

// 2. Fix for monaco-editor workers when using vite-plugin-monaco-editor
// The import paths already match the above wildcard modules.

// 3. Ensure ImportMeta has the 'glob' helper typed (should already be from vite/client, but keep for safety)
interface ImportMeta {
  readonly glob: ImportMetaGlob;
}