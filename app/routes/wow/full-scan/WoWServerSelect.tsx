import { data } from '~/utils/WoWServers'

interface Props {
  name: string
  defaultValue?: number
}

const WoWServerSelect = ({ name, defaultValue = 61 }: Props) => (
  <select
    name={name}
    defaultValue={defaultValue}
    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
    {data.map(({ name, id }) => (
      <option key={`${name}-${id}`} value={id}>
        {name}
      </option>
    ))}
  </select>
)

export default WoWServerSelect
