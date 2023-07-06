import type { FC, PropsWithoutRef } from 'react'
import { useEffect, useState } from 'react'
import * as locations from '~/utils/locations'
import type { Transition } from '@remix-run/react/dist/transition'
import type { ValidationResult } from 'remix-validated-form'
import type SelectWorldInputFields from '~/routes/_public.options'
import type { GetDeepProp } from '~/utils/ts'
import type { WorldsList } from '~/utils/locations/Worlds'
import { SelectDataCenter } from '~/components/form/select/SelectWorld/SelectDataCenter'
import { SelectWorld } from '~/components/form/select/SelectWorld/SelectWorld'
import type { SessionData } from '@remix-run/cloudflare'

type SelectWorldProps = PropsWithoutRef<{
  transition: Transition
  actionData: ValidationResult<typeof SelectWorldInputFields>
  sessionData: SessionData
  onChange?: (ffxiv: { world: string; data_center: string }) => void
}>

export const SelectDCandWorld: FC<SelectWorldProps> = ({
  transition,
  sessionData,
  onChange
}) => {
  const [dataCenter, setDataCenter] = useState<string | undefined>(
    sessionData.data_center
  )
  const [worlds, setWorlds] = useState<GetDeepProp<WorldsList, 'name'>>()
  const [world, setWorld] = useState<string | undefined>(sessionData.world)
  useEffect(() => {
    if (dataCenter) {
      setWorlds(Array.from(locations.WorldsOfDataCenter(dataCenter)))
    }
  }, [dataCenter])

  return (
    <fieldset
      className="mt-6 bg-white dark:bg-transparent"
      disabled={transition.state === 'submitting'}>
      <legend className="block text-sm font-medium text-gray-700 dark:text-gray-100">
        Data Center
      </legend>
      <div className="mt-1 shadow-sm">
        <SelectDataCenter
          onSelect={(data_center) => {
            setDataCenter(data_center)
            if (world && dataCenter) {
              onChange?.({ world, data_center })
            }
          }}
          dataCenter={dataCenter}
        />
      </div>
      <div className={`mt-6`}>
        <legend className="block text-sm font-medium text-gray-700 dark:text-gray-100">
          World
        </legend>
        <SelectWorld
          onSelect={(newWorld) => {
            setWorld(newWorld)
            if (newWorld && dataCenter) {
              onChange?.({ world: newWorld, data_center: dataCenter })
            }
          }}
          dataCenter={dataCenter}
          world={world}
          worlds={worlds}
        />
      </div>
    </fieldset>
  )
}

export default SelectDCandWorld
