/* eslint-disable react/display-name */
import ExternalLink from '~/components/utilities/ExternalLink'
import type { WoWServerRegion } from '~/requests/WoW/types'

const parseServerName = (serverName: string) =>
  serverName
    .replaceAll('-', '')
    .replaceAll("'", '')
    .replaceAll(' ', '-')
    .toLowerCase()

export const getOribosLink =
  (serverName: string | undefined, title: string, region?: WoWServerRegion) =>
  ({ row }: { row: { itemID: number } }) => {
    const itemId = row.itemID
    if (typeof itemId !== 'number') return null

    if (!serverName) return null

    const parsedServerName = parseServerName(serverName)

    const regionForLink = region === 'EU' ? 'eu' : 'us'

    return (
      <ExternalLink
        link={`https://oribos.exchange/#${regionForLink}-${parsedServerName}/${itemId}`}
        text={title}
        tooltip={`Oribos Marketplace For ${serverName}`}
      />
    )
  }
