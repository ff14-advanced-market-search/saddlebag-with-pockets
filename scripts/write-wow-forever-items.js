const axios = require('axios')
const { writeFile } = require('fs')
const { USER_AGENT } = require('./config')

const ITEMS_ADDRESS =
  'https://api.saddlebagexchange.com/api/wow/forever/itemnames'

const FILE_PATH = './app/utils/items/wowForeverItems.ts'

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
 * Fetches Forever item names from the Forever itemnames API.
 * @returns {Object} Map of item id string → item name.
 */
const getItems = async () => {
  try {
    console.log('Fetching Forever items from:', ITEMS_ADDRESS)

    const itemNameResponse = await axios({
      method: 'post',
      url: ITEMS_ADDRESS,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT
      },
      data: {
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
 * Validates Forever item names and writes wowForeverItems.ts.
 * @param {Object} items - Map of item id string → item name.
 * @returns {Promise} Resolves when the file is written.
 */
const saveItemList = async (items) => {
  console.log('Writing file...')

  const result = {}

  Object.keys(items).forEach((id) => {
    const validItem = validateItem(id, items[id])
    if (validItem) {
      result[id] = validItem
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
      'export const wowForeverItemsMap: Record<string, string> = ' +
        JSON.stringify(result, null, 2),
      function (err) {
        if (err) {
          console.error('ERROR:', err.message)
          reject(err)
          process.exit(1)
        }
        console.log('NO# of Forever items successfully written:', numberOfItems)
        resolve()
      }
    )
  })
}

getItems()
  .then(saveItemList)
  .then(() => {
    console.log('All Forever items have been written successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error writing Forever items list:', error.message)
    process.exit(1)
  })
