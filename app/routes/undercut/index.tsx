import { useActionData, useTransition } from '@remix-run/react'
import { ContentContainer, PageWrapper } from '~/components/Common'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import GetSellerId from '~/requests/GetSellerId'
import { getUserSessionData } from '~/sessions'
import ItemSelect from '~/components/form/select/ItemSelect'

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
    return { exception: response.statusText }
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
      : results && results.data && results.data.seller_id === null
      ? 'Seller not found'
      : undefined

  if (results && results.data) {
    const jsonData = `{
        "seller_id": "${results.data.seller_id}",
        "server": "${results.homeServer}",
        "add_ids": [],
        "ignore_ids": [],
        "hq_only": false 
    }`
    return (
      <PageWrapper>
        <ContentContainer>
          <pre>
            <code>{jsonData}</code>
          </pre>
        </ContentContainer>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        title="Input for undercut alerts"
        description="Make using your patreon undercut alerts easier. Generate the input needed to activate our discord undercut alerts."
        onClick={onSubmit}
        loading={transition.state === 'submitting'}
        disabled={transition.state === 'submitting'}
        error={error}>
        <div className="pt-4">
          <ItemSelect />
          <div className="px-4">
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
