import type { LoaderFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { PageWrapper, Title } from '~/components/Common'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { ColumnList } from '~/components/types'
import ItemDataLink from '~/components/utilities/ItemDataLink'
import UniversalisBadgedLink from '~/components/utilities/UniversalisBadgedLink'
import type {
  CraftingListData,
  CraftingListInput,
  CraftingListRepsonse,
  FlatCraftingList
} from '~/requests/FFXIV/crafting-list'
import CraftingList from '~/requests/FFXIV/crafting-list'
import { getUserSessionData } from '~/sessions'

const flattenResult = ({
  hq,
  itemData,
  itemID,
  itemName,
  profitEst,
  soldPerWeek,
  universalisLink,
  yieldsPerCraft,
  costEst,
  revenueEst
}: CraftingListData): FlatCraftingList => {
  return {
    itemID,
    itemName,
    hq,
    itemData,
    profitEst,
    soldPerWeek,
    universalisLink,
    yieldsPerCraft,
    ...costEst,
    ...revenueEst
  }
}

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

type ActionResponse = CraftingListRepsonse | { exception: string } | {}
export default function Index() {
  const loaderData = useLoaderData<ActionResponse>()

  if (loaderData && 'data' in loaderData) {
    const flatData = loaderData.data.map(flattenResult)
    return <Results data={flatData} />
  }

  return (
    <PageWrapper>
      <Title title="Crafting List" />
    </PageWrapper>
  )
}

const Results = ({ data }: { data: Array<FlatCraftingList> }) => {
  return (
    <PageWrapper>
      <SmallTable
        title="Crafting Lists"
        data={data}
        columnList={columnList}
        mobileColumnList={mobileColumnList}
        columnSelectOptions={[
          'profitEst',
          'soldPerWeek',
          'revenue_avg',
          'revenue_region_min_listing',
          'material_min_listing_cost',
          'material_avg_cost'
        ]}
        sortingOrder={[{ id: 'profitEst', desc: true }]}
      />
    </PageWrapper>
  )
}

const mobileColumnList = [
  { columnId: 'itemName', header: 'Item name' },
  { columnId: 'profitEst', header: 'Profit Est.' }
]

const columnList: Array<ColumnList<FlatCraftingList>> = [
  { columnId: 'itemName', header: 'Item Name' },
  { columnId: 'profitEst', header: 'Profit Est.' },
  { columnId: 'yieldsPerCraft', header: 'Yield' },
  { columnId: 'soldPerWeek', header: 'Sales Per Week' },
  {
    columnId: 'revenue_avg',
    header: 'Revenue Average'
  },
  {
    columnId: 'revenue_region_min_listing',
    header: 'Revenue Min Listing'
  },
  {
    columnId: 'material_min_listing_cost',
    header: 'Cost Minimum Listing'
  },
  {
    columnId: 'material_avg_cost',
    header: 'Cost Estimage Average'
  },
  {
    columnId: 'hq',
    header: 'High Quality',
    accessor: ({ row: { hq } }) => <p>{hq ? 'Yes' : 'No'}</p>
  },
  {
    columnId: 'itemDataLink',
    header: 'Item Data',
    accessor: ({ row: { itemData } }) => <ItemDataLink link={itemData} />
  },
  {
    columnId: 'universalisLink',
    header: 'Universalis',
    accessor: ({ row: { universalisLink } }) => (
      <UniversalisBadgedLink link={universalisLink} />
    )
  }
]
