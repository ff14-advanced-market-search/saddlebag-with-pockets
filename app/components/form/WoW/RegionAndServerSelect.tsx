import { useState, useEffect } from 'react'
import type { WoWServerRegion , WoWServerData } from '~/requests/WoW/types'
import { RegionRadioGroup } from './RegionRadioGroup'
import type { ServerSelected } from './WoWServerSelect'
import ServerSelect from './WoWServerSelect'

import { findWoWServersIdByName } from '~/utils/WoWServers'

interface Props {
  region: WoWServerRegion
  regionTitle?: string
  serverSelectFormName: string
  defaultRealm: WoWServerData
  serverSelectTooltip?: string
  serverSelectTitle?: string
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
  serverSelectTitle,
  regionOnChange,
  onServerTextChange,
  onServerSelectChange
}: Props) {
  const [regionValue, setRegionValue] = useState<WoWServerRegion>(region)

  // Updates server selection when region changes to keep it in sync
  useEffect(() => {
    if (regionValue !== region) {
      const servers = findWoWServersIdByName(defaultRealm.name, regionValue)
      if (servers.length > 0) {
        onServerSelectChange?.({ id: servers[0].id, name: servers[0].name })
      } else {
        onServerSelectChange?.(undefined)
      }
    }
  }, [regionValue, region, defaultRealm.name, onServerSelectChange])

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
        title={serverSelectTitle}
        onTextChange={onServerTextChange}
        onSelectChange={onServerSelectChange}
      />
    </>
  )
}
