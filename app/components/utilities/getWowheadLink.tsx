/* eslint-disable react/display-name */
import ExternalLink from '~/components/utilities/ExternalLink'

export const getWowheadLink =
  /**
   * Generates a custom React component linking to an item's WoWHead page.
   * @example
   * generateLinkComponent('WoWHead')({ row: { itemID: 123 } })
   * Returns a JSX component with a link to the WoWHead item page.
   * @param {string} title - The display text for the link.
   * @returns {function} A function that returns a React component linking to the WoWHead item page.
   * @description
   *   - Ensures the itemID is a number before proceeding.
   *   - Uses `itemID` to form the URL for the WoWHead link.
   *   - Provides a tooltip with item-specific information.
   */


    (title: string) =>
    ({ row }: { row: { itemID: number } }) => {
      const itemID = row.itemID
      if (typeof itemID !== 'number') return null

      return (
        <ExternalLink
          link={`https://www.wowhead.com/item=${itemID}`}
          text={title}
          tooltip={`WoWHead Data For item ${itemID}`}
        />
      )
    }
