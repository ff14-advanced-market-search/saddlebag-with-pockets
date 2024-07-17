import { address, UserAgent } from '~/requests/client/config';

export interface ScripExchangeProps {
  server: string;
  color: string;
}

export interface ScripExchange {
  itemID: number;
  itemName: string;
  cost: number;
  minPrice: number;
  salesAmountNQ: number;
  quantitySoldNQ: number;
  valuePerScrip: number;
  saddleLink: string;
  uniLink: string;
  webpage: string;
}

export type ScripExchangeResults = ScripExchange[];

export const ScripExchangeRequest = async ({ server, color }: ScripExchangeProps): Promise<ScripExchangeResults> => {
  const response = await fetch(`${address}/api/ffxiv/scripexchange`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent,
    },
    body: JSON.stringify({ server, color }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};