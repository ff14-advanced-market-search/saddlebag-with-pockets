import {FC, Fragment, useEffect, useState} from 'react'
import * as locations from "~/utils/locations";

// type SelectWorldProps = PropsWithoutRef<{ worlds: typeof locations.Worlds }>

export const SelectWorld: FC/*<SelectWorldProps>*/ = ({/*worlds*/}) => {
    /** @todo load from jwt/session/localstorage **/
    const [dataCenter, setDataCenter] = useState<string | undefined>();
    const [worlds, setWorlds] = useState(locations.Worlds);
    // console.log(worlds.get('MaoXiaoPang'), locations.WorldsOfDataCenter('MaoXiaoPang'))
    const [world, setWorld] = useState<string | undefined>();
    useEffect(() => {
        if(dataCenter){
            console.log(dataCenter);
            // setWorlds(locations.WorldsOfDataCenter(dataCenter));
        }
        // setWorlds(locations.WorldsOfDataCenter())
        // console.log(dataCenter);
        // setWorlds(locations.WorldsOfDataCenter(dataCenter.name));
    }, [dataCenter]);
    // const dataCenterArray = Array.from(locations.DataCenters);
    const onSelectDataCenter: (value: string) => void = (value) => {
        setDataCenter(value);
    };
    const onSelectWorld: (value: string) => void = (value) => {
        setWorld(value);
    }
    // @todo - load from jwt/memory or w/e
    return (<fieldset className="mt-6 bg-white">
        <legend className="block text-sm font-medium text-gray-700">Data Center</legend>
        <div className="mt-1 shadow-sm">
            <select
                key={"data_center_select"}
                name="data_center"
                autoComplete="data_center"
                placeholder={'Select your Data Center'}
                className="focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-sm bg-transparent focus:z-10 sm:text-sm border-gray-300"
                value={dataCenter}
                defaultValue={`What Data Center are you in?`}
                onChange={(event) => {
                    onSelectDataCenter(event.target.value);
                }}
            >
                {Array.from(locations.Regions).map((value, index, array) => {
                    return (<Fragment key={`${index}_${value[0]}`}>
                        <option disabled={true} key={value[0]}>{value[1][1]} Data Centers</option>
                        {locations.DataCentersOfRegion(value[0]).map((value) => {
                            return <option key={value.name}>{value.name}</option>
                        })}
                    </Fragment>)
                })}
            </select>
        </div>
        <div className={`mt-6`}>
            <legend className="block text-sm font-medium text-gray-700">World/Server</legend>
            <select
                key={"world_select"}
                name="world"
                autoComplete="world"
                className="focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-sm bg-transparent focus:z-10 sm:text-sm border-gray-300"
                value={world}
                defaultValue={dataCenter === undefined ? `Please select a Data Center` : `Select your World/Server`}
                onChange={(event) => {
                    onSelectWorld(event.target.value);
                }}
            >
                {/*{Array.from(locations.WorldsO).map((value, index, array) => {*/}
                {/*    return (<Fragment key={`${index} - ${value[0]}`}>*/}
                {/*        <option disabled={true} key={value[0]}>{value[1][1]} Data Centers</option>*/}
                {/*        {locations.DataCentersOfRegion(value[0]).map((value) => {*/}
                {/*            return <option key={value.name}>{value.name}</option>*/}
                {/*        })}*/}
                {/*    </Fragment>)*/}
                {/*})}*/}
                <option>none</option>
            </select>
        </div>
    </fieldset>)

    // return (
    //     <Listbox value={selected} onChange={setSelected}>
    //         {({open}) => (
    //             <>
    //                 <Listbox.Label className="block text-sm font-medium text-gray-700">Assigned to</Listbox.Label>
    //                 <div className="mt-1 relative">
    //                     <Listbox.Button
    //                         className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
    //                         <span className="block truncate">{selected.name}</span>
    //                         <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
    //             <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
    //           </span>
    //                     </Listbox.Button>
    //
    //                     <Transition
    //                         show={open}
    //                         as={Fragment}
    //                         leave="transition ease-in duration-100"
    //                         leaveFrom="opacity-100"
    //                         leaveTo="opacity-0"
    //                     >
    //                         <Listbox.Options
    //                             className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
    //                             {worlds.entries().map((person) => (
    //                                 <Listbox.Option
    //                                     key={person.id}
    //                                     className={({active}) =>
    //                                         classNames(
    //                                             active ? 'text-white bg-indigo-600' : 'text-gray-900',
    //                                             'cursor-default select-none relative py-2 pl-3 pr-9'
    //                                         )
    //                                     }
    //                                     value={person}
    //                                 >
    //                                     {({selected, active}) => (
    //                                         <>
    //                     <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
    //                       {person.name}
    //                     </span>
    //
    //                                             {selected ? (
    //                                                 <span
    //                                                     className={classNames(
    //                                                         active ? 'text-white' : 'text-indigo-600',
    //                                                         'absolute inset-y-0 right-0 flex items-center pr-4'
    //                                                     )}
    //                                                 >
    //                         <CheckIcon className="h-5 w-5" aria-hidden="true"/>
    //                       </span>
    //                                             ) : null}
    //                                         </>
    //                                     )}
    //                                 </Listbox.Option>
    //                             ))}
    //                         </Listbox.Options>
    //                     </Transition>
    //                 </div>
    //             </>
    //         )}
    //     </Listbox>
    // )
}
