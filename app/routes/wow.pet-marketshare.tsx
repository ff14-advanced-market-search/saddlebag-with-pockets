import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { PageWrapper } from '~/components/Common'
import { z } from 'zod'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { WoWLoaderData } from '~/requests/WoW/types'
import { getUserSessionData } from '~/sessions'
import type { WoWPetMarketShareActionResults } from '~/components/WoWResults/PetMarketshareResults'
import PetMarketshareResults from '~/components/WoWResults/PetMarketshareResults'
import PetMarketShareForm from '~/components/form/WoW/PetMarketshareForm'
import NoResults from '~/components/Common/NoResults'
import { useTypedSelector } from '~/redux/useTypedSelector'
import type { PetMarketshareSortBy } from '~/requests/WoW/PetMarketshare'
import PetMarketshare from '~/requests/WoW/PetMarketshare'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { title: 'Saddlebag Exchange: WoW Battle Pets Most Gold' },
    {
      name: 'description',
      content:
        'Find what battle pets make the most gold in WoW, sell the most in WoW, sell the fastest in in WoW and have the best market gaps!'
    },
    {
      name: 'canonical',
      content: 'https://saddlebagexchange.com/wow/pet-marketshare'
    }
  ]
}

const inputMap: Record<string, string> = {
  region: 'Region',
  homeRealmName: 'Home Realm',
  minPrice: 'Minimum Price',
  salesPerDay: 'Sales Per Day',
  includeCategories: 'Include Categories',
  excludeCategories: 'Exclude Categories',
  sortBy: 'Sort By'
}

export const sortByOptions: Array<{
  label: string
  value: PetMarketshareSortBy
}> = [
  {
    value: 'estimatedRegionMarketValue',
    label: 'Gold Earned Per Day'
  },
  { value: 'avgTSMPrice', label: 'Average TSM Price' },
  { value: 'homeMinPrice', label: 'Minimum Price' },
  { value: 'percentChange', label: 'Percent Change' },
  { value: 'salesPerDay', label: 'Sales Per Day' }
]

export const loader: LoaderFunction = async ({ request }) => {
  const { getWoWSessionData } = await getUserSessionData(request)
  const { server, region } = getWoWSessionData()
  return json({ wowRealm: server, wowRegion: region })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const formPayload = Object.fromEntries(formData)

  const validateFormData = z.object({
    region: z.union([z.literal('NA'), z.literal('EU')]),
    homeRealmName: z
      .string()
      .min(1)
      .transform((value) => value.split('---')[1]),
    desiredPrice: z
      .string()
      .min(1)
      .transform((value) => parseFloat(value)),
    desiredSalesPerDay: z
      .string()
      .min(1)
      .transform((value) => parseInt(value)),
    includeCategories: z
      .string()
      .transform((value) =>
        value.trim() === ''
          ? []
          : value.split(',').map((value) => parseInt(value))
      ),
    excludeCategories: z
      .string()
      .transform((value) =>
        value.trim() === ''
          ? []
          : value.split(',').map((value) => parseInt(value))
      ),
    sortBy: z.union([
      z.literal('avgTSMPrice'),
      z.literal('estimatedRegionMarketValue'),
      z.literal('homeMinPrice'),
      z.literal('percentChange'),
      z.literal('salesPerDay')
    ])
  })

  validateFormData.safeParse(formPayload)

  const validInput = validateFormData.safeParse(formPayload)

  if (!validInput.success) {
    return json({
      exception: `Missing: ${validInput.error.issues
        .map(({ path }) =>
          path.map((field) => inputMap[field] || 'Unknown input error')
        )
        .join(', ')}`
    })
  }

  const data = await (await PetMarketshare(validInput.data)).json()

  if (data.exception !== undefined) {
    return json({ exception: data.exception })
  }

  if (!data?.data) {
    return json({ exception: 'Unknown server error' })
  }

  return json({
    ...data,
    serverName: validInput.data.homeRealmName,
    region: validInput.data.region,
    sortBy: validInput.data.sortBy
  })
}

const Index = () => {
  const transition = useNavigation()
  const { wowRealm, wowRegion } = useLoaderData<WoWLoaderData>()
  const { darkmode } = useTypedSelector((state) => state.user)

  const results = useActionData<
    WoWPetMarketShareActionResults | { exception: string } | {}
  >()

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  const pageTitle = 'Pet Marketshare Overview'

  if (results && 'data' in results) {
    if (!results.data.length) {
      return (
        <PageWrapper>
          <NoResults href="/wow/pet-marketshare" />
        </PageWrapper>
      )
    }
    return (
      <PetMarketshareResults
        results={results}
        pageTitle={pageTitle}
        darkMode={darkmode}
      />
    )
  }

  const error =
    results && 'exception' in results ? results.exception : undefined
  return (
    <PageWrapper>
      <SmallFormContainer
        title={pageTitle}
        onClick={onSubmit}
        loading={transition.state === 'submitting'}
        error={error}>
        <PetMarketShareForm regionDefault={wowRegion} homeRealm={wowRealm} />
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index
