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
 * Renders a component that allows selection of World of Warcraft region and server.
 * @example
 * RegionAndServerSelect({
 *   region: 'US',
 *   regionTitle: 'Select Region',
 *   serverSelectFormName: 'serverSelect',
 *   defaultRealm: { name: 'Stormrage', id: 4 },
 *   serverSelectTooltip: 'Select your desired server',
 *   serverSelectTitle: 'Server Selection',
 *   regionOnChange: (region) => console.log(region),
 *   onServerTextChange: (text) => console.log(text),
 *   onServerSelectChange: (server) => console.log(server)
 * })
 * Returns JSX elements for region and server selection.
 * @param {Object} props - Describes the properties passed to the component.
 * @param {string} props.region - Initial region value.
 * @param {string} props.regionTitle - Title for the region selection component.
 * @param {string} props.serverSelectFormName - Form name attribute for the server select input.
 * @param {Object} props.defaultRealm - Object containing default realm's name and id.
 * @param {string} props.serverSelectTooltip - Tooltip text for the server selection component.
 * @param {string} props.serverSelectTitle - Title for the server selection component.
 * @param {Function} props.regionOnChange - Callback function called when the region changes.
 * @param {Function} props.onServerTextChange - Callback function called when the server text changes.
 * @param {Function} props.onServerSelectChange - Callback function called when the server selection changes.
 * @returns {JSX.Element} Returns the rendered region and server selection components.
 * @description
 *   - Uses useEffect to sync server selection when region changes.
 *   - Allows for change handling via provided callbacks.
 *   - Displays a radio group for region selection.
 *   - Integrates server selection with tooltips and callbacks.
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
