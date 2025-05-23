import { useLoaderData } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { LoaderFunction, MetaFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { getSession } from '~/sessions'
import { validateWorldAndDataCenter } from '~/utils/locations'
import { useState } from 'react'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import Label from '~/components/form/Label'
import HQCheckbox from '~/components/form/HQCheckbox'
import CodeBlock from '~/components/Common/CodeBlock'
import ItemSelect from '~/components/form/select/ItemSelect'
import CheckBox from '~/components/form/CheckBox'
import Banner from '~/components/Common/Banner'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: FFXIV price sniper',
    description:
      'Generate data for Sadddlebag Exchange discord bot ffxiv price sniper alerts',
    customHeading:
      'Stay Ahead with FFXIV Price Sniper Alerts from Saddlebag Exchange',
    links: [
      {
        rel: 'canonical',
        href: 'https://saddlebagexchange.com/price-sniper'
      }
    ]
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))
  const { world, data_center } = validateWorldAndDataCenter(
    session.get('world'),
    session.get('data_center')
  )
  return json({ ...session.data, world, data_center })
}

interface Auction {
  itemID: number
  price: number
  desiredState: 'above' | 'below'
  hq: boolean
}

interface SubFormItem {
  itemName: string
  itemID: number
  desiredState: 'above' | 'below'
  hq: boolean
  price: number
}

export const parseJSONInput = (input: Array<Auction>, isPrice = true) => {
  if (!input.length) {
    return ''
  }

  return `,\n  "user_auctions": [${input
    .map(({ itemID, price, desiredState, hq }) => {
      return `\n    { "itemID": ${itemID}, "${
        isPrice ? 'price' : 'quantity'
      }": ${price}, "desired_state": "${desiredState}", "hq": ${hq} }`
    })
    .join(',')}\n  ]`
}

const Index = () => {
  const { world } = useLoaderData()
  const [jsonData, setJsonData] = useState<{
    server: string
    userAuctions: Array<Auction>
  }>({ server: world, userAuctions: [] })
  const [subForm, setSubForm] = useState<SubFormItem | null>(null)
  const [error, setError] = useState<string | undefined>(undefined)
  const [isPrice, setIsPrice] = useState(true)
  const [dcOnly, setDcOnly] = useState(false)

  const jsonToDisplay = `{\n  "home_server": "${
    jsonData.server
  }",\n  "user_auctions": [${jsonData.userAuctions
    .map(
      ({ itemID, price, desiredState, hq }) =>
        `\n    { "itemID": ${itemID}, "price": ${price}, "desired_state": "${desiredState}", "hq": ${hq} }`
    )
    .join(',')}\n  ]${dcOnly ? ',\n  "dc_only": true' : ''}\n}`

  const isPriceValue = isPrice ? 'price' : 'quantity'

  const description = `To setup ${isPriceValue} alerts search, enter items and a desired
  ${isPriceValue}. Copy and paste the below input for the Discord Bot in the
  Saddlebag Exchange discord server.`

  return (
    <PageWrapper>
      <>
        <Banner />
        <SmallFormContainer
          title="Input for Price Sniper Alerts"
          description={description}
          error={error}
          onClick={(e) => {
            e.preventDefault()
            if (!subForm) {
              setError('No item selected')
              return
            }

            const userAuctions = [...jsonData.userAuctions]

            const { itemID, price, desiredState, hq } = subForm

            userAuctions.push({
              itemID,
              price,
              desiredState,
              hq
            })

            setJsonData({ ...jsonData, userAuctions })
            setSubForm(null)
          }}
          buttonTitle="Add">
          <div className="pt-4">
            <ItemSelect
              tooltip="Select an item to be alerted on"
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
                  setSubForm(null)
                  return
                }

                setSubForm({
                  itemName: item.name,
                  itemID: parseInt(item.id, 10),
                  desiredState: 'below',
                  hq: false,
                  price: 1000
                })
              }}
            />

            {subForm && (
              <div className="sm:px-4">
                <div
                  className="my-2"
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
                <InputWithLabel
                  labelTitle={`${isPrice ? 'Price' : 'Quantity'} to alert on`}
                  type="number"
                  inputTag="Gil"
                  min={0}
                  step={100}
                  value={subForm.price}
                  onBlur={(event) => {
                    const value = event.target.value
                    if (!value || isNaN(parseInt(value, 10))) {
                      setSubForm({
                        ...subForm,
                        price: 1000
                      })
                      return
                    }

                    const price = parseInt(value, 10)

                    if (price < 0) {
                      setSubForm({
                        ...subForm,
                        price: 0
                      })
                      return
                    }

                    setSubForm({
                      ...subForm,
                      price: parseInt(value, 10)
                    })
                  }}
                  onChange={(e) => {
                    setSubForm({
                      ...subForm,
                      price: parseInt(e.target.value, 10)
                    })
                  }}
                />
                <div
                  className="my-2"
                  onChange={(event: React.SyntheticEvent<EventTarget>) => {
                    const value = (event.target as HTMLInputElement).value
                    if (value === 'above' || value === 'below') {
                      setSubForm({
                        ...subForm,
                        desiredState: value
                      })
                    }
                  }}>
                  <Label> Alert when {isPriceValue} is: </Label>
                  <Label htmlFor="radio-below">
                    <input
                      id="radio-below"
                      type="radio"
                      value="below"
                      name="alertOn"
                      defaultChecked={subForm.desiredState === 'below'}
                    />{' '}
                    Below {`${subForm.price} ${isPrice ? 'Gil' : ''}`}
                  </Label>
                  <Label htmlFor="radio-above">
                    <input
                      id="radio-above"
                      type="radio"
                      value="above"
                      name="alertOn"
                      defaultChecked={subForm.desiredState === 'above'}
                    />{' '}
                    Above {`${subForm.price} ${isPrice ? 'Gil' : ''}`}
                  </Label>
                </div>
                <HQCheckbox
                  checked={subForm.hq}
                  onChange={(event) =>
                    setSubForm({
                      ...subForm,
                      hq: event.target.checked
                    })
                  }
                />
                <div className="my-2 flex items-center">
                  <Label
                    htmlFor="dc-only"
                    className="font-medium text-gray-700 dark:text-gray-200">
                    DC Only
                  </Label>
                  <CheckBox
                    id="dc-only"
                    checked={dcOnly}
                    onChange={() => setDcOnly(!dcOnly)}
                    className="ml-2 rounded p-1"
                    labelTitle=""
                  />
                </div>
              </div>
            )}
          </div>
        </SmallFormContainer>

        <div className="max-w-4xl mx-auto px-4">
          <CodeBlock
            title={`Input for ${isPriceValue} sniper alert`}
            buttonTitle="Copy to clipboard"
            codeString={jsonToDisplay}
            onClick={() => alert('Copied to clipboard!')}>
            <p className="italic text-sm text-blue-900 py-2 dark:text-gray-100">
              For the discord bot, use the{' '}
              {isPrice ? (
                <span>
                  commands <b>'/ff price-register'</b> or{' '}
                  <b>'/ff price-update'</b>
                </span>
              ) : (
                <span>
                  command <b>'/ff quantity-register'</b>
                </span>
              )}
              !
            </p>
          </CodeBlock>
        </div>
      </>
    </PageWrapper>
  )
}

export default Index
