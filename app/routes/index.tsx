import {Fragment} from 'react'
import {Menu, Transition} from '@headlessui/react'
import {Link, useLoaderData} from "@remix-run/react";
import {classNames} from "~/utils";
import {CalendarIcon, ChevronDownIcon, ColorSwatchIcon, LocationMarkerIcon, PencilIcon,} from "@heroicons/react/solid";
import EarthIcon from "~/icons/EarthIcon";
import {json, LoaderFunction} from "@remix-run/node";
import RegionsMap from "~/utils/locations/Regions";
import {DataCentersOfRegion, WorldsOfDataCenter} from "~/utils/locations";


export const loader: LoaderFunction = () => {
    // @ts-ignore
    const [region,] = [...RegionsMap.get('NA')];
    const data_center = DataCentersOfRegion('NA').pop();
    // @ts-ignore
    const world = WorldsOfDataCenter(data_center.name).pop();
    return json({
        region,
        data_center,
        world
    });
}

export default function Index() {
    const data = useLoaderData();
    return (
        <>
            <div>
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
                                            {data.region}
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500">
                                            <ColorSwatchIcon
                                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                aria-hidden="true"/>
                                            {data.data_center.name}
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500">
                                            <LocationMarkerIcon
                                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                aria-hidden="true"/>
                                            {data.world.name}
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
              to={'select-world'}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true"/>
            Edit
          </Link>
        </span>

                                    {/* Dropdown */}
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
                                    {/*                {({active}) => (*/}
                                    {/*                    <a*/}
                                    {/*                        href="#"*/}
                                    {/*                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}*/}
                                    {/*                    >*/}
                                    {/*                        Edit*/}
                                    {/*                    </a>*/}
                                    {/*                )}*/}
                                    {/*            </Menu.Item>*/}
                                    {/*            <Menu.Item>*/}
                                    {/*                {({active}) => (*/}
                                    {/*                    <a*/}
                                    {/*                        href="#"*/}
                                    {/*                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}*/}
                                    {/*                    >*/}
                                    {/*                        View*/}
                                    {/*                    </a>*/}
                                    {/*                )}*/}
                                    {/*            </Menu.Item>*/}
                                    {/*        </Menu.Items>*/}
                                    {/*    </Transition>*/}
                                    {/*</Menu>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>


            </div>
        </>
    );
}
