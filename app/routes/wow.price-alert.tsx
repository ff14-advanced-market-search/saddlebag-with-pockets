import { useLoaderData } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useState } from 'react'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import Label from '~/components/form/Label'
import CodeBlock from '~/components/Common/CodeBlock'
import { findWoWServersIdByName } from '~/utils/WoWServers'
import RegionAndServerSelect from '~/components/form/WoW/RegionAndServerSelect'
import { getUserSessionData } from '~/sessions'
import type { WoWLoaderData, WoWServerRegion } from '~/requests/WoW/types'
import DebouncedSelectInput from '~/components/Common/DebouncedSelectInput'
import { getItemIDByName } from '~/utils/items'
import { wowItems, wowItemsList } from '~/utils/items/id_to_item'

interface Auction {
  itemName: string
  itemID: number
  price: number
  desiredState: 'above' | 'below'
}

interface Input {
  homeRealmName?: string
  region: 'NA' | 'EU'
  userAuctions: Array<Auction>
}

const IS_PRICE_DEFAULT = true

const parseUserAuctions = (input: Input, isPrice: boolean) => {
  if (!input.userAuctions.length) {
    return ''
  }

  return `\n  "user_auctions": [${input.userAuctions
    .map(({ itemID, price, desiredState }) => {
      return `\n    { "itemID": ${itemID}, "${
        isPrice ? 'price' : 'quantity'
      }": ${
        isPrice ? (price * 10000).toFixed(0) : price.toFixed(0)
      }, "desired_state": "${desiredState}" }`
    })
    .join(',')}\n  ]`
}

const getHomeWorldString = (input: Input) => {
  const hasAuctionsComma = input.userAuctions.length ? ',' : ''
  if (!input.homeRealmName) {
    return hasAuctionsComma
  }

  return `,\n  "homeRealmName": "${input.homeRealmName}"${hasAuctionsComma}`
}

const getInputString = (input: Input, isPrice: boolean) => {
  return `{\n  "region": "${input.region}"${getHomeWorldString(
    input
  )}${parseUserAuctions(input, isPrice)}\n}`
}

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: WoW price sniper',
    description:
      'Generate data for Sadddlebag Exchange discord bot wow price sniper alerts'
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const { getWoWSessionData } = await getUserSessionData(request)
  const { server, region } = getWoWSessionData()

  return json({
    wowRealm: server,
    wowRegion: region
  })
}
type LoaderData = WoWLoaderData & {
  data: Array<[string, string]>
}

