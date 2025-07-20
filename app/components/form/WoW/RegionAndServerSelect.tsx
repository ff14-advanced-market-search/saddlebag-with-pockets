import type { WoWServerRegion, WoWServerData } from '~/requests/WoW/types'
import { RegionRadioGroup } from './RegionRadioGroup'
import type { ServerSelected } from './WoWServerSelect'
import ServerSelect from './WoWServerSelect'

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

/**
 * Renders UI controls for selecting a World of Warcraft region and server.
 *
 * Displays a radio group for region selection and a server selection input, with optional titles and tooltips. Selection changes are communicated via provided callback props.
 *
 * @returns The JSX elements for region and server selection.
 */
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
  return (
    <>
      <RegionRadioGroup
        title={regionTitle}
        defaultChecked={region}
        onChange={(val: WoWServerRegion) => {
          regionOnChange?.(val)
        }}
      />
      <ServerSelect
        formName={serverSelectFormName}
        regionValue={region}
        defaultServerName={defaultRealm.name}
        defaultServerId={defaultRealm.id.toString()}
        toolTip={serverSelectTooltip}
        title={serverSelectTitle}
        onTextChange={onServerTextChange}
        onSelectChange={(selectValue?: ServerSelected) => {
          onServerSelectChange?.(selectValue)
        }}
      />
    </>
  )
}
