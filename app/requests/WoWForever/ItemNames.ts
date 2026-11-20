import { address, UserAgent } from '../client/config'

/** Map of Forever item id string → item name from POST /api/wow/forever/itemnames */
export type ForeverItemNamesMap = Record<string, string>

/**
 * POST /api/wow/forever/itemnames
 * Optional item_ids filters the catalog; empty/omitted returns all Forever names.
 */
const ForeverItemNames = async (
  itemIds: number[] = []
): Promise<ForeverItemNamesMap> => {
  const response = await fetch(`${address}/api/wow/forever/itemnames`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({ item_ids: itemIds })
  })

  if (!response.ok) {
    return {}
  }

  const body: unknown = await response.json()
  if (body == null || typeof body !== 'object' || Array.isArray(body)) {
    return {}
  }

  const names: ForeverItemNamesMap = {}
  for (const [itemId, itemName] of Object.entries(body)) {
    if (typeof itemName === 'string' && itemName.length > 0) {
      names[itemId] = itemName
    }
  }
  return names
}

export default ForeverItemNames
