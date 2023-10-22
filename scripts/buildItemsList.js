const https = require('https')
const fs = require('fs')

const ADDRESS =
  'https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/staging/libs/data/src/lib/json/items.json'
const FILE_PATH = './app/utils/items/items.ts'
console.log('Fetching items from:', ADDRESS)

https
  .get(ADDRESS, (response) => {
    console.log('Response received:', response.statusCode)
    const data = []

    response.on('data', (chunk) => {
      data.push(chunk)
    })
    response.on('end', () => {
      console.log('Building file...')
      const raw = JSON.parse(Buffer.concat(data).toString())
      const result = {}
      Object.entries(raw).forEach(([id, { en }]) => {
        if (en.length) {
          result[id] = en.replace('\u00a0', ' ')
        }
      })

      console.log('Writing file:', FILE_PATH)

      fs.writeFile(
        FILE_PATH,
        'export const itemsMap: Record<string, string> = ' +
          JSON.stringify(result, null, 2),
        function (err) {
          if (err) throw err
        }
      )
      console.log('Items successfully written')
      process.exit(0)
    })
  })
  .on('error', (error) => {
    console.error(error.message)

    process.exit(1)
  })
