import EarthIcon from "~/icons/EarthIcon";
import {CalendarIcon, CheckIcon, ColorSwatchIcon, LocationMarkerIcon} from "@heroicons/react/solid";
import {Link, useLoaderData} from "@remix-run/react";
import type {LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {DataCenters, Regions, Worlds} from "~/utils/locations";

export const loader: LoaderFunction = () => {
    return json({
        regions: Regions, data_centers: DataCenters, worlds: Worlds
    });
}


export default function SelectWorld() {
    const data = useLoaderData();
    console.log(data);
    return (<div>
        <main className="flex-1">
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                Character name?</h2>
                            <div
                                className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <EarthIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                               aria-hidden="true"/>
                                    ?
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <ColorSwatchIcon
                                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                        aria-hidden="true"/>
                                    ?
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <LocationMarkerIcon
                                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                        aria-hidden="true"/>
                                    ?
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                  aria-hidden="true"/>
                                    Last updated January 9, 2020
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 flex lg:mt-0 lg:ml-4">
        <span className="hidden sm:block">
          <Link
              to={`/`}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <CheckIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
            Save
          </Link>
        </span>
                            {/* @todo */}
                            {/*<Menu as="div" className="ml-3 relative sm:hidden">*/}
                            {/*    <Menu.Button*/}
                            {/*        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">*/}
                            {/*        More*/}
                            {/*        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5 text-gray-500"*/}
                            {/*                         aria-hidden="true"/>*/}
                            {/*    </Menu.Button>*/}

                            {/*    <Transition*/}
                            {/*        as={Fragment}*/}
                            {/*        enter="transition ease-out duration-200"*/}
                            {/*        enterFrom="transform opacity-0 scale-95"*/}
                            {/*        enterTo="transform opacity-100 scale-100"*/}
                            {/*        leave="transition ease-in duration-75"*/}
                            {/*        leaveFrom="transform opacity-100 scale-100"*/}
                            {/*        leaveTo="transform opacity-0 scale-95"*/}
                            {/*    >*/}
                            {/*        <Menu.Items*/}
                            {/*            className="origin-top-right absolute right-0 mt-2 -mr-1 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">*/}
                            {/*            <Menu.Item>*/}
                            {/*                {({active}) => (<a*/}
                            {/*                    href="#"*/}
                            {/*                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}*/}
                            {/*                >*/}
                            {/*                    Edit*/}
                            {/*                </a>)}*/}
                            {/*            </Menu.Item>*/}
                            {/*            <Menu.Item>*/}
                            {/*                {({active}) => (<a*/}
                            {/*                    href="#"*/}
                            {/*                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}*/}
                            {/*                >*/}
                            {/*                    View*/}
                            {/*                </a>)}*/}
                            {/*            </Menu.Item>*/}
                            {/*        </Menu.Items>*/}
                            {/*    </Transition>*/}
                            {/*</Menu>*/}
                        </div>
                    </div>
                </div>

            </div>

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <>
                        <div>
                            <div className="md:grid md:grid-cols-3 md:gap-6">
                                <div className="md:col-span-1">
                                    <div className="px-4 sm:px-0">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            This information will be displayed publicly so be careful what you share.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form action="#" method="POST">
                                        <div className="shadow sm:rounded-md sm:overflow-hidden">
                                            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                                <div>
                                                    <label htmlFor="location"
                                                           className="block text-sm font-medium text-gray-700">
                                                        Location
                                                    </label>
                                                    <select
                                                        id="region"
                                                        name="region"
                                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                        defaultValue="Canada"
                                                    >

                                                        {/*{data.region.forEach((region) => {*/}
                                                        {/*    return <option>region[0]</option>;*/}
                                                        {/*})}*/}
                                                    </select>
                                                </div>


                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="hidden sm:block" aria-hidden="true">
                            <div className="py-5">
                                <div className="border-t border-gray-200"/>
                            </div>
                        </div>
                    </>
                </div>
            </div>

        </main>


    </div>)
}
