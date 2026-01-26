export const onRequest: PagesFunction = async (ctx) => {
  const env = ctx.env as Record<string, unknown>;
  const body = JSON.stringify(
    {
      hasSessionSecret: Boolean(env && (env as any).SESSION_SECRET),
      hasDiscordConfig: Boolean(env && (env as any).DISCORD_CLIENT_ID && (env as any).DISCORD_CLIENT_SECRET),
      nodeCompat: Boolean((globalThis as any).process && (globalThis as any).process.version),
    },
    null,
    2
  );
  return new Response(body, {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};