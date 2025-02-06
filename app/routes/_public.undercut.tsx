import { useLoaderData, useNavigation } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type {
  LoaderFunction,
  MetaFunction,
  LinksFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useState } from 'react'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import Label from '~/components/form/Label'
import CodeBlock from '~/components/Common/CodeBlock'
import { getUserSessionData } from '~/sessions'
import Banner from '~/components/Common/Banner'
import { RadioButtons } from '~/components/Common/RadioButtons'
import ItemSelect from '~/components/form/select/ItemSelect'
import { TrashIcon } from '@heroicons/react/outline'
import Modal from '~/components/form/Modal'
import SelectDCandWorld from '~/components/form/select/SelectWorld'

export const meta: MetaFunction = () => {
  return {
    title: 'FFXIV Discord Undercut and Sale Alerts',
    description:
      'Generate data for Saddlebag Exchange discord bot ffxiv undercut and sale alerts.',
    viewport: 'width=device-width,initial-scale=1',
    charSet: 'utf-8'
  }
}

export const links: LinksFunction = () => [
  { rel: 'canonical', href: 'https://saddlebagexchange.com/undercut' }
]

interface AlertConfig {
  retainer_names: string[]
  server: string
  add_ids: string[]
  ignore_ids: string[]
  hq_only: boolean
  ignore_data_after_hours: number
  ignore_undercuts_with_quantity_over: number
}

export const loader: LoaderFunction = async ({ request }) => {
  const { getWorld, getDataCenter } = await getUserSessionData(request)
  return json({
    data_center: getDataCenter(),
    world: getWorld()
  })
}

