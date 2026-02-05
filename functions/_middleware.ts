export const onRequest: PagesFunction = async (ctx) => {
  try {
    return await ctx.next();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(`Internal error: ${msg}`, {
      status: 500,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
};