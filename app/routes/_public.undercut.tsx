import { useActionData, useNavigation } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import GetSellerId from '~/requests/GetSellerId'
import { getUserSessionData } from '~/sessions'
import ItemSelect from '~/components/form/select/ItemSelect'
import NoResults from '~/components/Common/NoResults'
import Results from '../components/FFXIVResults/UndercutAlert/Results'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)

  const homeServer = session.getWorld()

  const retainerName = formData.get('retainerName')

  if (
    !retainerName ||
    typeof retainerName !== 'string' ||
    !retainerName.length
  ) {
    return json({ exception: 'Missing retainer name' })
  }

  const itemIdData = formData.get('itemId')
  if (
    !itemIdData ||
    typeof itemIdData !== 'string' ||
    isNaN(parseInt(itemIdData))
  ) {
    return json({ exception: 'Missing item' })
  }

  const itemId = parseInt(itemIdData)

  const response = await GetSellerId({
    itemId,
    homeServer,
    retainerName
  })
  if (!response.ok) {
    return json({ exception: response.statusText })
  }

  return json({ data: await response.json(), homeServer, itemId })
}

const Description = () => {
  return (
    <p className="italic text-sm text-grey-700 px-3 py-1 dark:text-gray-300">
      To setup undercut alerts search{' '}
      <a
        className="text-blue-500 dark:text-blue-300 hover:underline"
        href="https://universalis.app/"
        target={'_black'}
        rel="noreferrer">
        universalis
      </a>{' '}
      for one of your retainers by name (with exact capitilization) and an item
      they are selling on the Market Board.
    </p>
  )
}

const Index = () => {
  const transition = useNavigation()
  const results = useActionData()

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  const error =
    results && results?.data?.exception ? results.data.exception : undefined

  if (results && results.data && !error) {
    if (!results.data?.seller_id) {
      const itemId = results?.itemId

      const link = itemId
        ? `https://universalis.app/market/${itemId}`
        : 'https://universalis.app'

      return <NoResults href={link} />
    }

    return (
      <Results
        sellerId={results.data.seller_id}
        homeServer={results.homeServer}
      />
    )
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        title="Input for undercut alerts"
        description={Description()}
        onClick={onSubmit}
        loading={transition.state === 'submitting'}
        disabled={transition.state === 'submitting'}
        error={error}>
        <div className="pt-4">
          <ItemSelect tooltip="Item that your retainer is selling" />
          <div className="sm:px-4">
            <InputWithLabel
              placeholder="Enter retainer name..."
              type="text"
              labelTitle="Retainer Name"
              inputTag="Name"
              name="retainerName"
              toolTip="The name of the retainer that is selling your item"
            />
          </div>
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index