const Index = () => {
  const loaderData = useLoaderData()
  const navigation = useNavigation()
  const { world } = loaderData

  const [config, setConfig] = useState<AlertConfig>({
    retainer_names: [],
    server: world,
    add_ids: [],
    ignore_ids: [],
    hq_only: false,
    ignore_data_after_hours: 720,
    ignore_undercuts_with_quantity_over: 9999
  })

  const [modal, setModal] = useState<{
    type: 'add_items' | 'ignore_items' | 'retainers'
    open: boolean
  }>({ type: 'retainers', open: false })

  const [alertType, setAlertType] = useState<'all' | 'selected'>('all')

  const jsonData = JSON.stringify(config, null, 2)
  const salesAlertJson = JSON.stringify(
    {
      retainer_names: config.retainer_names,
      server: config.server,
      item_ids: []
    },
    null,
    2
  )

  return (
    <PageWrapper>
      <Banner />
      <div className="max-w-4xl mx-auto px-4">
        <SmallFormContainer
          title="Input for undercut alerts"
          description={
            <p className="italic text-sm text-grey-700 px-3 py-1 dark:text-gray-300">
              Configure your undercut alerts below. Copy the generated JSON and
              use it with the '/ff undercut' command in our Discord server.
            </p>
          }
          buttonTitle="Save Changes"
          onClick={(e) => {
            e.preventDefault()
          }}>
          <div className="p-4">
            <RadioButtons
              title="I want to be alerted on"
              name="alert-type"
              radioOptions={[
                { label: 'All items', value: 'all' },
                { label: 'Selected items', value: 'selected' }
              ]}
              onChange={(value) => {
                setAlertType(value as 'all' | 'selected')
                setConfig((prev) => ({
                  ...prev,
                  add_ids: value === 'selected' ? prev.add_ids : [],
                  ignore_ids: value === 'all' ? prev.ignore_ids : []
                }))
              }}
              defaultChecked={alertType}
            />

            <div className="flex flex-col gap-4 mt-4">
              <button
                type="button"
                className="w-full py-2 px-4 text-sm bg-gray-100 border-gray-300 rounded text-left dark:bg-gray-600 dark:text-gray-200 dark:border-gray-600"
                onClick={() => setModal({ type: 'retainers', open: true })}>
                Add Retainers
              </button>

              {alertType === 'selected' && (
                <button
                  type="button"
                  className="w-full py-2 px-4 text-sm bg-gray-100 border-gray-300 rounded text-left dark:bg-gray-600 dark:text-gray-200 dark:border-gray-600"
                  onClick={() => setModal({ type: 'add_items', open: true })}>
                  Add Items to Track
                </button>
              )}

              {alertType === 'all' && (
                <button
                  type="button"
                  className="w-full py-2 px-4 text-sm bg-gray-100 border-gray-300 rounded text-left dark:bg-gray-600 dark:text-gray-200 dark:border-gray-600"
                  onClick={() =>
                    setModal({ type: 'ignore_items', open: true })
                  }>
                  Add Items to Ignore
                </button>
              )}
            </div>

            <div className="my-4 flex items-center">
              <Label htmlFor="hq-only">High Quality Only</Label>
              <input
                type="checkbox"
                id="hq-only"
                checked={config.hq_only}
                onChange={(e) => {
                  setConfig((prev) => ({ ...prev, hq_only: e.target.checked }))
                }}
                className="ml-2 rounded p-1"
              />
            </div>

            <InputWithLabel
              type="number"
              labelTitle="Stop alerting after:"
              inputTag="Hours"
              value={config.ignore_data_after_hours}
              onChange={(e) => {
                setConfig((prev) => ({
                  ...prev,
                  ignore_data_after_hours: Number.parseInt(e.target.value, 10)
                }))
              }}
            />

            <InputWithLabel
              type="number"
              labelTitle="Ignore stacks larger than:"
              inputTag="Stack Size"
              value={config.ignore_undercuts_with_quantity_over}
              onChange={(e) => {
                setConfig((prev) => ({
                  ...prev,
                  ignore_undercuts_with_quantity_over: Number.parseInt(
                    e.target.value,
                    10
                  )
                }))
              }}
            />

            <SelectDCandWorld
              sessionData={loaderData}
              navigation={navigation}
              onChange={(world) => {
                if (world) {
                  setConfig((prev) => ({
                    ...prev,
                    server: world.world
                  }))
                }
              }}
            />
          </div>
        </SmallFormContainer>

        <div className="mt-8">
          <CodeBlock
            title="Input for undercut alerts"
            buttonTitle="Copy to clipboard"
            codeString={jsonData}
            onClick={() => {
              alert('Copied to clipboard!')
            }}>
            <p className="italic text-sm text-blue-900 py-2 dark:text-gray-100">
              Copy this to your clipboard and use it in our discord server for
              the bot slash command '/ff undercut' to activate or update patreon
              undercut alerts.
            </p>
          </CodeBlock>
        </div>

        <div className="mt-8">
          <CodeBlock
            title="Input for Sales Alerts"
            buttonTitle="Copy to clipboard"
            codeString={salesAlertJson}
            onClick={() => alert('Copied to clipboard!')}>
            <p className="italic text-sm text-blue-900 py-2 dark:text-gray-100">
              Copy this to your clipboard and use it in our discord server for
              the bot slash command '/ff sale-register' to activate patreon sale
              alerts.
            </p>
          </CodeBlock>
        </div>
      </div>

      {modal.open && (
        <Modal
          title={
            modal.type === 'retainers'
              ? 'Add Retainers'
              : modal.type === 'add_items'
              ? 'Add Items to Track'
              : 'Add Items to Ignore'
          }
          onClose={() => {
            setModal((prev) => ({ ...prev, open: false }))
          }}>
          <div className="p-4">
            {modal.type === 'retainers' ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Enter retainer name"
                  className="rounded p-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      setConfig((prev) => ({
                        ...prev,
                        retainer_names: [
                          ...prev.retainer_names,
                          e.currentTarget.value
                        ]
                      }))
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <ul className="mt-4">
                  {config.retainer_names.map((name, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center py-2">
                      <span>{name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            retainer_names: prev.retainer_names.filter(
                              (_, i) => i !== idx
                            )
                          }))
                        }>
                        <TrashIcon className="h-5 w-5 text-gray-500" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <ItemSelect
                  tooltip={
                    modal.type === 'add_items'
                      ? 'Select items to track'
                      : 'Select items to ignore'
                  }
                  onSelectChange={(item) => {
                    if (!item) return
                    const arrayKey =
                      modal.type === 'add_items' ? 'add_ids' : 'ignore_ids'
                    setConfig((prev) => ({
                      ...prev,
                      [arrayKey]: [...prev[arrayKey], item.id]
                    }))
                  }}
                />
                <ul className="mt-4">
                  {(modal.type === 'add_items'
                    ? config.add_ids
                    : config.ignore_ids
                  ).map((id, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center py-2">
                      <span>{id}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const arrayKey =
                            modal.type === 'add_items'
                              ? 'add_ids'
                              : 'ignore_ids'
                          setConfig((prev) => ({
                            ...prev,
                            [arrayKey]: prev[arrayKey].filter(
                              (_, i) => i !== idx
                            )
                          }))
                        }}>
                        <TrashIcon className="h-5 w-5 text-gray-500" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Modal>
      )}
    </PageWrapper>
  )
}

export default Index
