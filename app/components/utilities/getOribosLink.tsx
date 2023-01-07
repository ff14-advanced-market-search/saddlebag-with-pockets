/* eslint-disable react/display-name */
import ExternalLink from '~/components/utilities/ExternalLink'

const parseServerName = (serverName: string) =>
  serverName
    .replaceAll('-', '')
    .replaceAll("'", '')
    .replaceAll(' ', '-')
    .toLowerCase()

export const getOribosLink =
  (serverName: string | undefined, title: string) =>
  ({ row }: { row: { itemID: number } }) => {
    const itemId = row.itemID
    if (typeof itemId !== 'number') return null

    if (!serverName) return null

    const parsedServerName = parseServerName(serverName)

    return (
      <ExternalLink
        link={`https://oribos.exchange/#us-${parsedServerName}/${itemId}`}
        text={title}
        tooltip={`Oribos Marketplace For ${serverName}`}
      />
    )
  }
