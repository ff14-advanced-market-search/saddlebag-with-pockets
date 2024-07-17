import { useActionData, useNavigation } from '@remix-run/react';
import type { ActionFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import NoResults from '~/components/Common/NoResults';
import { getUserSessionData } from '~/sessions';
import { useEffect, useState } from 'react';
import SmallFormContainer from '~/components/form/SmallFormContainer';
import SmallTable from '~/components/WoWResults/FullScan/SmallTable';
import { PageWrapper, TitleH2 } from '~/components/Common';
import { useDispatch } from 'react-redux';
import { setItemHistory } from '~/redux/reducers/queriesSlice';
import { useTypedSelector } from '~/redux/useTypedSelector';
import Select from '~/components/form/select'
import { ScripExchangeRequest } from '~/requests/FFXIV/scrip-exchange'; // Imported ScripExchangeRequest

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: FFXIV Scrip Exchange',
    description: 'Saddlebag Exchange: FFXIV scrip exchange details',
  };
};

export const links: LinksFunction = () => [
  {
    rel: 'canonical',
    href: 'https://saddlebagexchange.com/ffxiv/scrip-exchange',
  },
];

const validateInput = ({
  server,
  color,
}: {
  server?: FormDataEntryValue | null;
  color?: FormDataEntryValue | null;
}): { server: string; color: string } | { exception: string } => {
  if (server === undefined || server === null) {
    return { exception: 'Server not found' };
  }

  if (color === undefined || color === null) {
    return { exception: 'Color not set' };
  }

  if (typeof server !== 'string') {
    return { exception: 'Invalid server' };
  }

  if (typeof color !== 'string') {
    return { exception: 'Invalid color' };
  }

  return { server, color };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const session = await getUserSessionData(request);

  const validInput = validateInput({
    server: session.getWorld(),
    color: formData.get('color'),
  });

  if ('exception' in validInput) {
    return validInput;
  }

  try {
    const data = await ScripExchangeRequest(validInput); // Used ScripExchangeRequest function
    console.log(data)

    if (!data.entries) {
      return json({ exception: 'No entries found.' });
    }

    return json({ entries: data.entries, payload: validInput });
  } catch (err) {
    console.error('Error fetching data:', err);
    return { exception: 'Error fetching data.' };
  }
};

const parseServerError = (error: string) => {
  if (error.includes('Error fetching data:')) {
    return 'Failed to receive result from external API';
  }

  return error;
};

const FFXIVScripExchange = () => {
  const transition = useNavigation();
  const results = useActionData();
  const [formState, setFormState] = useState<{ color: string } | undefined>();
  const [error, setError] = useState<string | undefined>();
  const { darkmode } = useTypedSelector((state) => state.user);
  const { itemHistory } = useTypedSelector((state) => state.queries);
  const dispatch = useDispatch();

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting' || !formState) {
      e.preventDefault();
      return;
    }
  };

  useEffect(() => {
    if (results && results.entries) {
      dispatch(setItemHistory(results));
    } else if (results && results.exception) {
      const message = parseServerError(results.exception);
      setError(`Server Error: ${message}`);
    } else if (results && results.payload) {
      setError('No results found');
    }
  }, [results, dispatch]);

  const handleFormChange = (name: string, value: string) => {
    if (error) {
      setError(undefined);
    }
    setFormState({ ...formState, [name]: value });
  };

  const handleTextChange = () => {
    setError(undefined);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  let tableData = [];
  if (itemHistory?.entries) {
    tableData = itemHistory.entries.map((entry) => ({
      itemID: entry.itemID,
      itemName: entry.itemName,
      cost: entry.cost,
      minPrice: entry.minPrice,
      salesAmountNQ: entry.salesAmountNQ,
      quantitySoldNQ: entry.quantitySoldNQ,
      valuePerScrip: entry.valuePerScrip,
      saddleLink: entry.saddleLink,
      uniLink: entry.uniLink,
      webpage: entry.webpage,
    }));
  }

  const columnList = [
    { columnId: 'itemID', header: 'Item ID' },
    { columnId: 'itemName', header: 'Item Name' },
    { columnId: 'cost', header: 'Cost' },
    { columnId: 'minPrice', header: 'Min Price' },
    { columnId: 'salesAmountNQ', header: 'Sales Amount NQ' },
    { columnId: 'quantitySoldNQ', header: 'Quantity Sold NQ' },
    { columnId: 'valuePerScrip', header: 'Value Per Scrip' },
    { columnId: 'saddleLink', header: 'Saddle Link' },
    { columnId: 'uniLink', header: 'Uni Link' },
    { columnId: 'webpage', header: 'Webpage' },
  ];

  const sortingOrder = [
    { id: 'itemID', desc: true },
  ];

  return (
    <PageWrapper>
      <>
        <div className="py-3">
          <SmallFormContainer
            title="Find Scrip Exchange"
            onClick={onSubmit}
            error={error}
            loading={transition.state === 'submitting'}
            disabled={!formState}
          >
            <>
              <Select
                title="Scrip Color"
                name="color"
                defaultValue="Orange"
                options={[
                  { label: 'Orange', value: 'Orange' },
                  { label: 'Purple', value: 'Purple' }
                ]}
                onChange={(e) => handleFormChange('color', e.target.value)}
              />
            </>
          </SmallFormContainer>
        </div>
        {error === 'No results found' && !itemHistory && (
          <NoResults href={`/ffxiv-scrip-exchange`} />
        )}
        {itemHistory && itemHistory.entries && (
          <SmallTable
            data={tableData}
            sortingOrder={sortingOrder}
            columnList={columnList}
            title="Scrip Exchange"
            description="Details of scrip exchange items"
          />
        )}
      </>
    </PageWrapper>
  );
};

export default FFXIVScripExchange;