import { useActionData, useTransition } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import { InputWithLabel } from '~/components/form/InputWithLabel'
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
      : results && results?.data.length === 0
      ? 'No results found'
      : undefined

  console.log(results)
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
          <div className="sm:px-4 flex flex-col gap-2">
            <CheckBox labelTitle="HQ Only" id="hq-only" name="hqOnly" />

            <InputWithLabel
              type="text"
              labelTitle="exportServers"
              inputTag="Server"
              name="exportServers"
            />

            <div className="flex flex-col max-w-full">
              <ModalToggleButton
                type="button"
                onClick={() => setModal('items')}>
                Items to compare
              </ModalToggleButton>
              <input name="itemIds" hidden value={state.items} />
              <div className="flex flex-wrap">
                {state.items.map((id) => getItemNameById(id) || '').join(', ')}
              </div>
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
            {modal === 'items' ? (
              <div>
                <ItemSelect
                  onSelectChange={(selected) => {
                    if (!selected) return

                    setState({ ...state, items: [...state.items, selected.id] })
                  }}
                  tooltip="Item to compare the price against"
                />
              </div>
            ) : (
              <p>Other</p>
            )}
          </Modal>
        )}
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index
