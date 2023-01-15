import { useState } from 'react'
import type { WoWServerRegion } from '~/requests/WoW/types'
import { RegionRadioGroup } from './RegionRadioGroup'
import ServerSelect from './WoWServerSelect'
import type { WoWServerData } from '~/requests/WoW/types'

interface Props {
  region: WoWServerRegion
  regionTitle?: string
  serverSelectFormLabel: string
  defaultRealm: WoWServerData
}

export default function RegionAndServerSelect({
  region,
  regionTitle,
  serverSelectFormLabel,
  defaultRealm
}: Props) {
  const [regionValue, setRegionValue] = useState<WoWServerRegion>(region)
  return (
    <>
      <RegionRadioGroup
        title={regionTitle}
        defaultChecked={regionValue}
        onChange={(val) => setRegionValue(val)}
      />
      <ServerSelect
        formName={serverSelectFormLabel}
        regionValue={regionValue}
        defaultServerName={defaultRealm.name}
        defaultServerId={defaultRealm.id.toString()}
      />
    </>
  )
}
