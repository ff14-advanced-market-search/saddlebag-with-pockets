import {Form} from "@remix-run/react";

const FullScan = () => {
    return <main className="flex-1">
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Full Scan</h1>
                <div className="mt-5 md:mt-0 md:col-span-2">
                    <Form action="" method="post">
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
                                            name="scan-hours"
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
                                            name="sale-amount"
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
                                        <label htmlFor="email-address"
                                               className="block text-sm font-medium text-gray-700">
                                            Email address
                                        </label>
                                        <input
                                            type="text"
                                            name="email-address"
                                            id="email-address"
                                            autoComplete="email"
                                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                            Country
                                        </label>
                                        <select
                                            id="country"
                                            name="country"
                                            autoComplete="country-name"
                                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        >
                                            <option>United States</option>
                                            <option>Canada</option>
                                            <option>Mexico</option>
                                        </select>
                                    </div>

                                    <div className="col-span-6">
                                        <label htmlFor="street-address"
                                               className="block text-sm font-medium text-gray-700">
                                            Street address
                                        </label>
                                        <input
                                            type="text"
                                            name="street-address"
                                            id="street-address"
                                            autoComplete="street-address"
                                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            id="city"
                                            autoComplete="address-level2"
                                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                        <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                                            State / Province
                                        </label>
                                        <input
                                            type="text"
                                            name="region"
                                            id="region"
                                            autoComplete="address-level1"
                                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                        <label htmlFor="postal-code"
                                               className="block text-sm font-medium text-gray-700">
                                            ZIP / Postal code
                                        </label>
                                        <input
                                            type="text"
                                            name="postal-code"
                                            id="postal-code"
                                            autoComplete="postal-code"
                                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <button
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    </main>
}

export default FullScan;
