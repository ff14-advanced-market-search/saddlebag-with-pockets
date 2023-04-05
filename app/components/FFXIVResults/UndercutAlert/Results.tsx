import { TrashIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import { RadioButtons } from '~/components/Common/RadioButtons'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import ItemSelect from '~/components/form/Select/ItemSelect'
import { SubmitButton } from '~/components/form/SubmitButton'
import { getItemNameById } from '~/utils/items'
import { Modal } from '../../form/ffxiv/CheckBoxModal'

const Results = ({
  sellerId,
  homeServer
}: {
  sellerId: string
  homeServer: string
}) => {
  const [info, setInfo] = useState<{
    addIds: Array<string>
    removeIds: Array<string>
    hqOnly: boolean
    ignoreDataAfterHours: number
    ignoreStackSize: number
  }>({
    addIds: [],
    removeIds: [],
    hqOnly: false,
    ignoreDataAfterHours: 24 * 30,
    ignoreStackSize: 9999
  })

  const [modal, setModal] = useState<{
    form: 'addIds' | 'removeIds'
    open: boolean
  }>({ form: 'removeIds', open: false })
  const jsonData = `{\n  "seller_id": "${sellerId}",\n  "server": "${homeServer}",\n  "add_ids": [${info.addIds.join(
    ','
  )}],\n  "ignore_ids": [${info.removeIds.join(
    ','
  )}],\n  "hq_only": ${info.hqOnly.toString()},\n  "ignore_data_after_hours": ${
    info.ignoreDataAfterHours
  },\n  "ignore_undercuts_with_quantity_over": ${info.ignoreStackSize}\n}`

  const isAddModal = modal.form === 'addIds'
  return (
    <PageWrapper>
      <ContentContainer>
        <>
          <div className="flex flex-col my-2 gap-2">
            <Title title="Input for undercut alerts" />
            <p className="italic text-sm text-grey-500 mb-1 dark:text-gray-300">
              Copy the text below to your clipboard and use it in our{' '}
              <a
                className="underline"
                href="https://discord.gg/836C8wDVNq"
                target="_blank"
                rel="noreferrer">
                discord server
              </a>{' '}
              for the bot slash command '/ff undercut-register' or '/ff
              undercut-update' to activate{' '}
              <a
                className="underline"
                href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Undercut-Alerts---Alpha-version"
                target="_blank"
                rel="noreferrer">
                patreon undercut alerts.
              </a>
            </p>
            <p className="text-gray-900 dark:text-gray-100"></p>
            <RadioButtons
              title="I want to be alerted on"
              name="alert-type"
              radioOptions={[
                { label: 'All items', value: 'removeIds' },
                { label: 'Selected items', value: 'addIds' }
              ]}
              onChange={(value) => {
                if (value !== 'addIds' && value !== 'removeIds') return
                setModal({ form: value, open: false })
                setInfo({
                  ...info,
                  addIds: [],
                  removeIds: value === 'addIds' ? ['-1'] : []
                })
              }}
              defaultChecked={modal.form}
            />

            <div className={`mt-1 flex rounded-md shadow-sm max-w-fit`}>
              <button
                className="w-full py-2 px-4 text-sm bg-gray-100 border-gray-300 rounded text-left dark:bg-gray-600 dark:text-gray-200 dark:border-gray-600"
                aria-label="Choose filters"
                type="button"
                onClick={() => {
                  setModal({ ...modal, open: true })
                }}>
                {isAddModal ? 'Alert on these items' : 'Filter out these items'}
              </button>
            </div>
            <div className="flex justify-center mt-2 items-center max-w-fit dark:text-gray-300">
              <label htmlFor="hq-only">High Quality Only</label>
              <input
                className="ml-2 rounded p-1"
                id="hq-only"
                type="checkbox"
                checked={info.hqOnly}
                onChange={() =>
                  setInfo((state) => ({ ...state, hqOnly: !state.hqOnly }))
                }
              />
            </div>
            <div className="max-w-sm">
              <InputWithLabel
                type="number"
                labelTitle="Stop alerting after:"
                inputTag={'Hours'}
                toolTip="Don't alert me after data is this many hours old"
                min={1}
                step={1}
                value={info.ignoreDataAfterHours}
                onChange={(e) => {
                  setInfo((state) => ({
                    ...state,
                    ignoreDataAfterHours: parseInt(e.target.value, 10)
                  }))
                }}
              />
            </div>
            <div className="max-w-sm mb-2">
              <InputWithLabel
                type="number"
                labelTitle="Ignore stacks larger than this:"
                inputTag={'Stack Size'}
                toolTip="Don't alert me when undercut by large stacks at cheap prices."
                min={1}
                step={1}
                max={9999}
                value={info.ignoreStackSize}
                onChange={(e) => {
                  setInfo((state) => ({
                    ...state,
                    ignoreStackSize: parseInt(e.target.value, 10)
                  }))
                }}
              />
            </div>

            <pre className="overflow-x-scroll bg-slate-700 text-gray-200 p-4 rounded dark:bg-slate-900">
              <code>{jsonData}</code>
            </pre>
            <div className="max-w-fit my-2">
              <SubmitButton
                title="Copy to clipboard"
                type="button"
                disabled={isAddModal && info.addIds.length === 0}
                onClick={async () => {
                  if (
                    typeof window !== 'undefined' &&
                    typeof document !== 'undefined'
                  ) {
                    if (!window.isSecureContext) {
                      alert('Unable to copy.')
                      return
                    }
                    await navigator.clipboard.writeText(jsonData)
                    alert('Copied to clipboard!')
                  }
                }}
              />
            </div>
          </div>
          {modal.open && (
            <Modal
              title={isAddModal ? 'Include Items' : 'Ignore Items'}
              onClose={() => {
                setModal({ ...modal, open: false })
              }}>
              <div>
                <p className="text-sm text-grey-500 my-1 dark:text-gray-200">
                  {isAddModal
                    ? 'Please search for items that you would like to include in your alert.'
                    : 'Please search for items that you do not wish to be included in your undercut alerts.'}
                </p>
                <ItemSelect
                  onSelectChange={(selected) => {
                    if (!selected) {
                      return
                    }
                    setInfo({
                      ...info,
                      [modal.form]: [...info[modal.form], selected.id]
                    })
                  }}
                  tooltip={
                    isAddModal
                      ? 'Add specific items to your undercut alerts.'
                      : 'Ignore specific items from the alerts.'
                  }
                />
                <ul className="first-child:mt-0 last-child:mb-0 mt-2 px-4">
                  {info[modal.form].map((id, index) => (
                    <li
                      key={`${id}-${index}`}
                      className="flex items-center justify-between my-1 px-2 py-1 gap:3 dark:text-gray-200">
                      <p className="text-ellipsis">{getItemNameById(id)}</p>
                      <button
                        className="rounded p-1 border-gray-300 min-w-fit"
                        type="button"
                        onClick={() => {
                          setInfo({
                            ...info,
                            [modal.form]: info[modal.form].filter(
                              (item) => item !== id
                            )
                          })
                        }}
                        aria-label="Delete">
                        <TrashIcon
                          className={`h-4 w-4 text-gray-500 mx-auto dark:text-gray-300`}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </Modal>
          )}
        </>
      </ContentContainer>
    </PageWrapper>
  )
}

export default Results
