import {Form, useActionData} from "@remix-run/react";
import type {ActionFunction} from "@remix-run/cloudflare";
import {getUserSessionData} from "~/sessions";
import type {FullScanFields} from "~/requests/FullScan";
import FullScanRequest, {RunTimeFullScanForm} from "~/requests/FullScan";
import type {ErrorBoundaryComponent} from "@remix-run/cloudflare";
import {classNames} from "~/utils";
import {useState} from "react";
import FullScanResultTable from "~/routes/queries/FullScanResultTable";

export const action: ActionFunction = async ({request, params}) => {
    const formData = await request.formData();
    const session = await getUserSessionData(request);

    formData.append('world', session.getWorld());

    const typedFormData = new RunTimeFullScanForm<FullScanFields>(Object.fromEntries(formData) as unknown as FullScanFields)

    console.log('sending request');
    const scan = FullScanRequest(typedFormData);
    return await scan.then((response) => response.json()).then((data) => {
        // return null;
        // console.log('req result', data);
        return Object.entries(data).map((entry: [string, any]) => {
            console.log('entry', entry);
            return {
                id: parseInt(entry[0]), ...entry[1]
            }
        })
    }).catch((error) => {
        console.log(error);
        return error;
    });

}

export const ErrorBoundary: ErrorBoundaryComponent = ({error}) => {
    console.error('errorBoundary', error);
    return <pre>{JSON.stringify(error.message)}</pre>
}

const FullScan = () => {
    const results = useActionData();
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const onSubmit = (e: MouseEvent) => {
        if(isRunning){
            e.preventDefault();
        }else {
            setIsRunning(true);
        }
    }

    if (results) {
        return <FullScanResultTable rows={results}/>
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
                                                defaultValue={10}
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
                                                defaultValue={10}
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
                            className={classNames( isRunning ? 'bg-gray-500' : 'bg-blue-500', "cursor-pointer ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500")}
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
