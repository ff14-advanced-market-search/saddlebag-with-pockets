import { address, UserAgent } from '~/requests/client/config'

export interface ForeverUploadTimer {
  region: string
  auctionHouseID: number
  feedType: string
  lastUploadTimeRaw: string
  lastUploadUnix: number
  lastCheckedUnix: number
  lastPublishedUnix: number
  lastHttpStatus: number
  auctionCount: number
}

export interface ForeverUploadTimersResponse {
  data: Array<ForeverUploadTimer>
}

const ForeverUploadTimers = async (): Promise<ForeverUploadTimersResponse> => {
  const response = await fetch(`${address}/api/wow/forever/uploadtimers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({})
  })

  if (!response.ok) {
    return { data: [] }
  }

  const body = (await response.json()) as ForeverUploadTimersResponse
  return { data: Array.isArray(body?.data) ? body.data : [] }
}

export default ForeverUploadTimers
