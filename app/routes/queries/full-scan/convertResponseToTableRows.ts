import type { ResponseType } from '~/requests/FullScan'

export const convertResponseToTableRows = (
  data: ResponseType
): Array<ResponseType> => {
  return Object.entries(data).map((entry: [string, any]) => {
    return { id: parseInt(entry[0]), ...entry[1] }
  })
}
