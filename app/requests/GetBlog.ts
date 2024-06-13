import { address, UserAgent } from '~/requests/client/config'

export interface BlogResponse {
  itemID: number
  itemDescription: string
}

export interface GetBlogProps {
  itemId: number
}

const GetBlog: ({ itemId }: GetBlogProps) => Promise<Response> = async ({
  itemId
}) => {
  const requestBody = JSON.stringify({
    item_id: itemId
  })

  console.log('Request body:', requestBody)

  return fetch(`${address}/api/ffxiv/blog`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: requestBody
  })
}

export default GetBlog
