import { address, UserAgent } from '~/requests/client/config'

export interface UploadTimersResponse {
  data: Array<UploadTimersItem>
}

export interface UploadTimersItem {
  dataSetId: number
  dataSetName: Array<string>
  lastUploadMinute: number
  lastUploadTimeRaw: string
  lastUploadUnix: string
  region: string
  tableName: string
}

const UploadTimers: () => Promise<Response> = async () => {
  return fetch(`${address}/api/wow/uploadtimers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({})
  })
}

export default UploadTimers
