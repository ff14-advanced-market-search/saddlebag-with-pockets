import { address, UserAgent } from '~/requests/client/config'

export interface BlogResponse {
  itemID: number
  itemDescription: string
}

export interface GetBlogProps {
  itemId: number
}

/**
 * Sends a POST request to the FFXIV blog API with the specified itemId
 * @example
 * GetBlog({ itemId: 12345 })
 * // Returns Promise<Response>
 * @param {Object} {itemId} - ID of the item to be synced with the blog.
 * @returns {Promise<Response>} Returns a promise that resolves to the response of the fetch call.
 * @description
 *   - Converts the itemId to a JSON formatted string before sending the request.
 *   - Uses a specific User-Agent for API requests.
 *   - Logs the request body to the console before executing the fetch.
 */
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
