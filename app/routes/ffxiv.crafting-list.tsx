import type { LoaderFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { PageWrapper, Title } from '~/components/Common'
import type { CraftingListInput } from '~/requests/FFXIV/crafting-list'
import CraftingList from '~/requests/FFXIV/crafting-list'
import { getUserSessionData } from '~/sessions'

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getUserSessionData(request)

  const input: CraftingListInput = {
    homeServer: session.getWorld(),
    costMetric: 'material_median_cost',
    revenueMetric: 'revenue_home_min_listing',
    salesPerWeek: 10,
    medianSalePrice: 100000,
    maxMaterialCost: 50000,
    jobs: [0, 8, 9],
    filters: [0],
    stars: -1,
    lvlLowerLimit: -1,
    lvlUpperLimit: 91,
    yields: -1,
    hideExpertRecipes: true
  }

  return CraftingList(input)
}

export default function Index() {
  const loaderData = useLoaderData<any>()
  console.log(loaderData)

  return (
    <PageWrapper>
      <Title title="Crafting List" />
      <p></p>
    </PageWrapper>
  )
}
