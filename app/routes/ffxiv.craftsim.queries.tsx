import { DocumentSearchIcon } from '@heroicons/react/outline'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'FFXIV crafting profit simulation recommendations',
    description: 'FFXIV crafting profit simulation recommendations'
  }
}

export const links: LinksFunction = () => [
  {
    rel: 'canonical',
    href: 'https://saddlebagexchange.com/ffxiv/craftsim/queries'
  }
]

const searchParams = {
  defaultDawntrail:
    '/ffxiv/craftsim?filters=0%2C-5&revenueMetric=revenue_region_min_listing&lvlLowerLimit=91',
  defaultItems:
    '/ffxiv/craftsim?filters=0%2C-5&revenueMetric=revenue_region_min_listing',
  fastSaleItems:
    '/ffxiv/craftsim?revenueMetric=revenue_region_min_listing&salesPerWeek=150&medianSalePrice=500&maxMaterialCost=10000&filters=0%2C-5&yields=2',
  foodItems:
    '/ffxiv/craftsim?costMetric=material_median_cost&revenueMetric=revenue_home_min_listing&salesPerWeek=750&medianSalePrice=1000&maxMaterialCost=10000&jobs=0&filters=5%2C43%2C44%2C45%2C46&stars=-1&lvlLowerLimit=-1&yields=-1&hideExpertRecipes=true',
  foodItemsTrainedEye:
    '/ffxiv/craftsim?costMetric=material_median_cost&revenueMetric=revenue_home_min_listing&salesPerWeek=400&medianSalePrice=1000&maxMaterialCost=10000&jobs=0&filters=5%2C43%2C44%2C45%2C46&stars=-1&lvlLowerLimit=-1&lvlUpperLimit=90&yields=-1&hideExpertRecipes=true',
  furnitureAndGlamourItems:
    '/ffxiv/craftsim?costMetric=material_median_cost&revenueMetric=revenue_home_min_listing&salesPerWeek=400&medianSalePrice=50000&maxMaterialCost=100000&jobs=0&filters=7%2C56%2C57%2C58%2C59%2C60%2C65%2C66%2C67%2C68%2C69%2C70%2C71%2C72%2C74%2C75%2C79%2C80%2C81%2C82%2C90&stars=-1&lvlLowerLimit=-1&yields=-1&hideExpertRecipes=true',
  expertCraftItems:
    '/ffxiv/craftsim?costMetric=material_median_cost&revenueMetric=revenue_home_min_listing&salesPerWeek=100&medianSalePrice=50000&maxMaterialCost=100000&jobs=0&filters=0&stars=-1&lvlLowerLimit=-1&yields=-1&hideExpertRecipes=false',
  bestCraftedGear:
    '/ffxiv/craftsim?costMetric=material_median_cost&revenueMetric=revenue_home_min_listing&salesPerWeek=500&medianSalePrice=75000&maxMaterialCost=200000&jobs=0&filters=1%2C2%2C3%2C4&stars=-1&lvlLowerLimit=-1&yields=-1&hideExpertRecipes=true'
}
const recommendedQueries = [
  {
    name: 'Default Dawntrail',
    description: 'Search for profitable new Dawntrail items to craft.',
    Icon: DocumentSearchIcon,
    href: searchParams.defaultDawntrail
  },
  {
    name: 'Default Search',
    description: 'Default search for profitable items to craft.',
    Icon: DocumentSearchIcon,
    href: searchParams.defaultItems
  },
  {
    name: 'Fast Selling Commodity Items',
    description: 'Search for fast selling commodities items to craft.',
    Icon: DocumentSearchIcon,
    href: searchParams.fastSaleItems
  },
  {
    name: 'Food Items',
    description: 'Find food items that sell fast and in bulk.',
    Icon: DocumentSearchIcon,
    href: searchParams.foodItems
  },
  {
    name: 'Food Items (Trained Eye)',
    description:
      'Find food items that can be crafted 100% HQ using the level 80 crafter skill, Trained Eye.',
    Icon: DocumentSearchIcon,
    href: searchParams.foodItemsTrainedEye
  },
  {
    name: 'Furniture and Glamour Items',
    description:
      'Find all the worthwhile furniture and glamour items to craft.',
    Icon: DocumentSearchIcon,
    href: searchParams.furnitureAndGlamourItems
  },
  {
    name: 'Expert Craft Items (Pentameld)',
    description: 'Find items for pentamelding.',
    Icon: DocumentSearchIcon,
    href: searchParams.expertCraftItems
  },
  {
    name: 'Best Crafted Gear',
    description:
      'Find all the current BiS gear (Diadochos for Combat/Indagators for Crafter/Gatherer).',
    Icon: DocumentSearchIcon,
    href: searchParams.bestCraftedGear
  }
]

export default function Index() {
  return (
    <>
      <main className="flex-1">
        <Banner />
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-blue-900 dark:text-gray-100">
              Recommended Craftsim Queries
            </h1>
            <div
              className={`not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2`}>
              {recommendedQueries.map((query) => {
                return <TileLink key={query.name} {...query} />
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
