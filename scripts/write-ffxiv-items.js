const axios = require('axios')
const { writeFile } = require('fs')

const ITEM_NAMES_ADDRESS =
  'https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/staging/libs/data/src/lib/json/items.json'

const FILE_PATH = './app/utils/items/ffxivItems.ts'

const ITEM_IDS_ADDRESS = 'https://universalis.app/api/marketable'

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

const validateItem = ({ en }) => {
  if (en === undefined) {
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

const saveItemList = async ({ itemIds, itemNames }) => {
  console.log('Writing file...')

  const result = {}

  itemIds.forEach((id) => {
    const validItem = validateItem(itemNames[id])
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
