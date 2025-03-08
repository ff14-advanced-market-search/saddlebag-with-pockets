import type { FC, PropsWithoutRef } from 'react'
import { useEffect, useState } from 'react'
import * as locations from '~/utils/locations'
import type { ValidationResult } from 'remix-validated-form'
import type SelectWorldInputFields from '~/routes/_public.options'
import type { GetDeepProp } from '~/utils/ts'
import type { WorldsList } from '~/utils/locations/Worlds'
import { SelectDataCenter } from '~/components/form/select/SelectWorld/SelectDataCenter'
import { SelectWorld } from '~/components/form/select/SelectWorld/SelectWorld'
import type { SessionData } from '@remix-run/cloudflare'
import type { RouterState } from '@remix-run/router'

type SelectWorldProps = PropsWithoutRef<{
  navigation: RouterState['navigation']
  sessionData: SessionData
  actionData?: ValidationResult<typeof SelectWorldInputFields>
  onChange?: (ffxiv: { world: string; data_center: string }) => void
}>

export const SelectDCandWorld: FC<SelectWorldProps> = ({
  navigation,
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
      className='mt-6 bg-white dark:bg-transparent'
      disabled={navigation.state === 'submitting'}
    >
      <legend className='block text-sm font-medium text-gray-700 dark:text-gray-100'>
        Data Center
      </legend>
      <div className='mt-1 shadow-sm'>
        <SelectDataCenter
          onSelect={(newDataCenter) => {
            setDataCenter(newDataCenter)
            const newWorld = Array.from(
              locations.WorldsOfDataCenter(newDataCenter)
            )[0].name
            if (world && dataCenter) {
              onChange?.({ world: newWorld, data_center: newDataCenter })
            }
          }}
          dataCenter={dataCenter}
        />
      </div>
      <div className={`mt-6`}>
        <legend className='block text-sm font-medium text-gray-700 dark:text-gray-100'>
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