const Index = () => {
  const { wowRealm, wowRegion } = useLoaderData<LoaderData>()
  const [isPrice, setIsPrice] = useState(IS_PRICE_DEFAULT)
  const [jsonData, setJsonData] = useState<Input>({
    homeRealmName: wowRealm.name,
    region: wowRegion,
    userAuctions: []
  })
  const [formState, setFormState] = useState<Auction | null>(null)
  const [error, setError] = useState<string | undefined>(undefined)

  const jsonToDisplay = getInputString(jsonData, isPrice)

  const handleRegionChange = (region: WoWServerRegion) => {
    if (!region) return

    const hasServer = jsonData.homeRealmName
      ? findWoWServersIdByName(jsonData.homeRealmName, region).length > 0
      : false

    const homeRealmName = hasServer ? jsonData.homeRealmName : undefined

    setJsonData({ ...jsonData, region, homeRealmName })
    return
  }

  const handleTextChange = (homeRealmName?: string) => {
    if (!homeRealmName) {
      setJsonData({ ...jsonData, homeRealmName })
      return
    }
  }

  const handleSelectChange = (server?: { name: string; id: number }) => {
    if (!server) {
      setJsonData({ ...jsonData, homeRealmName: undefined })
      return
    }

    setJsonData({ ...jsonData, homeRealmName: server.name })
  }

  const priceOrQuantity = isPrice ? 'price' : 'quantity'

  const handleInputChange = (name: string) => {
    if (error) {
      setError(undefined)
    }

    const itemID = getItemIDByName(name, wowItems)

    if (!itemID) {
      setFormState(null)
      return
    }

    setFormState({
      itemName: name,
      itemID: parseInt(itemID, 10),
      desiredState: 'below',
      price: 1000
    })
  }

  return (
    <PageWrapper>
      <>
        <SmallFormContainer
          title={`WoW ${priceOrQuantity} alert input generator`}
          description={
            <>
              Pick a list of your favorite World of Warcraft items for{' '}
              {priceOrQuantity} alerts. Then join the{' '}
              <a
                href="https://discord.gg/836C8wDVNq"
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 dark:text-blue-300 hover:underline">
                Saddlebag Exchange Discord Server
              </a>{' '}
              to use this list in for our{' '}
              <a
                href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/WoW-discord-price-sniper-and-spike-alerts"
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 dark:text-blue-300 hover:underline">
                Price Sniper and Price Spike Discord Alerts.
              </a>{' '}
            </>
          }
          error={error}
          onClick={(e) => {
            e.preventDefault()
            if (!formState) {
              setError('No item selected')
              return
            }

            const userAuctions = [...jsonData.userAuctions]

            const { itemID, price, desiredState, itemName } = formState

            userAuctions.push({
              itemID,
              itemName,
              price,
              desiredState
            })

            setJsonData({ ...jsonData, userAuctions })
            setFormState(null)
          }}
          buttonTitle="Add">
          <>
            <div
              className="p-4"
              onChange={(event: React.SyntheticEvent<EventTarget>) => {
                const value = (event.target as HTMLInputElement).value
                if (value === 'price') setIsPrice(true)
                if (value === 'quantity') setIsPrice(false)
              }}>
              <Label>Alert on Price or Quantity of item: </Label>
              <div className="flex gap-2">
                <Label htmlFor="radio-price">
                  <input
                    id="radio-price"
                    type="radio"
                    value="price"
                    name="price-quantity"
                    defaultChecked={isPrice === true}
                  />{' '}
                  Price
                </Label>
                <Label htmlFor="radio-quantity">
                  <input
                    id="radio-quantity"
                    type="radio"
                    value="quantity"
                    name="price-quantity"
                    defaultChecked={isPrice === false}
                  />{' '}
                  Quantity
                </Label>
              </div>
            </div>
            <div className="px-4">
              <DebouncedSelectInput
                id="wow-item-search"
                title="Search for item by name"
                tooltip="Select items to generate an alert for"
                placeholder="Search for items..."
                label="Item"
                selectOptions={wowItemsList}
                onSelect={handleInputChange}
              />
            </div>
            {formState && (
              <div className="sm:px-4">
                <InputWithLabel
                  labelTitle={`${isPrice ? 'Price' : 'Quantity'} to alert on`}
                  type="number"
                  inputTag="Gold"
                  min={0.0}
                  step={100}
                  value={formState.price}
                  onBlur={(event) => {
                    const value = event.target.value
                    if (!value || isNaN(parseFloat(value))) {
                      setFormState({
                        ...formState,
                        price: 1000
                      })
                      return
                    }

                    const price = parseFloat(parseFloat(value).toFixed(2))

                    if (price < 0) {
                      setFormState({
                        ...formState,
                        price: 0
                      })
                      return
                    }

                    setFormState({
                      ...formState,
                      price
                    })
                  }}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      price: parseFloat(e.target.value)
                    })
                  }}
                />
                <div
                  className="my-2"
                  onChange={(event: React.SyntheticEvent<EventTarget>) => {
                    const value = (event.target as HTMLInputElement).value
                    if (value === 'above' || value === 'below') {
                      setFormState({
                        ...formState,
                        desiredState: value
                      })
                    }
                  }}>
                  <Label> Alert when {priceOrQuantity} is: </Label>
                  <Label htmlFor="radio-below">
                    <input
                      id="radio-below"
                      type="radio"
                      value="below"
                      name="alertOn"
                      defaultChecked={formState.desiredState === 'below'}
                    />{' '}
                    Below {formState.price.toLocaleString()}
                    {isPrice ? ' Gold' : ''}
                  </Label>
                  <Label htmlFor="radio-above">
                    <input
                      id="radio-above"
                      type="radio"
                      value="above"
                      name="alertOn"
                      defaultChecked={formState.desiredState === 'above'}
                    />{' '}
                    Above {formState.price.toLocaleString()}
                    {isPrice ? ' Gold' : ''}
                  </Label>
                </div>
              </div>
            )}
          </>
        </SmallFormContainer>
        <div className="max-w-4xl mx-auto px-4">
          <CodeBlock
            title={`Input for ${priceOrQuantity} alerts`}
            buttonTitle="Copy"
            codeString={jsonToDisplay}
            onClick={() => alert('Copied to clipboard!')}>
            <div className="mb-1">
              <p className="italic text-sm text-blue-900 py-2 dark:text-gray-100">
                For the discord bot, use the{' '}
                {isPrice ? (
                  <span>
                    commands <b>'/wow price-register'</b> or{' '}
                    <b>'/wow price-update'</b>
                  </span>
                ) : (
                  <span>
                    command <b>'/wow quantity-register'</b>
                  </span>
                )}
                !
              </p>
              <RegionAndServerSelect
                region={jsonData.region}
                serverSelectFormName="wow-server-select"
                defaultRealm={wowRealm}
                regionOnChange={handleRegionChange}
                onServerTextChange={handleTextChange}
                onServerSelectChange={handleSelectChange}
                serverSelectTooltip="Select your home realm name to alert on items on your realms local market or the region wide commodity market!'"
              />
            </div>
          </CodeBlock>
        </div>
      </>
    </PageWrapper>
  )
}

export default Index
