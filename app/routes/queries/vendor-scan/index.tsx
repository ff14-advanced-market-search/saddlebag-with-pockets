import { Form, useActionData, useTransition } from '@remix-run/react'
import type {
  ActionFunction,
  ErrorBoundaryComponent
} from '@remix-run/cloudflare'
import { getUserSessionData } from '~/sessions'
import FullScanRequest, { FormValues } from '~/requests/FullScan'
import { classNames } from '~/utils'
import filters from '~/utils/filters'
import { Fragment } from 'react'
import NoResults from '~/routes/queries/full-scan/NoResults'
import Results from '~/routes/queries/full-scan/Results'

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)

  formData.append('world', session.getWorld())

  const typedData = new FormValues(formData)

  const data = typedData.toMap()
  console.dir(data)
  return await FullScanRequest(data).catch((err) => {
    console.log('catch', err)
    return err
  })
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error('errorBoundary', error)
  return (
    <pre>
      If you're seeing this, it'd be appreciated if you could report in our
      Discord's <span className={`font-bold`}>#bug-reporting</span> channel.
      Much thank
    </pre>
  )
}

const Index = () => {
  const transition = useTransition()
  const results = useActionData()

  const onSubmit = (e: MouseEvent) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  if (results) {
    if (Object.keys(results).length === 0) {
      return <NoResults href={`/queries/full-scan`} />
    }
    const data: Record<string, any> = Object.entries(results).map(
      (entry: [string, any]) => {
        return { id: parseInt(entry[0]), ...entry[1] }
      }
    )

    return <Results rows={data} />
  }
  return (
    <main className="flex-1">
      <div className="py-6">
        <Form method="post">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900 py-6">
              Full Scan
            </h1>
            <div className="mt-5 md:mt-0 md:col-span-3 py-6">
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                      <label
                        htmlFor="scan-hours"
                        className="block text-sm font-medium text-gray-700">
                        Scan Hours
                      </label>
                      <div className={`mt-1 flex rounded-md shadow-sm`}>
                        <input
                          type="number"
                          id="scan-hours"
                          defaultValue={48}
                          name="scan_hours"
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        <span
                          className={`inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm`}>
                          hours
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        The time period to search over. ex: <code>24</code> is
                        the past 24 hours. For more items to sell choose a
                        higher number.
                      </p>
                    </div>
                    <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                      <label
                        htmlFor="sale-amt"
                        className="block text-sm font-medium text-gray-700">
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
                        Number of sales in that time. ex: `5` is 5 sales in that
                        selected time period. For more items to sell choose a
                        lower number.
                      </p>
                    </div>

                    <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                      <label
                        htmlFor="roi"
                        className="block text-sm font-medium text-gray-700">
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
                        Desired R.O.I (return on investment): ex: `50` means
                        that 50% of the revenue you get from a sale should be
                        all profit (after tax). For more profit, choose a higher
                        number from 1 to 100.
                      </p>
                    </div>
                    <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                      <label
                        htmlFor="minimum_stack_size"
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
                        Desired Min Stack Size. ex: `10` is only show deals you
                        can get in stacks of 10 or greater. For more items to
                        sell choose a lower number.
                      </p>
                    </div>

                    <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                      <label
                        htmlFor="minimum_profit_amount"
                        className="block text-sm font-medium text-gray-700">
                        Minimum Profit Amount
                      </label>
                      <div className={`mt-1 flex rounded-md shadow-sm`}>
                        <input
                          type="number"
                          name="minimum_profit_amount"
                          defaultValue={1000}
                          id="minimum_profit_amount"
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        <span
                          className={`inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm`}>
                          gil
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Desired Min Profit Amount. ex: `10000` is only show
                        deals that yields 10000 gil profit or greater. For more
                        items to sell choose a lower number.
                      </p>
                    </div>

                    <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                      <label
                        htmlFor="price_per_unit"
                        className="block text-sm font-medium text-gray-700">
                        Average Price Per Unit
                      </label>
                      <div className={`mt-1 flex rounded-md shadow-sm`}>
                        <input
                          type="number"
                          name="price_per_unit"
                          defaultValue={1000}
                          id="price_per_unit"
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        <span
                          className={`inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm`}>
                          gil
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Desired Average Price Per Unit. ex: `10000` is only show
                        deals that sell on average for 10000 gil or greater. For
                        more items to sell choose a lower number.
                      </p>
                    </div>

                    <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                      <label
                        htmlFor="filters"
                        className="block text-sm font-medium text-gray-700">
                        Item Filter
                      </label>
                      <div className={`mt-1 flex rounded-md shadow-sm`}>
                        <select
                          name="filters"
                          className="focus:ring-blue-500 focus:border-blue-500 relative block w-full rounded-sm bg-transparent focus:z-10 sm:text-sm border-gray-300"
                          defaultValue={[-1]}
                          multiple={true}>
                          {/** @todo clean up what the multiple select dropdown looks like **/}
                          {filters.map((value) => {
                            const children = value.data
                            return (
                              <Fragment key={`f_${value.id}`}>
                                <option
                                  key={`${value.id}_${value.name}`}
                                  value={value.id}>
                                  {value.name}
                                </option>
                                {children.map((child) => {
                                  return child.id ? (
                                    <option
                                      key={`${value.id}_${child.id}_${child.name}`}
                                      value={child.id}>
                                      -- {child.name}
                                    </option>
                                  ) : null
                                })}
                              </Fragment>
                            )
                          })}
                        </select>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Filters let you limit what type of item you're wanting
                        to search for. Keep in mind, that a low Scan Hours or
                        high Sale Amount value will limit your results.
                        <span className={`italic hidden md:block`}>
                          Spicy side note, this is a multi-select filter. Hold
                          CTRL or SHIFT + click to select multiple if on a
                          keyboard.
                        </span>
                      </p>
                    </div>

                    <div className="col-span-6 sm:col-span-3 xl:col-span-2">
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
                            <label
                              htmlFor="hq_only"
                              className="font-medium text-gray-700">
                              Enable HQ only
                            </label>
                            <p className="mt-2 text-sm text-gray-500">
                              Only search for hq prices
                            </p>
                          </div>
                        </div>
                      </fieldset>
                    </div>

                    <div className="col-span-6 sm:col-span-3 xl:col-span-2">
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
                            <label
                              htmlFor="region_wide"
                              className="font-medium text-gray-700">
                              Region Wide Search
                            </label>
                            <p className="mt-2 text-sm text-gray-500">
                              Search all servers in all DataCenters in your
                              region.
                            </p>
                          </div>
                        </div>
                      </fieldset>
                    </div>

                    <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                      <fieldset className="space-y-5">
                        <legend className="sr-only">
                          Include Vendor Prices
                        </legend>
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="include_vendor"
                              aria-describedby="comments-description"
                              name="include_vendor"
                              type="checkbox"
                              defaultChecked={true}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="include_vendor"
                              className="font-medium text-gray-700">
                              Include Vendor Prices
                            </label>
                            <p className="mt-2 text-sm text-gray-500">
                              Compare market prices vs vendor prices on NQ items
                              that can be purchased from vendors.
                            </p>
                          </div>
                        </div>
                      </fieldset>
                    </div>

                    <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                      <fieldset className="space-y-5">
                        <legend className="sr-only">
                          Include Out of Stock
                        </legend>
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
                            <label
                              htmlFor="out_of_stock"
                              className="font-medium text-gray-700">
                              Include Out of Stock
                            </label>
                            <p className="mt-2 text-sm text-gray-500">
                              Include out of stock items from the list (they
                              will show up as having 100% profit margins and 1
                              bil gil profit).
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
                // @ts-ignore
                onClick={onSubmit}
                className={classNames(
                  transition.state === 'submitting'
                    ? 'bg-gray-500'
                    : 'bg-blue-600',
                  'cursor-pointer ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                )}>
                {transition.state === 'submitting' && (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                Search
              </button>
            </div>
          </div>
        </Form>
      </div>
    </main>
  )
}

export default Index
