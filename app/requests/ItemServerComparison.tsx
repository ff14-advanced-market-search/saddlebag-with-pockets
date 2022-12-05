import { address, UserAgent } from '~/requests/client/config'

export interface ExportServer {
  server_name: string
  price: number
}

export type ItemServerComparisonResult = {
  item_id: string
  export_servers: Array<ExportServer>
}

export type ItemServerComparisonList = {
  data: Array<ItemServerComparisonResult>
}

const ItemServerComparison: ({
  itemIds,
  homeServer,
  hqOnly,
  exportServers
}: {
  itemIds: Array<number>
  homeServer: string
  exportServers: Array<string>
  hqOnly: boolean
}) => Promise<Response> = async ({
  itemIds,
  homeServer,
  exportServers,
  hqOnly
}) => {
  return fetch(`${address}/api/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      item_ids: itemIds,
      home_server: homeServer,
      export_servers: exportServers,
      hq_only: hqOnly
    })
  })
}

export default ItemServerComparison
