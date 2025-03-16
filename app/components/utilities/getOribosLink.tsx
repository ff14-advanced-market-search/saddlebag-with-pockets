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
  /**
   * Creates a link component for accessing the Undermine Marketplace for a given server and item.
   * @example
   * const linkComponent = getOribosLink('Stormrage', 'View Item', 'EU')
   * const result = linkComponent({ row: { itemID: 12345 } })
   * // Returns a JSX component rendering a link to the item on Undermine Exchange.
   * @param {string | undefined} serverName - The name of the server; if undefined, returns null.
   * @param {string} title - The display text of the link component.
   * @param {WoWServerRegion=} region - Optional region of the server, defaulting to 'US' if not provided.
   * @returns {JSX.Element | null} A JSX Element rendering the external link, or null if inputs are invalid.
   * @description
   *   - Parses the server name using a helper function before constructing the URL.
   *   - Defaults to 'us' region in the link if 'EU' is not specified.
   *   - Returns null if 'itemID' is not a number or 'serverName' is undefined.
   */


    (serverName: string | undefined, title: string, region?: WoWServerRegion) =>
    ({ row }: { row: { itemID: number } }) => {
      const itemId = row.itemID
      if (typeof itemId !== 'number') return null

      if (!serverName) return null

      const parsedServerName = parseServerName(serverName)

      const regionForLink = region === 'EU' ? 'eu' : 'us'

      return (
        <ExternalLink
          link={`https://undermine.exchange/#${regionForLink}-${parsedServerName}/${itemId}`}
          text={title}
          tooltip={`Undermine Marketplace For ${serverName}`}
        />
      )
    }
