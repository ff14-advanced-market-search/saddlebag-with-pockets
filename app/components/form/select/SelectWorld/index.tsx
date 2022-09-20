import type { FC, PropsWithoutRef }    from "react"
import { useEffect, useState }         from "react"
import * as locations                  from "~/utils/locations"
import type { Transition }             from "@remix-run/react/dist/transition"
import type { ValidationResult }       from "remix-validated-form"
import type { SelectWorldInputFields } from "~/routes/options"
import type { GetDeepProp }            from "~/utils/ts"
import type { WorldsList }             from "~/utils/locations/Worlds"
import { SelectDataCenter }            from "~/components/form/select/SelectWorld/SelectDataCenter"
import { SelectWorld }                 from "~/components/form/select/SelectWorld/SelectWorld"
import type { SessionData }            from "@remix-run/cloudflare"

type SelectWorldProps = PropsWithoutRef<{
  transition: Transition
  actionData: ValidationResult<SelectWorldInputFields>
  sessionData: SessionData
}>

export const SelectDCandWorld: FC<SelectWorldProps> = ({
                                                         transition,
                                                         sessionData,
                                                       }) =>
  {
    const [dataCenter, setDataCenter] = useState<string | undefined>(sessionData.data_center)
    const [worlds, setWorlds] = useState<GetDeepProp<WorldsList, "name">>()
    const [world, setWorld] = useState<string | undefined>(sessionData.world)
    useEffect(() =>
    {
      if(dataCenter)
        {
          setWorlds(Array.from(locations.WorldsOfDataCenter(dataCenter)))
        }
    }, [dataCenter])

    return (<fieldset
        className="mt-6 dark:bg-slate-800 bg-white"
        disabled={transition.state === "submitting"}>
        <legend className="block text-sm font-medium text-gray-700">
          Data Center
        </legend>
        <div className="mt-1 shadow-sm">
          <SelectDataCenter onSelect={setDataCenter} dataCenter={dataCenter} />
        </div>
        <div className={`mt-6`}>
          <legend className="block text-sm font-medium text-gray-700">
            World
          </legend>
          <SelectWorld
            onSelect={(world) =>
              {
                setWorld(world)
              }}
            dataCenter={dataCenter}
            world={world}
            worlds={worlds}
          />
        </div>
      </fieldset>)
  }

export default SelectDCandWorld
