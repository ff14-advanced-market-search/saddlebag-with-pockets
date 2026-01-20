import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";

// Polyfill `global` for Cloudflare Workers before loading the server bundle
const globalRef = globalThis as typeof globalThis & { global?: typeof globalThis };
if (!globalRef.global) {
  globalRef.global = globalRef;
}

// @ts-expect-error - Vite generates this from the build output
const build = await import("../build/server/index.js");

const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV || "production",
  getLoadContext: (context) => ({
    cloudflare: context.env,
    env: context.env,
  }),
});

export function onRequest(context) {
  return handleRequest(context);
}
