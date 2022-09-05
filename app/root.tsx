import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import styles from "./tailwind.css";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import Sidebar from "~/components/navigation/sidebar";
import { getSession } from "~/sessions";
import { EnsureThemeApplied, ThemeProvider, useTheme } from "~/utils/providers/theme-provider";
import { classNames } from "~/utils";

export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
};

type LoaderData = {
  site_name: string;
  data_center: string;
  world: string;
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("data_center") && session.has("world")) {
    return json({
      data_center: session.get("data_center"),
      world: session.get("world"),
    });
  }
  // @todo set safe default for DC and world
  return json<LoaderData>({
    site_name: (context.SITE_NAME as string) ?? "Saddlebag",
    data_center: session.has("data_center") ? session.get("data_center") : "Aether",
    world: session.has("world") ? session.get("world") : "Adamantoise",
  });
};

export const meta: MetaFunction = ({ data }) => {
  const { site_name } = data;
  return {
    charset: "utf-8",
    title: site_name,
    viewport: "width=device-width,initial-scale=1",
    description:
      "SaddleBag Exchange is a data analysis engine for the Final Fantasy 14 marketplace!",
  };
};

function App() {
  const data = useLoaderData<LoaderData>();
  const [theme] = useTheme();

  return (
    <html lang="en" className={classNames(`h-full`, theme || "")}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-WH4KFG5');`,
          }}
        />
        <Meta />
        <Links />
        <EnsureThemeApplied />
      </head>
      <body className={`h-full bg-gray-100 dark:bg-slate-900`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WH4KFG5"
            height="0"
            width="0"
            className={`hidden invisible`}
          ></iframe>
        </noscript>
        <Sidebar data={data}>
          <Outlet />
        </Sidebar>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function AppWithTheme() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
