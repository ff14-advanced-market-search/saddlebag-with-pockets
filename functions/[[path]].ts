import "./global-shim";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import type { PagesFunction } from "@cloudflare/workers-types";

let cachedHandler: PagesFunction | null = null;
let cacheError: Error | null = null;

async function getHandler(env: Record<string, unknown>): Promise<PagesFunction> {
  // Ensure runtime env is visible to build-time code that reads process.env
  (globalThis as any).process = { env };

  if (cacheError) {
    throw cacheError;
  }

  if (!cachedHandler) {
    try {
      const build = await import("../build/server/index.js");
      cachedHandler = createPagesFunctionHandler({
        build,
        mode: (env && (env as any).NODE_ENV) || "production",
        getLoadContext: (context) => ({
          cloudflare: context.env,
          env: context.env,
        }),
      });
    } catch (err) {
      cacheError = err instanceof Error ? err : new Error(String(err));
      throw cacheError;
    }
  }

  return cachedHandler;
}

export const onRequest: PagesFunction = async (context) => {
  const handler = await getHandler(context.env as Record<string, unknown>);
  return handler(context);
};
