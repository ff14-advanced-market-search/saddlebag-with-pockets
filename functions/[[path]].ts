import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
// @ts-expect-error - Vite generates this from the build output
import * as build from "../build/server/index.js";

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
