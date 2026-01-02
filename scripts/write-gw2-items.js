const axios = require('axios')
const { writeFile } = require('fs')

const ITEMS_ADDRESS =
  'https://api.saddlebagexchange.com/api/gw2/marketableitems'

const FILE_PATH = './app/utils/items/gw2Items.ts'

/**
 * Validates an item ID and item name and returns a sanitized item name.
 * @example
 * validateItem("123", "example_item")
 * "example item"
 * @param {string} id - The ID of the item, which should be a numeric string.
 * @param {string} itemName - The name of the item, which should be a non-empty string.
 * @returns {string|undefined} Returns the sanitized item name if valid; otherwise, returns undefined.
 * @description
 *   - Returns undefined if ID or item name is null, non-string, or empty.
 *   - Returns undefined if the ID contains any non-numeric characters.
 *   - Replaces non-breaking spaces in the item name with regular spaces.
 */
const validateItem = (id, itemName) => {
  if (id == null || itemName == null) {
    return undefined
  }

  if (typeof id !== 'string' || typeof itemName !== 'string') {
    return undefined
  }

  if (!id.length || !itemName.length) {
    return undefined
  }

  if (!/^\d+$/.test(id)) {
    return undefined
  }

  return itemName.replace(/\u00a0/g, ' ')
}

/**
 * Fetches items from a specified address and returns the response data.
 * @example
 * getItems()
 * { "123": "Item Name", "456": "Another Item" }
 * @returns {Object} Returns the fetched data from the specified address.
 * @description
 *   - Utilizes 'axios' for making HTTP requests and handles exceptions.
 *   - Logs the error message and terminates the process in case of any request failure.
 *   - Operates asynchronously using 'await' in an async function.
 *   - Sends POST request with filter parameters to get all marketable items.
 */
const getItems = async () => {
  try {
    console.log('Fetching items from:', ITEMS_ADDRESS)

    const itemNameResponse = await axios({
      method: 'post',
      url: ITEMS_ADDRESS,
      data: {
        type: -1,
        details_type: -1,
        rarity: -1,
        level: 0,
        item_ids: []
      }
    })

    return itemNameResponse.data
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  }
}

/**
 * Synchronizes a collection of items by validating them and writing to a file.
 * @example
 * saveItemList({ "99185": { itemID: 99185, name: "Item Name", ... } })
 * No# of items successfully written: 1
 * @param {Object} items - Collection of items where each value is an object with itemID and name properties.
 * @returns {Promise} A promise that resolves when the file is written.
 * @description
 *   - Writes to FILE_PATH defined in the script.
 *   - Expects each item to be an object with itemID (number) and name (string) properties.
 *   - Validates each item using validateItem function.
 *   - Exits the process with error if no items are valid for writing.
 *   - Asynchronously writes JSON to a file using writeFile.
 */
const saveItemList = async (items) => {
  console.log('Writing file...')

  const result = {}

  Object.keys(items).forEach((key) => {
    const item = items[key]
    if (item && item.itemID != null && item.name != null) {
      const itemId = String(item.itemID)
      const validItem = validateItem(itemId, item.name)
      if (validItem) {
        result[itemId] = validItem
      }
    }
  })

  console.log('Writing file:', FILE_PATH)

  const numberOfItems = Object.keys(result).length

  if (numberOfItems === 0) {
    console.error('ERROR:', 'No items to write')
    process.exit(1)
  }

  return new Promise((resolve, reject) => {
    writeFile(
      FILE_PATH,
      'export const gw2ItemsMap: Record<string, string> = ' +
        JSON.stringify(result, null, 2),
      function (err) {
        if (err) {
          console.error('ERROR:', err.message)
          reject(err)
          process.exit(1)
        }
        console.log('NO# of items successfully written:', numberOfItems)
        resolve()
      }
    )
  })
}

// Fetch and save items
getItems()
  .then(saveItemList)
  .then(() => {
    console.log('All items have been written successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error writing items list:', error.message)
    process.exit(1)
  })
