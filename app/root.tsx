import type {LoaderFunction, MetaFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import styles from './tailwind.css'
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration,} from "@remix-run/react";
import {DataCenters, Regions, Worlds} from "~/utils/locations";

export const links = () => {
    return [{
        rel: "stylesheet",
        href: styles
    }]
}


export const loader: LoaderFunction = async () => {
    return json({
        site_name: process.env.SITE_NAME ?? "Saddlebag",
        regions: Regions(),
        data_centers: DataCenters(),
        worlds: Worlds(),
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

    return (
        <html lang="en">
        <head>
            <Meta/>
            <Links/>
        </head>
        <body>
        <Outlet/>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
        </body>
        </html>
    );
}
