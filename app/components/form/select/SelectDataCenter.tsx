import type {FC} from "react";

type SelectDataCenterProps = {
    dataCenters: Record<string, { name: string }[]>,
    onSelect: (data_center: string) => void
}
export const SelectDataCenter: FC<SelectDataCenterProps> = ({dataCenters, onSelect}) => {
    console.log(dataCenters);
    return <div>
        <label htmlFor="country" className="sr-only">
            Country
        </label>
        <select
            name="data_center"
            autoComplete="data_center"
            className="focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-none rounded-t-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
            onChange={(event) => {
                onSelect(event.target.value);
            }}
        >

        </select>
    </div>
}
