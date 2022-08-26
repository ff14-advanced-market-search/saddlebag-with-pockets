import type {LoaderFunction, MetaFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import styles from './tailwind.css'
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData,} from "@remix-run/react";
import Sidebar from "~/components/navigation/sidebar";
import {getSession} from "~/sessions";
import {EnsureThemeApplied, ThemeProvider, useTheme} from "~/utils/providers/theme-provider";
import {classNames} from "~/utils";

export const links = () => {
    return [{
        rel: "stylesheet",
        href: styles
    }]
}


export const loader: LoaderFunction = async ({request}) => {
    const session = await getSession(request.headers.get('Cookie'));
    if (session.has('data_center') && session.has('world')) {
        return json({
            data_center: session.get('data_center'),
            world: session.get('world'),
        });
    }
    // @todo set safe default for DC and world
    return json({
        site_name: process.env.SITE_NAME ?? "Saddlebag",
        data_center: session.has('data_center') ? session.get('data_center') : 'Aether',
        world: session.has('world') ? session.get('world') : 'Adamantoise'
    })
}

export const meta: MetaFunction = ({data}) => {

    const {site_name} = data;
    return {
        charset: "utf-8",
        title: site_name,
        viewport: "width=device-width,initial-scale=1",
    }
};

function App() {
    const data = useLoaderData();
    const [theme] = useTheme();

    return (
        <html lang="en" className={classNames(`h-full`, theme || '') }>
        <head>
            <Meta/>
            <Links/>
            <EnsureThemeApplied />
        </head>
        <body className={`h-full bg-gray-100 dark:bg-slate-900`}>

        <Sidebar data={data}>
            <Outlet/>
        </Sidebar>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
        </body>
        </html>
    );
}

export default function AppWithTheme() {
    return (
        <ThemeProvider>
            <App />
        </ThemeProvider>
    )
}
