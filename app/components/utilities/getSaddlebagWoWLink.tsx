/* eslint-disable react/display-name */
import ExternalLink from '~/components/utilities/ExternalLink'

export const getSaddlebagWoWLink =
  /**
   * Generates a custom React component linking to an item's data page.
   * @example
   * generateLinkComponent('Item Title')({ row: { itemID: 123 } })
   * Returns a JSX component with a link to the item data page.
   * @param {string} title - The display text for the link.
   * @returns {function} A function that returns a React component linking to the item data page.
   * @description
   *   - Ensures the itemID is a number before proceeding.
   *   - Uses `itemID` to form the URL for the link.
   *   - Provides a tooltip with item-specific information.
   */
    (title: string) =>
    ({ row }: { row: { itemID: number } }) => {
      const itemID = row.itemID
      if (typeof itemID !== 'number') return null

      return (
        <ExternalLink
          link={`https://saddlebagexchange.com/wow/item-data/${itemID}`}
          text={title}
          tooltip={`Best Data For item ${itemID}`}
        />
      )
    }
