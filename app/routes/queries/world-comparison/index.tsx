import { useActionData, useTransition } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import ItemServerComparison from '~/requests/ItemServerComparison'
import { getUserSessionData } from '~/sessions'
import { z } from 'zod'
import CheckBox from '~/components/form/CheckBox'
import { useState } from 'react'
import Modal from '~/components/form/Modal'
import { ModalToggleButton } from '~/components/form/Modal/ModalToggleButton'
import { getItemNameById } from '~/utils/items'
import ItemSelect from '~/components/form/select/ItemSelect'
import { TrashIcon } from '@heroicons/react/outline'
import { WorldList } from '~/utils/locations/Worlds'
import TitleTooltip from '~/components/Common/TitleTooltip'

const pathHash: Record<string, string> = {
  hqOnly: 'High Quality Only',
  homeServer: 'Home Server',
  exportServers: 'Export Servers',
  itemIds: 'Items'
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)

  const homeServer = session.getWorld()

  const formPayload = Object.fromEntries(formData)
  const inputSchema = z.object({
    itemIds: z
      .string()
      .min(1)
      .transform((item) => item.split(',').map((id) => parseInt(id, 10))),
    exportServers: z
      .string()
      .min(1)
      .transform((item) => item.split(',')),
    hqOnly: z.optional(z.string()).transform((item) => item === 'true')
  })

  const validInput = inputSchema.safeParse(formPayload)

  if (!validInput.success) {
    return json({
      exception: `Missing: ${validInput.error.issues
        .map(({ path }) => path.map((field) => pathHash[field] || ''))
        .join(', ')}`
    })
  }

  const response = await ItemServerComparison({
    homeServer,
    ...validInput.data
  })
  if (!response.ok) {
    return json({ exception: response.statusText })
  }
  return json({ ...(await response.json()), homeServer })
}

const Index = () => {
  const transition = useTransition()
  const results = useActionData()
  const [modal, setModal] = useState<'exportServers' | 'items' | null>(null)
  const [state, setState] = useState<{
    items: string[]
    exportServers: string[]
  }>({ items: [], exportServers: [] })

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  const error =
    results && results.exception
      ? results.exception
      : results && results?.data?.length === 0
      ? 'No results found'
      : undefined

  console.log(results)

  const itemsLength = state.items.length
  const serversLength = state.exportServers.length
  return (
    <PageWrapper>
      <SmallFormContainer
        title="Compare items across worlds!"
        description="Find out the price of items across multiple worlds. Discover where it's best to buy and sell!"
        onClick={onSubmit}
        loading={transition.state === 'submitting'}
        disabled={transition.state === 'submitting'}
        error={error}>
        <div className="pt-4">
          <div className="sm:px-4 flex flex-col gap-4">
            <div className="flex flex-col max-w-full relative">
              <TitleTooltip
                title="Worlds to compare with your home server"
                toolTip="Choose worlds to see which has the best price for your selected items"
                relative
              />
              <ModalToggleButton
                type="button"
                onClick={() => setModal('exportServers')}>
                Choose Worlds
              </ModalToggleButton>
              <input name="exportServers" value={state.exportServers} hidden />
              <p className="mt-2 ml-1 text-sm text-gray-500">
                {serversLength > 3 || !serversLength
                  ? `${serversLength ? serversLength : 'No'} worlds selected`
                  : state.exportServers.map((name) => name).join(', ')}
              </p>
            </div>

            <div className="flex flex-col max-w-full relative">
              <TitleTooltip
                title="Items you want to compare"
                toolTip="Choose worlds to see which has the best price for your selected items"
                relative
              />
              <ModalToggleButton
                type="button"
                onClick={() => setModal('items')}>
                Choose Items
              </ModalToggleButton>
              <input name="itemIds" hidden value={state.items} />
              <p className="mt-2 ml-1 text-sm text-gray-500">
                {itemsLength > 3 || !itemsLength
                  ? `${itemsLength ? itemsLength : 'No'} items selected`
                  : state.items
                      .map((id) => getItemNameById(id) || '')
                      .join(', ')}
              </p>
            </div>
            <div className="flex flex-col max-w-full relative">
              <TitleTooltip
                title="High quality items only"
                toolTip="If selected will only return high quality items"
                relative
              />
              <CheckBox labelTitle="HQ Only" id="hq-only" name="hqOnly" />
            </div>
          </div>
        </div>
        {modal && (
          <Modal
            title={
              modal === 'items'
                ? 'Choose items to check price on'
                : 'Choose worlds to compare'
            }
            onClose={() => setModal(null)}>
            <div className="mt-2 flex flex-col">
              {modal === 'items' && (
                <>
                  <ItemSelect
                    onSelectChange={(selected) => {
                      if (!selected) return

                      setState({
                        ...state,
                        items: [...state.items, selected.id]
                      })
                    }}
                    tooltip="Type in at least 2 characters to search."
                  />
                  <ul className="first-child:mt-0 last-child:mb-0 mt-2 px-4">
                    {state.items.map((id, index) => (
                      <ItemListRow
                        key={`${id}-${index}`}
                        id={id}
                        onDelete={() =>
                          setState({
                            ...state,
                            items: state.items.filter((item) => item !== id)
                          })
                        }
                      />
                    ))}
                  </ul>
                </>
              )}{' '}
              {modal === 'exportServers' && (
                <div>
                  {Object.entries(WorldList).map(([dataCenter, worlds]) => (
                    <div key={dataCenter}>
                      <p className="text mt-1 font-semibold text-gray-800">
                        {dataCenter}
                      </p>
                      {worlds.map(({ name }) => {
                        const isSelected = state.exportServers.includes(name)

                        return (
                          <CheckBox
                            key={dataCenter + name + state.exportServers}
                            labelTitle={'-- ' + name}
                            id={name}
                            onChange={() => {
                              if (isSelected) {
                                setState({
                                  ...state,
                                  exportServers: state.exportServers.filter(
                                    (world) => world !== name
                                  )
                                })
                              } else {
                                setState({
                                  ...state,
                                  exportServers: [...state.exportServers, name]
                                })
                              }
                            }}
                            checked={isSelected}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Modal>
        )}
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index

const ItemListRow = ({
  id,
  onDelete
}: {
  id: string | number
  onDelete: () => void
}) => (
  <li className="flex items-center w-full justify-between my-1 px-3 py-2 gap:3 bg-gray-100 rounded-md">
    <p className="text-ellipsis overflow-hidden no-wrap text-gray-600">
      {getItemNameById(id)}
    </p>
    <button
      className="rounded p-1 border-gray-300 min-w-fit hover:scale-125 transition ease-in-out duration-300"
      type="button"
      onClick={onDelete}
      aria-label="Delete">
      <TrashIcon className={`h-4 w-4 text-gray-700 mx-auto`} />
    </button>
  </li>
)
