import type {FC, PropsWithChildren} from "react";
import {Fragment, useState} from "react";
import {Dialog, Menu, Transition} from "@headlessui/react";
import {BellIcon, CashIcon, HomeIcon, MenuAlt2Icon, UsersIcon, XIcon} from "@heroicons/react/outline";
import {NavLink} from "@remix-run/react";
import {classNames} from "~/utils";
import PatreonIcon from "~/icons/PatreonIcon";
import KofiIcon from "~/icons/KofiIcon";
import EarthIcon from "~/icons/EarthIcon";
import {LocationMarkerIcon, PencilIcon} from "@heroicons/react/solid";

type Props = PropsWithChildren<any> & {
    data: any
}


const navigation = [{name: 'Dashboard', href: '/', icon: HomeIcon}, {
    name: 'Trading', href: 'trading', icon: CashIcon
}, {name: 'Retainers', href: 'retainers', icon: UsersIcon}, {
    name: 'Patreon', href: 'https://www.patreon.com/indopan', icon: PatreonIcon, external: true
}, {name: 'Ko-fi', href: 'https://ko-fi.com/indopan', icon: KofiIcon, external: true},]
const userNavigation = [{name: 'Your Profile', href: '#'}, {name: 'Settings', href: '#'}, {
    name: 'Sign out', href: '#'
},]

export const Sidebar: FC<Props> = ({children, data}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    return <>
        <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75"/>
                </Transition.Child>

                <div className="fixed inset-0 flex z-40">
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <Dialog.Panel
                            className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-in-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in-out duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="absolute top-0 right-0 -mr-12 pt-2">
                                    <button
                                        type="button"
                                        className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="sr-only">Close sidebar</span>
                                        <XIcon className="h-6 w-6 text-white" aria-hidden="true"/>
                                    </button>
                                </div>
                            </Transition.Child>
                            <div className="flex-shrink-0 flex items-center px-4">
                                <img
                                    className="h-8 w-auto"
                                    src="/images/chocobo.png"
                                    alt={data.site_name}
                                />
                            </div>
                            <div className="mt-5 flex-1 h-0 overflow-y-auto">
                                <nav className="px-2 space-y-1">
                                    {navigation.map((item) => (!item.external ? <NavLink
                                        key={item.name}
                                        to={item.href}
                                        className={({isActive}) => classNames(isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'group flex items-center px-2 py-2 text-base font-medium rounded-md')}
                                    >{({isActive}) => (<>
                                        <item.icon
                                            className={classNames(isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300', 'mr-4 flex-shrink-0 h-6 w-6')}
                                            aria-hidden="true"
                                        />
                                        {item.name}</>)}
                                    </ NavLink> : <a key={item.name}
                                                     href={item.href}
                                                     className={`text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-base font-medium rounded-md`}>
                                        <item.icon
                                            className={classNames('text-gray-400 group-hover:text-gray-300', 'mr-4 flex-shrink-0 h-6 w-6')}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </a>))}

                                </nav>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                    <div className="flex-shrink-0 w-14" aria-hidden="true">
                        {/* Dummy element to force sidebar to shrink to fit close icon */}
                    </div>
                </div>
            </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
                <div className="flex items-center h-24 flex-shrink-0 px-4 bg-gray-900">
                    <img
                        className="h-24 w-auto"
                        src="/images/chocobo.png"
                        alt={data.site_name}
                    />
                </div>
                <div className="flex-1 flex flex-col overflow-y-auto">
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navigation.map((item) => (!item.external ? <NavLink
                            key={item.name}
                            to={item.href}
                            className={({isActive}) => classNames(isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'group flex items-center px-2 py-2 text-sm font-medium rounded-md')}
                        >{({isActive}) => (<>
                            <item.icon
                                className={classNames(isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300', 'mr-3 flex-shrink-0 h-6 w-6')}
                                aria-hidden="true"
                            />
                            {item.name}</>)}
                        </NavLink> : <a key={item.name}
                                        href={item.href}
                                        className={`text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                            <item.icon
                                className={classNames('text-gray-400 group-hover:text-gray-300', 'mr-4 flex-shrink-0 h-6 w-6')}
                                aria-hidden="true"
                            />
                            {item.name}
                        </a>))}
                    </nav>
                </div>
            </div>
        </div>
        <div className="md:pl-64 flex flex-col">
            <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
                <button
                    type="button"
                    className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                    onClick={() => setSidebarOpen(true)}
                >
                    <span className="sr-only">Open sidebar</span>
                    <MenuAlt2Icon className="h-6 w-6" aria-hidden="true"/>
                </button>
                <div className="flex-1 px-4 flex justify-end">
                    <div className={`ml-4 flex md:ml-6 basis-52`}>
                        <NavLink
                            to={'/select-world'}
                            type="button"
                            className={classNames(`group content-between flex flex-1`, "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500")}
                        >
                            <div className={`flex flex-wrap pl-1.5 flex-1`}>
                                <div className="flex items-center text-sm text-gray-500 basis-full">
                                    <EarthIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                               aria-hidden="true"/>
                                    {data.data_center}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 basis-full">
                                    <LocationMarkerIcon
                                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                        aria-hidden="true"/>
                                    {data.world}
                                </div>
                            </div>
                            <div className={`flex items-center pr-1.5`}>
                                <PencilIcon className="h-5 w-5 text-gray-400 basis-full group-hover:text-blue-500"
                                            aria-hidden="true"/>
                            </div>
                        </NavLink>
                    </div>
                    <div className="ml-4 flex items-center md:ml-6">
                        <button
                            type="button"
                            className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <span className="sr-only">View notifications</span>
                            <BellIcon className="h-6 w-6" aria-hidden="true"/>
                        </button>

                        {/* Profile dropdown */}
                        <Menu as="div" className="ml-3 relative">
                            <div>
                                <Menu.Button
                                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src="/images/chocobo.png"
                                        alt=""
                                    />
                                </Menu.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items
                                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    {userNavigation.map((item) => (<Menu.Item key={item.name}>
                                        {({active}) => (<a
                                            href={item.href}
                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                        >
                                            {item.name}
                                        </a>)}
                                    </Menu.Item>))}
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
            {children}
        </div>
    </>
}
