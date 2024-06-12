/* eslint-disable react/display-name */
import ExternalLink from '~/components/utilities/ExternalLink';

export const getSaddlebagWoWLink =
  (title: string) =>
  ({ row }: { row: { itemID: number } }) => {
    const itemID = row.itemID;
    if (typeof itemID !== 'number') return null;

    return (
      <ExternalLink
        link={`https://saddlebagexchange.com/wow/item-data/${itemID}`}
        text={title}
        tooltip={`Best Data For item ${itemID}`}
      />
    );
  };
