import {Form, useActionData} from "@remix-run/react";
import type {ActionFunction} from "@remix-run/cloudflare";
import {getUserSessionData} from "~/sessions";
import type {FullScanFields} from "~/requests/FullScan";
import FullScanRequest, {remappedKeys, RunTimeFullScanForm} from "~/requests/FullScan";
import type {ErrorBoundaryComponent} from "@remix-run/cloudflare";
import {classNames} from "~/utils";
import {useState} from "react";
import FullScanResultTable from "~/routes/queries/FullScanResultTable";
// import FullScanResultTable from "~/routes/queries/FullScanResultTable";

export const action: ActionFunction = async ({request, params}) => {
    const formData = await request.formData();
    const session = await getUserSessionData(request);

    formData.append('world', session.getWorld());

    const typedFormData = new RunTimeFullScanForm<FullScanFields>(Object.fromEntries(formData) as unknown as FullScanFields)

    // return Object.fromEntries(typedFormData.formData());

    // const data = remappedKeys(typedFormData.formData());
    return {
        "36612": {
            "R.O.I": 54,
            "avg_ppu": 50637,
            "home_server_price": 54073,
            "home_update_time": "2022-08-29 05:28:19",
            "ppu": 20999,
            "profit_amount": 29320,
            "profit_raw_percent": 132,
            "real_name": "Timeworn Kumbhiraskin Map",
            "sale_rates": "1.9036",
            "server": "Sargatanas - Aether",
            "stack_size": 1,
            "update_time": "2022-08-29 05:58:54",
            "url": "https://universalis.app/market/36612"
        },
        "36714": {
            "R.O.I": 63,
            "avg_ppu": 321296,
            "home_server_price": 231000,
            "home_update_time": "2022-08-29 05:48:26",
            "ppu": 68250,
            "profit_amount": 147787,
            "profit_raw_percent": 206,
            "real_name": "Pactmaker's Coat of Gathering",
            "sale_rates": "0.2945",
            "server": "Midgardsormr - Aether",
            "stack_size": 1,
            "update_time": "2022-08-29 05:51:21",
            "url": "https://universalis.app/market/36714"
        },
        "37746": {
            "R.O.I": 76,
            "avg_ppu": 1068517,
            "home_server_price": 727598,
            "home_update_time": "2022-08-29 06:00:23",
            "ppu": 131250,
            "profit_amount": 553405,
            "profit_raw_percent": 401,
            "real_name": "Rinascita Composite Bow",
            "sale_rates": "0.2720",
            "server": "Jenova - Aether",
            "stack_size": 1,
            "update_time": "2022-08-29 04:31:01",
            "url": "https://universalis.app/market/37746"
        },
        "37762": {
            "R.O.I": 53,
            "avg_ppu": 471031,
            "home_server_price": 463470,
            "home_update_time": "2022-08-29 05:59:34",
            "ppu": 183750,
            "profit_amount": 247359,
            "profit_raw_percent": 128,
            "real_name": "Rinascita Helm of Fending",
            "sale_rates": "0.7928",
            "server": "Midgardsormr - Aether",
            "stack_size": 1,
            "update_time": "2022-08-29 05:55:30",
            "url": "https://universalis.app/market/37762"
        },
        "37763": {
            "R.O.I": 60,
            "avg_ppu": 620868,
            "home_server_price": 556750,
            "home_update_time": "2022-08-29 06:00:08",
            "ppu": 183750,
            "profit_amount": 335975,
            "profit_raw_percent": 174,
            "real_name": "Rinascita Cuirass of Fending",
            "sale_rates": "0.9604",
            "server": "Midgardsormr - Aether",
            "stack_size": 1,
            "update_time": "2022-08-29 05:53:56",
            "url": "https://universalis.app/market/37763"
        },
        "37764": {
            "R.O.I": 63,
            "avg_ppu": 393198,
            "home_server_price": 517141,
            "home_update_time": "2022-08-29 05:54:48",
            "ppu": 157500,
            "profit_amount": 325908,
            "profit_raw_percent": 197,
            "real_name": "Rinascita Vambraces of Fending",
            "sale_rates": "0.9599",
            "server": "Midgardsormr - Aether",
            "stack_size": 1,
            "update_time": "2022-08-29 05:53:45",
            "url": "https://universalis.app/market/37764"
        },
        "37765": {
            "R.O.I": 54,
            "avg_ppu": 572499,
            "home_server_price": 471251,
            "home_update_time": "2022-08-29 05:54:54",
            "ppu": 182700,
            "profit_amount": 255853,
            "profit_raw_percent": 133,
            "real_name": "Rinascita Poleyns of Fending",
            "sale_rates": "0.7634",
            "server": "Midgardsormr - Aether",
            "stack_size": 1,
            "update_time": "2022-08-29 06:03:31",
            "url": "https://universalis.app/market/37765"
        },
        "37766": {
            "R.O.I": 54,
            "avg_ppu": 634782,
            "home_server_price": 478785,
            "home_update_time": "2022-08-29 05:55:08",
            "ppu": 183750,
            "profit_amount": 261908,
            "profit_raw_percent": 135,
            "real_name": "Rinascita Sabatons of Fending",
            "sale_rates": "0.7087",
            "server": "Midgardsormr - Aether",
            "stack_size": 1,
            "update_time": "2022-08-29 05:54:55",
            "url": "https://universalis.app/market/37766"
        },
        "37802": {
            "R.O.I": 55,
            "avg_ppu": 443416,
            "home_server_price": 419989,
            "home_update_time": "2022-08-29 05:58:41",
            "ppu": 157500,
            "profit_amount": 233614,
            "profit_raw_percent": 141,
            "real_name": "Rinascita Necklace of Fending",
            "sale_rates": "0.8783",
            "server": "Midgardsormr - Aether",
            "stack_size": 1,
            "update_time": "2022-08-29 05:52:28",
            "url": "https://universalis.app/market/37802"
        },
        "37807": {
            "R.O.I": 52,
            "avg_ppu": 255212,
            "home_server_price": 309160,
            "home_update_time": "2022-08-29 05:55:28",
            "ppu": 126000,
            "profit_amount": 161402,
            "profit_raw_percent": 121,
            "real_name": "Rinascita Bracelet of Fending",
            "sale_rates": "0.9621",
            "server": "Midgardsormr - Aether",
            "stack_size": 1,
            "update_time": "2022-08-29 05:53:13",
            "url": "https://universalis.app/market/37807"
        }
    };
    // return await FullScanRequest(data);
    // return await scan;

}

