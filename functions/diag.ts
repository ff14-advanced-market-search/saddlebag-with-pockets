import type { PagesFunction } from "@cloudflare/workers-types";

export const onRequest: PagesFunction = async (ctx) => {
  const env = ctx.env as Record<string, unknown>;
  
  let buildStatus = { ok: false, error: "" };
  try {
    await import("../build/server/index.js");
    buildStatus = { ok: true, error: "" };
  } catch (err) {
    buildStatus = {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }

  const body = JSON.stringify(
    {
      hasSessionSecret: Boolean(env && (env as any).SESSION_SECRET),
      hasDiscordConfig: Boolean(
        env &&
          (env as any).DISCORD_CLIENT_ID &&
          (env as any).DISCORD_CLIENT_SECRET
      ),
      nodeCompat: Boolean((globalThis as any).process && (globalThis as any).process.version),
      buildLoads: buildStatus.ok,
      buildError: buildStatus.error || null,
    },
    null,
    2
  );
  return new Response(body, {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};