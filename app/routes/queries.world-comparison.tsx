import {
  useActionData,
  useLoaderData,
  useNavigation,
  useNavigate
} from '@remix-run/react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import ItemServerComparison from '~/requests/FFXIV/ItemServerComparison'
import type { ItemServerComparisonList } from '~/requests/FFXIV/ItemServerComparison'
import { getUserSessionData, getSession } from '~/sessions'
import { z } from 'zod'
import CheckBox from '~/components/form/CheckBox'
import { useState } from 'react'
import Modal from '~/components/form/Modal'
import { ModalToggleButton } from '~/components/form/Modal/ModalToggleButton'
import { getItemNameById } from '~/utils/items'
import ItemSelect from '~/components/form/select/ItemSelect'
import {
  ChevronUpIcon,
  TrashIcon,
  ChevronDownIcon
} from '@heroicons/react/outline'
import { WorldList } from '~/utils/locations/Worlds'
import TitleTooltip from '~/components/Common/TitleTooltip'
import {
  getActionUrl,
  handleSearchParamChange
} from '~/utils/urlSeachParamsHelpers'
import { SubmitButton } from '~/components/form/SubmitButton'
import PremiumPaywall from '~/components/Common/PremiumPaywall'
import { getHasPremium, DISCORD_SERVER_URL } from '~/utils/premium'

const pathHash: Record<string, string> = {
  hqOnly: 'High Quality Only',
  homeServer: 'Home Server',
  exportServers: 'Export Servers',
  items: 'Items'
}

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: ffxiv export search',
    description:
      'Explore and compare FFXIV item prices across different servers with Saddlebag Exchange.',
    links: [
      {
        rel: 'canonical',
        href: 'https://saddlebagexchange.com/queries/world-comparison'
      }
    ]
  }
}

// Define default form values
const defaultFormValues = {
  items: '',
  exportServers: '',
  hqOnly: 'false'
}

// Define input schema for validation
const inputSchema = z.object({
  items: z.string().min(1),
  exportServers: z.string().min(1),
  hqOnly: z.optional(z.string())
})

// Loader function to handle URL parameters
export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams

  const values = {
    items: params.get('items') || defaultFormValues.items,
    exportServers:
      params.get('exportServers') || defaultFormValues.exportServers,
    hqOnly: params.get('hqOnly') || defaultFormValues.hqOnly
  }

  // Get Discord session info
  const session = await getSession(request.headers.get('Cookie'))
  const discordId = session.get('discord_id')
  const discordRoles = session.get('discord_roles') || []
  const isLoggedIn = !!discordId
  const hasPremium = getHasPremium(discordRoles)

  const validParams = inputSchema.safeParse(values)
  if (!validParams.success) {
    return json({
      exception: `Missing: ${validParams.error.issues
        .map(({ path }) => path.join(', '))
        .join(', ')}`,
      isLoggedIn,
      hasPremium
    })
  }
  return json({ ...validParams.data, isLoggedIn, hasPremium })
}

const sortByPrice =
  (desc: boolean) => (first: { price: number }, second: { price: number }) => {
    if (first.price === second.price) {
      return 0
    }
    if (first.price < second.price) {
      return desc ? -1 : 1
    }
    return desc ? 1 : -1
  }

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)

  const homeServer = session.getWorld()

  const formPayload = Object.fromEntries(formData)
  const inputSchema = z.object({
    items: z
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
    itemIds: validInput.data.items,
    exportServers: validInput.data.exportServers,
    hqOnly: validInput.data.hqOnly
  })
  if (!response.ok) {
    return json({ exception: response.statusText })
  }
  return json({ ...(await response.json()), homeServer })
}

