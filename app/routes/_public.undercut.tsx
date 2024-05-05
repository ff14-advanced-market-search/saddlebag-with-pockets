import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import GetSellerId from '~/requests/GetSellerId'
import ItemSelect from '~/components/form/select/ItemSelect'
import NoResults from '~/components/Common/NoResults'
import Results from '../components/FFXIVResults/UndercutAlert/Results'
import SelectDCandWorld from '~/components/form/select/SelectWorld'
import z from 'zod'
import { parseZodErrorsToDisplayString } from '~/utils/zodHelpers'
import { parseStringToNumber } from '~/utils/zodHelpers'
import { getUserSessionData } from '~/sessions'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: FFXIV undecut alerts, ffxiv sell faster!',
    description:
      'Generate data for Sadddlebag Exchange discord bot ffxiv undercut alerts. Sell faster when no one can sell under you!',
    customHeading:
      'Maximize Your Profits with FFXIV Undercut Alerts from Saddlebag Exchange'
  }
}

const validateForm = z.object({
  retainerName: z.string().min(1),
  itemId: parseStringToNumber,
  world: z.string().min(1)
})

const inputMap: Record<keyof typeof validateForm._type, string> = {
  retainerName: 'Retainer Name',
  itemId: 'Item',
  world: 'World'
}

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData())

  const validData = validateForm.safeParse(formData)

  if (!validData.success) {
    return json({
      exception: parseZodErrorsToDisplayString(validData.error, inputMap)
    })
  }

  const { retainerName, itemId, world } = validData.data
  if (
    !retainerName ||
    typeof retainerName !== 'string' ||
    !retainerName.length
  ) {
    return json({ exception: 'Missing retainer name' })
  }

  const homeServer = world

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

export const loader: LoaderFunction = async ({ request }) => {
  const { getWorld, getDataCenter } = await getUserSessionData(request)

  const data_center = getDataCenter()
  const world = getWorld()

  return json({
    data_center,
    world
  })
}

const Index = () => {
  const loaderData = useLoaderData()
  const navigation = useNavigation()
  const results = useActionData()

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (navigation.state === 'submitting') {
      e.preventDefault()
    }
  }

  const error =
    results && 'exception' in results ? results.exception : undefined

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
        loading={navigation.state === 'submitting'}
        disabled={navigation.state === 'submitting'}
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
            <SelectDCandWorld
              navigation={navigation}
              sessionData={loaderData}
            />
          </div>
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index
