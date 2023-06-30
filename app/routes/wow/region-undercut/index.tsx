import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { z } from 'zod'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { TextArea } from '~/components/form/TextArea'
import { getUserSessionData } from '~/sessions'
import type { RegionUndercutResponse } from '~/requests/WoW/RegionUndercut'
import RegionUndercutRequest from '~/requests/WoW/RegionUndercut'
import { useActionData, useNavigation } from '@remix-run/react'

const formName = 'region-undercut'

const petAuction = z.object({
  petID: z.number(),
  price: z.number(),
  auctionID: z.number()
})
const itemAuction = z.object({
  itemID: z.number(),
  price: z.number(),
  auctionID: z.number()
})

const validateInput = z.array(
  z.object({
    homeRealmName: z.string(),
    region: z.string(),
    user_auctions: z.array(z.union([petAuction, itemAuction]))
  })
)

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)

  const input = formData.has(formName) ? formData.get(formName) : null

  if (!input || typeof input !== 'string') {
    return json({ exception: 'Missing input' })
  }

  try {
    const parsedInput = JSON.parse(input)
    const validInput = validateInput.safeParse(parsedInput)

    if (!validInput.success) {
      throw new Error('Invalid input')
    }

    const { region, server } = session.getWoWSessionData()

    return await RegionUndercutRequest({
      region,
      homeRealmId: server.id,
      addonData: validInput.data
    })
  } catch (error) {
    if (error instanceof Error) {
      return json({ exception: error.message })
    } else {
      return json({ exception: 'Unknown Error' })
    }
  }
}

type RegionActionResponse =
  | RegionUndercutResponse
  | { exception: string }
  | {}
  | undefined

const RegionUndercut = () => {
  const transition = useNavigation()
  const results = useActionData<RegionActionResponse>()
  const isLoading = transition.state === 'submitting'

  const error =
    results && 'exception' in results ? results.exception : undefined

  console.log('results', results)
  return (
    <PageWrapper>
      <SmallFormContainer
        title="Region Undercuts"
        onClick={(e) => {
          if (isLoading) {
            e.preventDefault()
          }
        }}
        loading={isLoading}
        disabled={isLoading}
        error={error}>
        <div className="p-3">
          <TextArea
            label="Region undercut data"
            toolTip="Paste the data from our ingame tool here"
            formName={formName}
          />
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default RegionUndercut
