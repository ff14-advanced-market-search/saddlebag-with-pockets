import {DocumentSearchIcon}    from "@heroicons/react/outline";
import {Link}                  from "@remix-run/react";
import {InformationCircleIcon} from "@heroicons/react/solid";

const recommendedQueries = [
    {
        name:        'Full Scan',
        description: "Search throughout the entire data set! Nigh-infinite options.",
        icon:        DocumentSearchIcon,
        href:        '/queries/full-scan',
    },
];


export default function Index()
    {
        return (<>
            <main className="flex-1">
                <div className="rounded-md bg-blue-50 p-4 m-4 border-2 border-blue-100">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true"/>
                        </div>
                        <div className="ml-3 flex-1 md:flex md:justify-between">
                            <p className="text-sm text-blue-700">Welcome to the new Saddlebag Exchange! </p>
                            <p className="mt-3 text-sm md:mt-0 md:ml-6">
                                <a href="https://discord.gg/836C8wDVNq"
                                   className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                                    Discord
                                    <span aria-hidden="true"> &rarr;</span>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        <h1 className="text-2xl font-semibold text-gray-900">Recommended Queries</h1>
                        <div className={`not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2`}>
                            {recommendedQueries.map((query) =>
                            {
                                return (<div
                                    key={query.name}
                                    className={`group relative rounded-xl border border-slate-200 dark:border-slate-800`}>
                                    <div
                                        className={`absolute -inset-px rounded-xl border-2 border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.blue.50)),var(--quick-links-hover-bg,theme(colors.blue.50)))_padding-box,linear-gradient(to_top,theme(colors.yellow.400),theme(colors.yellow.400),theme(colors.blue.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]`}/>
                                    <div className={`relative overflow-hidden rounded-xl p-6`}>
                                        <query.icon className={`w-8 h-8 dark:text-white`}/>
                                        <h2 className={`mt-4 font-display text-base text-slate-900 dark:text-white`}>
                                            <Link to={query.href}>
                                                <span className={`absolute -inset-px rounded-xl`}/>
                                                {query.name}
                                            </Link>
                                        </h2>
                                        <p className={`mt-1 text-sm text-slate-700 dark:text-slate-400`}>
                                            {query.description}
                                        </p>
                                    </div>
                                </div>);
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </>);
    }
