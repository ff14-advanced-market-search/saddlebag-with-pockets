const axios = require('axios')
const { writeFile } = require('fs')

const ITEMS_ADDRESS = 'http://api.saddlebagexchange.com/api/wow/itemnames'

const FILE_PATHS = {
  regular: './app/utils/items/wowItems.ts',
  stackable: './app/utils/items/wowStackableItems.ts',
  pets: './app/utils/items/wowPetItems.ts'
}

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
* Validates an item ID and item name and returns a sanitized item name.
* @example
* functionName("123", "example_item")
* "example item"
* @param {string} id - The ID of the item, which should be a numeric string.
* @param {string} itemName - The name of the item, which should be a non-empty string.
* @returns {string|undefined} Returns the sanitized item name if valid; otherwise, returns undefined.
* @description
*   - Returns undefined if ID or item name is null, non-string, or empty.
*   - Returns undefined if the ID contains any non-numeric characters.
*   - Checks against invalid strings in a global array `INVALID_STRINGS`.
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

  let isInvalid = false

  INVALID_STRINGS.forEach((term) => {
    if (id.includes(term) || itemName.includes(term)) {
      isInvalid = true
    }
  })

  return isInvalid ? undefined : itemName.replace('\u00a0', ' ')
}

/**
 * Fetches items from a specified address and returns the response data.
 * @example
 * sync()
 * some sample return value
 * @returns {Object} Returns the fetched data from the specified address.
 * @description
 *   - Utilizes 'axios' for making HTTP requests and handles exceptions.
 *   - Logs the error message and terminates the process in case of any request failure.
 *   - Operates asynchronously using 'await' in an async function.
 */
const getItems = async (type = 'regular') => {
  try {
    console.log(`Fetching ${type} items from:`, ITEMS_ADDRESS)

    const data = {
      regular: {},
      stackable: { stackable: true },
      pets: { pets: true }
    }[type]

    const itemNameResponse = await axios({
      method: 'post',
      url: ITEMS_ADDRESS,
      data
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
 * sync({ item1: 'value1', item2: 'value2' })
 * No# of items successfully written: 2
 * @param {Object} items - Collection of items with unique identifiers.
 * @param {string} type - The type of items being processed ('regular', 'stackable', or 'pets')
 * @returns {Promise} A promise that resolves when the file is written.
 * @description
 *   - Writes to FILE_PATH defined in the script.
 *   - Expects each item to be validated using validateItem function.
 *   - Exits the process with error if no items are valid for writing.
 *   - Asynchronously writes JSON to a file using writeFile.
 */
const saveItemList = async (items, type) => {
  console.log('Writing file...')

  const result = {}

  Object.keys(items).forEach((id) => {
    const validItem = validateItem(id, items[id])
    if (validItem) {
      result[id] = validItem
    }
  })

  const filePath = FILE_PATHS[type]
  console.log('Writing file:', filePath)

  const numberOfItems = Object.keys(result).length

  if (numberOfItems === 0) {
    console.error('ERROR:', 'No items to write')
    process.exit(1)
  }

  const mapName = `wow${type.charAt(0).toUpperCase() + type.slice(1)}ItemsMap`

  return new Promise((resolve, reject) => {
    writeFile(
      filePath,
      `export const ${mapName}: Record<string, string> = ` +
        JSON.stringify(result, null, 2),
      function (err) {
        if (err) {
          console.error('ERROR:', err.message)
          reject(err)
          process.exit(1)
        }
        console.log(`NO# of ${type} items successfully written:`, numberOfItems)
        resolve()
      }
    )
  })
}

// Fetch and save all types of items
Promise.all([
  getItems('regular').then(items => saveItemList(items, 'regular')),
  getItems('pets').then(items => saveItemList(items, 'pets')),
  getItems('stackable').then(items => saveItemList(items, 'stackable'))
]).then(() => {
  console.log('All items have been written successfully')
  process.exit(0)
}).catch((error) => {
  console.error('Error writing items list:', error.message)
  process.exit(1)
})
