const axios = require('axios')
const { writeFile } = require('fs')

const ITEMS_ADDRESS = 'http://api.saddlebagexchange.com/api/wow/itemnames'

const FILE_PATH = './app/utils/items/wowItems.ts'

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

const getItems = async () => {
  try {
    console.log('Fetching items from:', ITEMS_ADDRESS)

    const itemNameResponse = await axios({
      method: 'post',
      url: ITEMS_ADDRESS,
      data: {}
    })

    return itemNameResponse.data
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  }
}

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

  writeFile(
    FILE_PATH,
    'export const wowItemsMap: Record<string, string> = ' +
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

getItems()
  .then(saveItemList)
  .catch((error) => {
    console.error('Error writing items list:', error.message)

    process.exit(1)
  })
