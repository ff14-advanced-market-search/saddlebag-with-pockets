import type {LoaderFunction, MetaFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import styles from './tailwind.css'
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData,} from "@remix-run/react";
import {DataCenters, Regions, Worlds} from "~/utils/locations";
import Sidebar from "~/components/navigation/sidebar";

export const links = () => {
    return [{
        rel: "stylesheet",
        href: styles
    }]
}


export const loader: LoaderFunction = async () => {
    return json({
        site_name: process.env.SITE_NAME ?? "Saddlebag",
        // proof of concept v
        regions: Regions,
        data_centers: DataCenters,
        worlds: Worlds,
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

export default function App() {
    const data = useLoaderData();

    return (
        <html lang="en" className={`h-full bg-gray-100`}>
        <head>
            <Meta/>
            <Links/>
        </head>
        <body className={`h-full`}>

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
