import type {FC} from "react";
import {Fragment} from "react";
import * as locations from "~/utils/locations";

type SelectDataCenterProps = {
    onSelect: (data_center: string) => void, dataCenter: string | undefined;
}
export const SelectDataCenter: FC<SelectDataCenterProps> = ({onSelect, dataCenter}) => {

    const regions = Array.from(locations.Regions);

    const dataCenterDefaultValue = () => {
        return dataCenter ? dataCenter : 'Select your Data Center';
    }

    const dataCentersFromRegion = (region_id: string) => {
        return locations.DataCentersOfRegion(region_id)
    }
    return <select
        key={"data_center_select"}
        name="data_center"
        autoComplete="data_center"
        placeholder={'Select your Data Center'}
        className="focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-sm bg-transparent focus:z-10 sm:text-sm border-gray-300"
        defaultValue={dataCenterDefaultValue()}
        onChange={(event) => {
            onSelect(event.target.value);
        }}
    >
        {!dataCenter && <option disabled hidden>{dataCenterDefaultValue()}</option>}
        {regions.map((value, index, array) => {
            return (<Fragment key={`${index}_${value[0]}`}>
                <option disabled key={value[0]}>{value[1][1]} Data Centers</option>
                {dataCentersFromRegion(value[0]).map((value) => {
                    return <option key={value.name}>{value.name}</option>
                })}
            </Fragment>)
        })}
    </select>
}
