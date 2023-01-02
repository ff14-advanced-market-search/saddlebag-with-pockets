import { useLoaderData } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { LoaderFunction } from '@remix-run/cloudflare'
import ItemSelect from '~/components/Common/ItemSelect'
import { useState } from 'react'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import Label from '~/components/form/Label'
import CodeBlock from '~/components/Common/CodeBlock'
import WoWGetItems from '~/requests/WoWGetItems'
import { RegionRadioGroup } from '~/components/form/WoW/RegionRadioGroup'
import WoWServerSelect from '~/components/form/WoW/WoWServerSelect'
import { findWoWServersIdByName } from '~/utils/WoWServers'

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

const parseUserAuctions = (input: Input) => {
  if (!input.userAuctions.length) {
    return ''
  }

  return `\n  "user_auctions": [${input.userAuctions
    .map(({ itemID, price, desiredState }) => {
      return `\n    { "itemID": ${itemID}, "price": ${(price * 10000).toFixed(
        0
      )}, "desired_state": "${desiredState}" }`
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

const getInputString = (input: Input) => {
  return `{\n  "region": "${input.region}"${getHomeWorldString(
    input
  )}${parseUserAuctions(input)}\n}`
}

export const loader: LoaderFunction = async () => {
  const items = await WoWGetItems()
  return Object.entries(await items.json())
}

const Index = () => {
  const data = useLoaderData<Array<[string, string]>>()
  const [jsonData, setJsonData] = useState<Input>({
    homeRealmName: undefined,
    region: 'NA',
    userAuctions: []
  })
  const [formState, setFormState] = useState<Auction | null>(null)
  const [error, setError] = useState<string | undefined>(undefined)

  const jsonToDisplay = getInputString(jsonData)

  return (
    <PageWrapper>
      <>
        <SmallFormContainer
          title="WoW price alert input generator"
          description="Generate the input for our World of Warcraft item price alerts. Join the Saddlebage Exchange discord server to use this for the discord bot commands '/wow price-register' or '/wow price-update'!"
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
            <ItemSelect
              itemList={data}
              onTextChange={() => {
                if (error) {
                  setError(undefined)
                }
              }}
              onSelectChange={(item) => {
                if (error) {
                  setError(undefined)
                }

                if (!item) {
                  setFormState(null)
                  return
                }

                setFormState({
                  itemName: item.name,
                  itemID: parseInt(item.id, 10),
                  desiredState: 'below',
                  price: 1000
                })
              }}
              tooltip="Select items to generate an alert for"
            />

            {formState && (
              <div className="sm:px-4">
                <InputWithLabel
                  labelTitle="Price to alert on"
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
                  <Label> Alert when price is: </Label>
                  <Label htmlFor="radio-below">
                    <input
                      id="radio-below"
                      type="radio"
                      value="below"
                      name="alertOn"
                      defaultChecked={formState.desiredState === 'below'}
                    />{' '}
                    Below {formState.price.toLocaleString()} Gold
                  </Label>
                  <Label htmlFor="radio-above">
                    <input
                      id="radio-above"
                      type="radio"
                      value="above"
                      name="alertOn"
                      defaultChecked={formState.desiredState === 'above'}
                    />{' '}
                    Above {formState.price.toLocaleString()} Gold
                  </Label>
                </div>
              </div>
            )}
          </>
        </SmallFormContainer>
        <div className="max-w-4xl mx-auto px-4">
          <CodeBlock
            title="Input for price alerts"
            buttonTitle="Copy"
            codeString={jsonToDisplay}
            onClick={() => alert('Copied to clipboard!')}>
            <div className="mb-1">
              <RegionRadioGroup
                onChange={(region) => {
                  if (!region) return

                  const hasServer = jsonData.homeRealmName
                    ? findWoWServersIdByName(jsonData.homeRealmName, region)
                        .length > 0
                    : false

                  const homeRealmName = hasServer
                    ? jsonData.homeRealmName
                    : undefined

                  setJsonData({ ...jsonData, region, homeRealmName })
                  return
                }}
                defaultChecked={jsonData.region}
              />
              <WoWServerSelect
                formName="wow-server-select"
                regionValue={jsonData.region}
                onTextChange={(homeRealmName) => {
                  if (!homeRealmName) {
                    setJsonData({ ...jsonData, homeRealmName })
                    return
                  }
                }}
                onSelectChange={(server) => {
                  if (!server) {
                    setJsonData({ ...jsonData, homeRealmName: undefined })
                    return
                  }

                  setJsonData({ ...jsonData, homeRealmName: server.name })
                }}
                toolTip="Select your home realm name to alert on items on your realms local market or the region wide commodity market!'"
              />
            </div>
          </CodeBlock>
        </div>
      </>
    </PageWrapper>
  )
}

export default Index
