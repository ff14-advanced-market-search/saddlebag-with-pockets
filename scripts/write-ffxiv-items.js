const axios = require('axios')
const { writeFile } = require('fs')

const ITEM_NAMES_ADDRESS =
  'https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/staging/libs/data/src/lib/json/items.json'

const FILE_PATH = './app/utils/items/ffxivItems.ts'

const ITEM_IDS_ADDRESS = 'https://universalis.app/api/marketable'

const XIVAPI_BASE_URL = 'https://beta.xivapi.com/api/1/sheet/Item'

const INVALID_STRINGS = [
  ';',
  'DROP',
  'TABLE',
  'DELETE',
  'INSERT',
  '<',
  '>',
  '{',
  '}',
  'function(',
  'function (',
  '=>'
]

/**
 * Validates and formats a string, ensuring it is neither null, non-string, nor contains invalid terms.
 * @example
 * validateString("example string")
 * "example string"
 * @param {Object} en - The string to be validated and formatted.
 * @returns {string|undefined} Returns the formatted string if valid, otherwise undefined.
 * @description
 *   - Replaces non-breaking space characters with regular spaces.
 *   - Utilizes a predefined list of invalid strings to check for invalidity.
 *   - Returns undefined if the input string includes any invalid term.
 */
const validateItem = ({ en }) => {
  if (en == null) {
    return undefined
  }

  if (typeof en !== 'string') {
    return undefined
  }

  if (!en.length) {
    return undefined
  }

  let isInvalid = false

  INVALID_STRINGS.forEach((term) => {
    if (en.includes(term)) {
      isInvalid = true
    }
  })

  return isInvalid ? undefined : en.replace('\u00a0', ' ')
}

/**
 * Fetch item IDs from a specified address and validate the data.
 * @example
 * sync()
 * [101, 102, 103]
 * @param {string} ITEM_IDS_ADDRESS - The URL from which to fetch item IDs.
 * @returns {Array<number>} An array of valid item IDs.
 * @description
 *   - Logs a message indicating the URL used for fetching item IDs.
 *   - Ensures the fetched data is an array of numbers.
 *   - Exits the process if the fetch operation fails or if the fetched data is invalid.
 *   - Catches and logs any errors occurring during the fetch process.
 */
const getItemIds = async () => {
  try {
    console.log('Fetching item ids from:', ITEM_IDS_ADDRESS)

    const itemIdResponse = await axios({
      method: 'get',
      url: ITEM_IDS_ADDRESS
    })
    const itemIds = itemIdResponse.data

    if (
      !Array.isArray(itemIds) ||
      !itemIds.length ||
      itemIds.some((value) => typeof value !== 'number')
    ) {
      console.error('Error:', 'Invalid item ids array')
      process.exit(1)
    }

    return itemIds
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  }
}

/**
 * Fetches item names from a specified address and returns them alongside given item IDs.
 * @example
 * sync(['id1', 'id2'])
 * { itemIds: ['id1', 'id2'], itemNames: [...] }
 * @param {Array<string>} itemIds - An array of item IDs that need to be synchronized.
 * @returns {Object} Returns an object containing the provided item IDs and fetched item names.
 * @description
 *   - Utilizes axios for making an HTTP GET request to fetch item names.
 *   - Logs the endpoint being fetched before making the request.
 *   - Exits the process in case of a network error with the error logged to the console.
 */
const getItemNames = async (itemIds) => {
  try {
    console.log('Fetching items from:', ITEM_NAMES_ADDRESS)

    const itemNameResponse = await axios({
      method: 'get',
      url: ITEM_NAMES_ADDRESS
    })

    const itemNames = itemNameResponse.data

    return { itemIds, itemNames }
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  }
}

/**
 * Fetches item name from XIVAPI for a given item ID.
 * @example
 * fetchItemNameFromXIVAPI(12345)
 * { id: 12345, name: "Item Name" }
 * @param {number} itemId - The item ID to fetch.
 * @returns {Promise<Object>} Returns an object with id and name (or null if failed).
 * @description
 *   - Makes an HTTP GET request to XIVAPI to fetch item data.
 *   - Extracts the name from the response fields.
 *   - Handles errors gracefully and returns null for the name if fetch fails.
 */
const fetchItemNameFromXIVAPI = async (itemId) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${XIVAPI_BASE_URL}/${itemId}`,
      timeout: 10000
    })

    if (response.data && response.data.fields && response.data.fields.Name) {
      return { id: itemId, name: response.data.fields.Name }
    }
    return { id: itemId, name: null }
  } catch (err) {
    console.log(`Failed to fetch item ID ${itemId} from XIVAPI: ${err.message}`)
    return { id: itemId, name: null }
  }
}

/**
 * Syncs and writes a map of valid item ids and names to a file.
 * @example
 * sync({ itemIds: [1, 2, 3], itemNames: { '1': 'Item A', '2': 'Item B', '3': 'Item C' } })
 * // Writes the filtered item map to the specified file path.
 * @param {Object} input - An object containing itemIds and itemNames.
 * @param {Array<number>} input.itemIds - Array of item IDs.
 * @param {Object} input.itemNames - An object mapping item IDs to item names.
 * @returns {void} This function does not return anything.
 * @description
 *   - Writes a map of valid item IDs and names to a specified file.
 *   - Exits the process with an error if no valid items are found.
 *   - Logs the number of items successfully written or any error that occurs during file write.
 *   - Uses a validation function, validateItem, to filter valid items.
 *   - Falls back to XIVAPI for items not found in Teamcraft data.
 */
const saveItemList = async ({ itemIds, itemNames }) => {
  console.log('Writing file...')

  const result = {}
  const missingItems = []

  // First pass: collect valid items and identify missing ones
  itemIds.forEach((id) => {
    const validItem = validateItem(itemNames[id])
    if (validItem) {
      result[id] = validItem
    } else {
      missingItems.push(id)
    }
  })

  // Second pass: fetch missing items from XIVAPI
  if (missingItems.length > 0) {
    console.log(`Fetching ${missingItems.length} missing items from XIVAPI...`)

    // Fetch items with a small delay to avoid rate limiting
    for (const itemId of missingItems) {
      const { name } = await fetchItemNameFromXIVAPI(itemId)
      if (name) {
        const validItem = validateItem({ en: name })
        if (validItem) {
          result[itemId] = validItem
        }
      }
      // Small delay to avoid overwhelming the API
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  console.log('Writing file:', FILE_PATH)

  const numberOfItems = Object.keys(result).length

  if (numberOfItems === 0) {
    console.error('ERROR:', 'No items to write')

    process.exit(1)
  }

  writeFile(
    FILE_PATH,
    'export const ffxivItemsMap: Record<string, string> = ' +
      JSON.stringify(result, null, 2),
    function (err) {
      if (err) {
        console.error('ERROR:', err.message)

        process.exit(1)
      }
      console.log('NO# of items successfully written:', numberOfItems)
      process.exit(0)
    }
  )
}

getItemIds()
  .then(getItemNames)
  .then(saveItemList)
  .catch((error) => {
    console.error('Error writing items list:', error.message)

    process.exit(1)
  })
