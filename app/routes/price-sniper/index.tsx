import { useLoaderData } from '@remix-run/react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { getSession } from '~/sessions'
import ItemSelect from '~/components/form/select/ItemSelect'
import { SubmitButton } from '~/components/form/SubmitButton'
import { validateWorldAndDataCenter } from '~/utils/locations'
import { useState } from 'react'
import { InputWithLabel } from '~/components/form/InputWithLabel'

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
  desired_state: 'above' | 'below'
  hq: boolean
}

interface SubFormItem {
  itemName: string
  itemID: number
  desiredState: 'above' | 'below'
  hq: boolean
  price: number
}

const parseJSONInput = (input: Array<Auction>) => {
  if (!input.length) {
    return ''
  }

  return `,\n  "user_auctions": [${input.map(
    ({ itemID }) => `\n    { "itemID": ${itemID}}`
  )}\n  ]`
}

const Index = () => {
  const { world } = useLoaderData()
  const [jsonData, setJsonData] = useState<{
    server: string
    userAuctions: Array<Auction>
  }>({ server: world, userAuctions: [] })
  const [subForm, setSubForm] = useState<SubFormItem | null>(null)

  const jsonToDisplay = `{\n  \"home_server\": \"${
    jsonData.server
  }\"${parseJSONInput(jsonData.userAuctions)}\n}`

  return (
    <PageWrapper>
      <>
        <SmallFormContainer
          title="Input for Price Sniper Alerts"
          description="To setup price sniper alerts search, enter items and a desired price. Copy and paste the below input for our Discord Bot."
          onClick={(e) => {
            e.preventDefault()
            if (!subForm) {
              return
            }

            const userAuctions = [...jsonData.userAuctions]

            userAuctions.push({
              itemID: subForm.itemID,
              price: subForm.price,
              desired_state: subForm.desiredState,
              hq: subForm.hq
            })

            setJsonData({ ...jsonData, userAuctions })
            setSubForm(null)
          }}
          buttonTitle="Add">
          <div className="pt-4">
            <ItemSelect
              tooltip="Select an item to be alerted on"
              onSelectChange={(item) => {
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
                <InputWithLabel
                  labelTitle="Price to alert on"
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
                  onChange={(event: React.SyntheticEvent<EventTarget>) => {
                    const value = (event.target as HTMLInputElement).value
                    if (value === 'above' || value === 'below') {
                      setSubForm({
                        ...subForm,
                        desiredState: value
                      })
                    }
                  }}>
                  <label> Alert when price is: </label>
                  <input
                    type="radio"
                    value="below"
                    name="alertOn"
                    defaultChecked={subForm.desiredState === 'below'}
                  />{' '}
                  Below
                  <input
                    type="radio"
                    value="above"
                    name="alertOn"
                    defaultChecked={subForm.desiredState === 'above'}
                  />{' '}
                  Above
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
              </div>
            )}
          </div>
        </SmallFormContainer>

        <div className="max-w-4xl mx-auto px-4">
          <ContentContainer>
            <>
              <Title title="Input for price sniper alert" />
              <pre className="overflow-x-scroll bg-slate-700 text-gray-200 p-4 rounded">
                <code>{jsonToDisplay}</code>
              </pre>
              <div className="max-w-fit my-2">
                <SubmitButton
                  title="Copy to clipboard"
                  type="button"
                  onClick={async () => {
                    if (!window.isSecureContext) {
                      alert('Unable to copy.')
                      return
                    }
                    await navigator.clipboard.writeText(jsonToDisplay)
                    alert('Copied to clipboard!')
                  }}
                />
              </div>
            </>
          </ContentContainer>
        </div>
      </>
    </PageWrapper>
  )
}

export default Index

const HQCheckbox = ({
  onChange,
  checked
}: {
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => (
  <div className="flex justify-center items-center max-w-fit">
    <label htmlFor="hq-only">High Quality Only</label>
    <input
      className="ml-2 rounded p-1"
      id="hq-only"
      type="checkbox"
      checked={checked}
      onChange={onChange}
    />
  </div>
)
