import { useState } from 'react'
import type { WoWServerRegion } from '~/requests/WoW/types'
import { RegionRadioGroup } from './RegionRadioGroup'
import type { ServerSelected } from './WoWServerSelect'
import ServerSelect from './WoWServerSelect'

import type { WoWServerData } from '~/requests/WoW/types'

interface Props {
  region: WoWServerRegion
  regionTitle?: string
  serverSelectFormName: string
  defaultRealm: WoWServerData
  serverSelectTooltip?: string
  severSelectTitle?: string
  regionOnChange?: (region: WoWServerRegion) => void
  onServerTextChange?: (selectValue?: string) => void
  onServerSelectChange?: (selectValue?: ServerSelected) => void
}

export default function RegionAndServerSelect({
  region,
  regionTitle,
  serverSelectFormName,
  defaultRealm,
  serverSelectTooltip,
  severSelectTitle,
  regionOnChange,
  onServerTextChange,
  onServerSelectChange
}: Props) {
  const [regionValue, setRegionValue] = useState<WoWServerRegion>(region)

  return (
    <>
      <RegionRadioGroup
        title={regionTitle}
        defaultChecked={regionValue}
        onChange={(val) => {
          setRegionValue(val)
          regionOnChange?.(val)
        }}
      />
      <ServerSelect
        formName={serverSelectFormName}
        regionValue={regionValue}
        defaultServerName={defaultRealm.name}
        defaultServerId={defaultRealm.id.toString()}
        toolTip={serverSelectTooltip}
        title={severSelectTitle}
        onTextChange={onServerTextChange}
        onSelectChange={onServerSelectChange}
      />
    </>
  )
}
