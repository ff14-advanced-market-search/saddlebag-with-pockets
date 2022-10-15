import { address, UserAgent } from '~/requests/client/config'

export interface GetHistoryProps {
  itemId: number
  world: string
  initialDays?: number
  endDays?: number
  itemType?: string
}

const GetHistory: ({
  itemId,
  world,
  initialDays,
  endDays,
  itemType
}: GetHistoryProps) => Promise<Response> = async ({
  itemId,
  world,
  initialDays = 30,
  endDays = 0,
  itemType = 'all'
}) => {
  return fetch(`${address}/api/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      item_id: itemId,
      home_server: world,
      initial_days: initialDays,
      end_days: endDays,
      item_type: itemType
    })
  })
}

export default GetHistory
