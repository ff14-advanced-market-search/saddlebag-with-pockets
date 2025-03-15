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
  homeServer: string
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
/**
 * Synchronizes item data across specified servers
 * @example
 * sync({ itemIds: [1, 2, 3], homeServer: 'server1', exportServers: ['server2', 'server3'], hqOnly: true })
 * Promise { <pending> }
 * @param {Array<number>} itemIds - An array of item IDs to be synchronized.
 * @param {string} homeServer - The name of the home server from which items are exported.
 * @param {Array<string>} exportServers - A list of server names where the items will be synchronized.
 * @param {boolean} hqOnly - Flag indicating whether only high-quality items should be synchronized.
 * @returns {Promise<Response>} Promise that resolves to the response from the export API.
 * @description
 *   - Makes a POST request to the export API to synchronize item data.
 *   - Utilizes JSON.stringify to format request body.
 *   - Uses `User-Agent` header for identification.
 */
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
