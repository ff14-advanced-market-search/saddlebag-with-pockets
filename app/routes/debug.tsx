import {LoaderFunction} from "@remix-run/cloudflare";
import {useLoaderData} from "@remix-run/react";
import {address, UserAgent} from "~/requests/client/config";

export const loader: LoaderFunction = async () => {
    console.log('loader called');
    return fetch(`${address}/api/scan`, {
        'method': 'POST', headers: {
            "Content-Type": "application/json", "User-Agent": UserAgent
        }, body: JSON.stringify({
            "preferred_roi": 50,
            "min_profit_amount": 10000,
            "min_desired_avg_ppu": 100000,
            "min_stack_size": 1,
            "hours_ago": 24,
            "min_sales": 5,
            "hq": false,
            "home_server": "Adamantoise",
            "filters": "all",
            "region_wide": false,
            "include_vendor": false,
            "show_out_stock": true
        })
    });
}

const debug = () => {
    const data = useLoaderData();
    console.log('data', data);
    return <div>
        <h1>hi</h1>
        <pre>{JSON.stringify(data)}</pre>
    </div>
}

export default debug;
