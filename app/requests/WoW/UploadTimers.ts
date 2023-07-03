import { address, UserAgent } from '~/requests/client/config'

export type UploadTimersResponse = Array<UploadTimersItem>

export interface UploadTimersItem {
  dataSetID: number
  dataSetName: Array<string>
  lastUploadMinute: number
  lastUploadTimeRaw: string
  lastUploadUnix: number
  region: string
  tableName: string
}

const UploadTimersRequest = async () =>
  await fetch(`${address}/api/wow/upload-timers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({})
  })

export default UploadTimersRequest
