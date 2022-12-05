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
  console.log('formPayload', formPayload)
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
  console.log('validData', validInput)
  const response = await ItemServerComparison({
    homeServer,
    ...validInput.data
  })
  if (!response.ok) {
    return json({ exception: response.statusText })
  }
  return json({ data: await response.json(), homeServer })
}

const Index = () => {
  const transition = useTransition()
  const results = useActionData()

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  console.log(results)
  const error =
    results && results.exception
      ? results.exception
      : results && results?.data?.data.length === 0
      ? 'No results found'
      : undefined
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
          {/* <ItemSelect tooltip="Item that your retainer is selling" /> */}
          <div className="sm:px-4">
            <CheckBox labelTitle="HQ Only" id="hq-only" name="hqOnly" />

            <InputWithLabel
              type="text"
              labelTitle="exportServers"
              inputTag="Server"
              name="exportServers"
            />

            <InputWithLabel
              type="text"
              labelTitle="Item Ids"
              inputTag="Name"
              name="itemIds"
            />
          </div>
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index