const Index = () => {
  const transition = useNavigation()
  const results = useActionData<
    ItemServerComparisonList | { exception: string } | {}
  >()
  const loaderData = useLoaderData<
    typeof defaultFormValues & { isLoggedIn: boolean; hasPremium: boolean }
  >()
  const [modal, setModal] = useState<'exportServers' | 'items' | null>(null)
  const [state, setState] = useState<{
    items: string[]
    exportServers: string[]
  }>({
    items: loaderData.items ? loaderData.items.split(',') : [],
    exportServers: loaderData.exportServers
      ? loaderData.exportServers.split(',')
      : []
  })
  const navigate = useNavigate()

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  const error =
    results && 'exception' in results
      ? results.exception
      : results && 'data' in results && results.data.length === 0
      ? 'No results found'
      : undefined

  if (results && 'data' in results && !error) {
    if (results.data) {
      return <Results results={results} />
    }
  }

  const itemsLength = state.items.length
  const serversLength = state.exportServers.length

  // Paywall logic
  const showPaywall = !loaderData.isLoggedIn || !loaderData.hasPremium
  const handleLogin = () => {
    navigate('/discord-login')
  }
  const handleSubscribe = () => {
    window.open(DISCORD_SERVER_URL, '_blank')
  }

  return (
    <PageWrapper>
      <PremiumPaywall
        show={showPaywall}
        isLoggedIn={!!loaderData.isLoggedIn}
        hasPremium={!!loaderData.hasPremium}
        onLogin={handleLogin}
        onSubscribe={handleSubscribe}>
        <SmallFormContainer
          title="Compare the minimum price of items across worlds!"
          description="Find out the minimum price of different items across multiple servers. Helps you find the best server to sell your items on, if you have alts on many servers."
          onClick={onSubmit}
          loading={transition.state === 'submitting'}
          disabled={transition.state === 'submitting'}
          error={error}
          action={getActionUrl('/queries/world-comparison', state)}>
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
                <input
                  name="exportServers"
                  value={state.exportServers}
                  hidden
                />
                <p className="mt-2 ml-1 text-sm text-gray-500 dark:text-gray-300">
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
                <input name="items" hidden value={state.items} />
                <p className="mt-2 ml-1 text-sm text-gray-500 dark:text-gray-300">
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
                )}
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
                                    exportServers: [
                                      ...state.exportServers,
                                      name
                                    ]
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
      </PremiumPaywall>
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
  <li className="flex items-center w-full justify-between my-1 px-3 py-2 gap:3 bg-gray-100 dark:bg-slate-700 rounded-md">
    <p className="text-ellipsis overflow-hidden no-wrap text-gray-600 dark:text-gray-200">
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

const Results = ({ results }: { results: ItemServerComparisonList }) => {
  const [tableDesc, setTableDesc] = useState(true)

  const getSortedTables = sortByPrice(tableDesc)

  const handleCopyButton = () => {
    if (navigator.clipboard && window) {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <PageWrapper>
      <ContentContainer>
        <div className="flex justify-start mt-4">
          <SubmitButton
            title="Share this search!"
            onClick={handleCopyButton}
            type="button"
          />
        </div>
        <div className="flex flex-col gap-6 p-4">
          {results.data.map((item) => {
            const sortedServers = item.export_servers.sort(getSortedTables)
            return (
              <div
                key={item.item_id}
                className="max-w-2xl w-full mx-auto rounded-md shadow-md p-3 dark:bg-slate-600">
                <Title title={getItemNameById(item.item_id) as string} />
                <div>
                  <table className="table-auto border-separate border-spacing-2 dark:text-gray-200">
                    <tr>
                      <th className="text-left py-1 px-2">World</th>
                      <th
                        className="text-left py-1 px-2 flex items-center"
                        onClick={(e) => {
                          e.preventDefault()
                          setTableDesc((state) => !state)
                        }}>
                        Price
                        {tableDesc ? (
                          <ChevronDownIcon className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronUpIcon className="h-4 w-4 ml-1" />
                        )}
                      </th>
                    </tr>
                    {sortedServers.map((server) => {
                      const isHomeServer =
                        results.homeServer === server.server_name
                      return (
                        <tr key={server.server_name}>
                          <td
                            className={`text-left py-1 px-2${
                              isHomeServer ? ' font-semibold' : ''
                            }`}>
                            {isHomeServer
                              ? `${server.server_name}*`
                              : server.server_name}
                          </td>
                          <td className="text-left py-1 px-2">
                            {server.price === 0
                              ? 'Out of Stock on this Server'
                              : server.price.toLocaleString()}
                          </td>
                        </tr>
                      )
                    })}
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      </ContentContainer>
    </PageWrapper>
  )
}
