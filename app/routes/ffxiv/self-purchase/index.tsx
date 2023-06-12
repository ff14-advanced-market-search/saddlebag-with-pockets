import type {
  ActionFunction,
  ErrorBoundaryComponent
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useActionData, useTransition } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { ErrorBoundary as ErrorBounds } from '~/components/utilities/ErrorBoundary'
import type { SelfPurchaseResults } from '~/requests/FFXIV/self-purchase'
import selfPurchaseRequest from '~/requests/FFXIV/self-purchase'
import { getUserSessionData } from '~/sessions'

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => (
  <ErrorBounds error={error} />
)

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)

  const playerName = formData.get('playerName')

  if (!playerName || typeof playerName !== 'string' || !playerName.trim()) {
    return json({ exception: 'No player name provided' })
  }

  return await selfPurchaseRequest({
    server: session.getWorld(),
    playerName: playerName.trim()
  })
}

export default function SelfPurchase() {
  const transition = useTransition()
  const results = useActionData<SelfPurchaseResults>()
  const loading = transition.state === 'submitting'

  console.log('results', results)

  const error =
    results && 'exception' in results ? results.exception : undefined

  return (
    <PageWrapper>
      <SmallFormContainer
        title="Self Purchase Items"
        error={error}
        loading={loading}
        onClick={(e) => {
          if (loading) {
            e.preventDefault()
          }
        }}>
        <div className="pt-2">
          <InputWithLabel
            type="text"
            name="playerName"
            labelTitle="Player Name"
            toolTip="The name of your player"
          />
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}