export const ErrorBoundary: ErrorBoundaryComponent = ({error}) => {
    console.error('errorBoundary', error);
    return <pre>{JSON.stringify(error.message)}</pre>
}

const FullScan = () => {
    const results = useActionData();
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const onSubmit = (e: MouseEvent) => {
        if (isRunning) {
            e.preventDefault();
        } else {
            setIsRunning(true);
        }
    }

    if (results) {
        console.log(`r`, results);
        const data: Record<string, any> = Object.entries(results).map((entry: [string, any]) => {
            return {id: parseInt(entry[0]), ...entry[1]};
        });

        return <FullScanResultTable rows={data}/>
    }
    return <main className="flex-1">
        <div className="py-6">

            <Form method="post">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900 py-6">Full Scan</h1>
                    <div className="mt-5 md:mt-0 md:col-span-2 py-6">
                        <div className="shadow overflow-hidden sm:rounded-md">
                            <div className="px-4 py-5 bg-white sm:p-6">
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6 sm:col-span-2">
                                        <label htmlFor="scan-hours" className="block text-sm font-medium text-gray-700">
                                            Scan Hours
                                        </label>
                                        <div className={`mt-1 flex rounded-md shadow-sm`}>
                                            <input
                                                type="number"
                                                id="scan-hours"
                                                defaultValue={24}
                                                name="scan_hours"
                                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            />
                                            <span
                                                className={`inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm`}>
                                                hours
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            The time period to search over. ex: <code>24</code> is the past 24 hours.
                                            For more items to sell choose a higher number.
                                        </p>
                                    </div>
                                    <div className="col-span-6 sm:col-span-2">
                                        <label htmlFor="sale-amt" className="block text-sm font-medium text-gray-700">
                                            Sale Amount
                                        </label>
                                        <input
                                            type="number"
                                            id="sale-amt"
                                            defaultValue={5}
                                            name="sale_amount"
                                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                        <p className="mt-2 text-sm text-gray-500">
                                            Number of sales in that time. ex: `5` is 5 sales in that selected time
                                            period. For more items to sell choose a lower number.
                                        </p>
                                    </div>

                                    <div className="col-span-6 sm:col-span-2">
                                        <label htmlFor="roi" className="block text-sm font-medium text-gray-700">
                                            Return on Investment
                                        </label>
                                        <div className={`mt-1 flex rounded-md shadow-sm`}>
                                            <input
                                                type="number"
                                                name="roi"
                                                defaultValue={50}
                                                id="roi"
                                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            />
                                            <span
                                                className={`inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm`}>
                                                %
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Desired R.O.I (return on investment): ex: `50` means that 50% of the revenue
                                            you get from a sale should be all profit (after tax). For more profit,
                                            choose a higher number from 1 to 100.
                                        </p>
                                    </div>
                                    <div className="col-span-6 sm:col-span-2">
                                        <label htmlFor="minimum_stack_size"
                                               className="block text-sm font-medium text-gray-700">
                                            Minimum Stack Size
                                        </label>
                                        <div className={`mt-1 flex rounded-md shadow-sm`}>
                                            <input
                                                type="number"
                                                name="minimum_stack_size"
                                                defaultValue={1}
                                                id="minimum_stack_size"
                                                className="flex-1 min-w-0 block w-full px-3 py-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Desired Min Stack Size. ex: `10` is only show deals you can get in stacks of
                                            10 or greater. For more items to sell choose a lower number.
                                        </p>
                                    </div>

                                    <div className="col-span-6 sm:col-span-2">
                                        <label htmlFor="minimum_profit_amount"
                                               className="block text-sm font-medium text-gray-700">
                                            Minimum Profit Amount
                                        </label>
                                        <div className={`mt-1 flex rounded-md shadow-sm`}>
                                            <input
                                                type="number"
                                                name="minimum_profit_amount"
                                                defaultValue={10000}
                                                id="minimum_profit_amount"
                                                className="flex-1 min-w-0 block w-full px-3 py-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Desired Min Profit Amount. ex: `10000` is only show deals that yields 10000
                                            gil profit or greater. For more items to sell choose a lower number.
                                        </p>
                                    </div>

                                    <div className="col-span-6 sm:col-span-2">
                                        <label htmlFor="price_per_unit"
                                               className="block text-sm font-medium text-gray-700">
                                            Average Price Per Unit
                                        </label>
                                        <div className={`mt-1 flex rounded-md shadow-sm`}>
                                            <input
                                                type="number"
                                                name="price_per_unit"
                                                defaultValue={10000}
                                                id="price_per_unit"
                                                className="flex-1 min-w-0 block w-full px-3 py-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Desired Average Price Per Unit. ex: `10000` is only show deals that sell on
                                            average for 10000 gil or greater. For more items to sell choose a lower
                                            number.
                                        </p>
                                    </div>

                                    <div className="col-span-6 sm:col-span-2">
                                        <fieldset className="space-y-5">
                                            <legend className="sr-only">Force HQ only</legend>
                                            <div className="relative flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        id="hq_only"
                                                        aria-describedby="comments-description"
                                                        name="hq_only"
                                                        type="checkbox"
                                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label htmlFor="hq_only" className="font-medium text-gray-700">
                                                        Enable HQ only
                                                    </label>
                                                    <p className="mt-2 text-sm text-gray-500">
                                                        Only search for hq prices
                                                    </p>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>

                                    <div className="col-span-6 sm:col-span-2">
                                        <fieldset className="space-y-5">
                                            <legend className="sr-only">Region Wide Search</legend>
                                            <div className="relative flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        id="region_wide"
                                                        aria-describedby="comments-description"
                                                        name="region_wide"
                                                        type="checkbox"
                                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label htmlFor="region_wide" className="font-medium text-gray-700">
                                                        Region Wide Search
                                                    </label>
                                                    <p className="mt-2 text-sm text-gray-500">
                                                        Search all servers in all DataCenters in your region.
                                                    </p>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>

                                    <div className="col-span-6 sm:col-span-2">
                                        <fieldset className="space-y-5">
                                            <legend className="sr-only">Include Vendor Prices</legend>
                                            <div className="relative flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        id="include_vendor"
                                                        aria-describedby="comments-description"
                                                        name="include_vendor"
                                                        type="checkbox"
                                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label htmlFor="include_vendor"
                                                           className="font-medium text-gray-700">
                                                        Include Vendor Prices
                                                    </label>
                                                    <p className="mt-2 text-sm text-gray-500">
                                                        Compare market prices vs vendor prices on NQ items that can be
                                                        purchased from vendors.
                                                    </p>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>

                                    <div className="col-span-6 sm:col-span-2">
                                        <fieldset className="space-y-5">
                                            <legend className="sr-only">Include Out of Stock</legend>
                                            <div className="relative flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        id="out_of_stock"
                                                        aria-describedby="comments-description"
                                                        name="out_of_stock"
                                                        type="checkbox"
                                                        defaultChecked={true}
                                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label htmlFor="out_of_stock" className="font-medium text-gray-700">
                                                        Include Out of Stock
                                                    </label>
                                                    <p className="mt-2 text-sm text-gray-500">
                                                        Include out of stock items from the list (they will show up as
                                                        having 100% profit margins and 1 bil gil profit).
                                                    </p>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>


                                </div>

                            </div>
                        </div>
                    </div>


                    <div className="flex justify-end">
                        <button
                            type="submit"
                            onClick={onSubmit}
                            className={classNames(isRunning ? 'bg-gray-500' : 'bg-blue-600', "cursor-pointer ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500")}
                        >
                            {isRunning && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                               xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>}
                            Search
                        </button>
                    </div>
                </div>

            </Form>
        </div>
    </main>
}

export default FullScan;
