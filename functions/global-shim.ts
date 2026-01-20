// Lightweight shims so worker dependencies that expect a Node-like global do not throw.
const globalScope: any = globalThis;

if (!globalScope.global) {
  globalScope.global = globalScope;
}

if (!globalScope.window) {
  globalScope.window = globalScope;
}

if (!globalScope.self) {
  globalScope.self = globalScope;
}

if (!globalScope.process) {
  globalScope.process = { env: {} };
}

// Provide a minimal matchMedia stub to satisfy browser-only checks during SSR
if (!globalScope.matchMedia) {
  globalScope.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false
  });
}

export {};
