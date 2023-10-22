const { get } = require('https')
const { writeFile } = require('fs')

const ITEM_NAMES_ADDRESS =
  'https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/staging/libs/data/src/lib/json/items.json'

const FILE_PATH = './app/utils/items/items.ts'

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

try {
  let itemIds

  console.log('Fetching itemIds from:', ITEM_IDS_ADDRESS)
  get(ITEM_IDS_ADDRESS, (response) => {
    console.log('Item id status code:', response.statusCode)

    const data = []
    response.on('data', (chunk) => {
      data.push(chunk)
    })

    response.on('error', (error) => {
      console.error('ERROR:', error.message)

      process.exit(1)
    })

    response.on('end', () => {
      const rawIds = JSON.parse(Buffer.concat(data).toString())
      if (
        Array.isArray(rawIds) &&
        rawIds.length &&
        rawIds.every((val) => typeof val === 'number')
      ) {
        itemIds = rawIds
        console.log('Number of item ids:', itemIds.length)
      } else {
        console.error('ERROR: Invalid items list')

        process.exit(1)
      }

      console.log('Fetching items from:', ITEM_NAMES_ADDRESS)

      get(ITEM_NAMES_ADDRESS, (res) => {
        console.log('Item name status code:', res.statusCode)
        const nameData = []

        res.on('data', (chunk) => {
          nameData.push(chunk)
        })

        res.on('end', () => {
          const rawNames = JSON.parse(Buffer.concat(nameData).toString())

          console.log('Building file...')

          const result = {}

          itemIds.forEach((id) => {
            const validItem = validateItem(rawNames[id])
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
            'export const itemsMap: Record<string, string> = ' +
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
        })

        res.on('error', (error) => {
          console.error('ERROR:', error.message)

          process.exit(1)
        })
      })
    })
  })
} catch (error) {
  console.error('Error writing items list:', error.message)

  process.exit(1)
}
