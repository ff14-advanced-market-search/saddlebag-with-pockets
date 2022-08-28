import {Form, useActionData} from "@remix-run/react";
import type {ActionFunction} from "@remix-run/node";
import {getUserSessionData} from "~/sessions";
import type {FullScanFields} from "~/requests/FullScan";
import FullScanRequest, { RunTimeFullScanForm, validator} from "~/requests/FullScan";
import type {ErrorBoundaryComponent} from "@remix-run/node";





export const action: ActionFunction = async ({request, params}) => {
    const formData = await request.formData();
    const session = await getUserSessionData(request);

    formData.append('world', session.getWorld());

    const typedFormData = new RunTimeFullScanForm<FullScanFields>(Object.fromEntries(formData) as unknown as FullScanFields)


    const result = await validator.validate(typedFormData);
    console.log('result', result);
    // const req = FullScanRequest(typedFormData);
    // req.catch((err) => {
    //     console.log(err.response);
    // });
    return null;
    return await FullScanRequest(typedFormData);
}

export const ErrorBoundary: ErrorBoundaryComponent = ({error}) => {
    console.error(error);
    return <p>err</p>
}

const FullScan = () => {
    const results = useActionData();
    if(results){
        console.log(results.Data);
        return <pre>{JSON.stringify(results)}</pre>;
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
                                        <label htmlFor="minimum_stack_size" className="block text-sm font-medium text-gray-700">
                                            Minimum Stack Size
                                        </label>
                                        <div className={`mt-1 flex rounded-md shadow-sm`}>
                                            <input
                                                type="number"
                                                name="minimum_stack_size"
                                                defaultValue={10}
                                                id="minimum_stack_size"
                                                className="flex-1 min-w-0 block w-full px-3 py-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Desired Min Stack Size. ex: `10` is only show deals you can get in stacks of 10 or greater. For more items to sell choose a lower number.
                                        </p>
                                    </div>

                                    <div className="col-span-6 sm:col-span-2">
                                        <label htmlFor="minimum_profit_amount" className="block text-sm font-medium text-gray-700">
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
                                            Desired Min Profit Amount. ex: `10000` is only show deals that yields 10000 gil profit or greater. For more items to sell choose a lower number.
                                        </p>
                                    </div>

                                    <div className="col-span-6 sm:col-span-2">
                                        <label htmlFor="price_per_unit" className="block text-sm font-medium text-gray-700">
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
                                            Desired Average Price Per Unit. ex: `10000` is only show deals that sell on average for 10000 gil or greater. For more items to sell choose a lower number.
                                        </p>
                                    </div>

                                    <div className="col-span-6 sm:col-span-2">
                                        <fieldset className="space-y-5">
                                            <legend className="sr-only">HQ</legend>
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
                                                        HQ only? Only search for hq prices
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
                                                        Search all servers in all DataCenters in your region or just search the local DataCenter.
                                                    </p>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>

                                    <div className="col-span-6 sm:col-span-2">
                                        <fieldset className="space-y-5">
                                            <legend className="sr-only">HQ</legend>
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
                                                        Include Vendor Prices
                                                    </label>
                                                    <p className="mt-2 text-sm text-gray-500">
                                                        HQ only? Only search for hq prices
                                                    </p>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>

                                    <div className="col-span-6 sm:col-span-2">
                                        <fieldset className="space-y-5">
                                            <legend className="sr-only">HQ</legend>
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
                                                        HQ only? Only search for hq prices
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
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Search
                        </button>
                    </div>
                </div>

            </Form>
        </div>
    </main>
}

export default FullScan;
