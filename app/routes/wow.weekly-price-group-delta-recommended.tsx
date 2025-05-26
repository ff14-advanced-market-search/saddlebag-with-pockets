import { useState } from 'react'
import { MetaFunction } from '@remix-run/cloudflare'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'
import type { WeeklyPriceGroupDeltaResponse, PriceGroup } from '~/requests/WoW/WeeklyPriceGroupDelta'
import Results from './wow.weekly-price-group-delta'

export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: WoW Weekly Price Group Delta Recommended Configurations',
    description: 'Pre-configured weekly price group delta analyses for WoW markets. Track price changes across different item categories and make informed investment decisions.',
    links: [
      {
        rel: 'canonical',
        href: 'https://saddlebagexchange.com/wow/weekly-price-group-delta/recommended'
      }
    ]
  }
}

const recommendedConfigs = [
  {
    name: 'TWW Enchants & Materials',
    description: 'Track price changes for TWW enchants and enchanting materials.',
    config: {
      region: 'NA',
      start_year: 2025,
      start_month: 1,
      start_day: 1,
      end_year: 2025,
      end_month: 6,
      end_day: 25,
      price_groups: [
        {
          name: 'enchants',
          item_ids: [],
          categories: [
            { item_class: 8, item_subclass: -1, expansion_number: 11, min_quality: 3 },
            { item_class: 7, item_subclass: 12, expansion_number: 11, min_quality: 2 }
          ]
        }
      ]
    }
  },
  {
    name: 'TWW Alchemy & Materials',
    description: 'Monitor price changes for TWW alchemy items and materials.',
    config: {
      region: 'NA',
      start_year: 2025,
      start_month: 1,
      start_day: 1,
      end_year: 2025,
      end_month: 6,
      end_day: 25,
      price_groups: [
        {
          name: 'alch',
          item_ids: [],
          categories: [
            { item_class: 0, item_subclass: 1, expansion_number: 11, min_quality: 3 },
            { item_class: 0, item_subclass: 2, expansion_number: 11, min_quality: 3 },
            { item_class: 0, item_subclass: 3, expansion_number: 11, min_quality: 3 },
            { item_class: 7, item_subclass: 8, expansion_number: 11, min_quality: 2 }
          ]
        }
      ]
    }
  },
  {
    name: 'TWW Gems & Materials',
    description: 'Track price changes for TWW gems and jewelcrafting materials.',
    config: {
      region: 'NA',
      start_year: 2025,
      start_month: 1,
      start_day: 1,
      end_year: 2025,
      end_month: 6,
      end_day: 25,
      price_groups: [
        {
          name: 'gems',
          item_ids: [],
          categories: [
            { item_class: 3, item_subclass: -1, expansion_number: 11, min_quality: 3 },
            { item_class: 7, item_subclass: 4, expansion_number: 11, min_quality: 2 }
          ]
        }
      ]
    }
  },
  {
    name: 'TWW Raid Consumables',
    description: 'Monitor price changes for TWW raid consumables.',
    config: {
      region: 'NA',
      start_year: 2025,
      start_month: 1,
      start_day: 1,
      end_year: 2025,
      end_month: 6,
      end_day: 25,
      price_groups: [
        {
          name: 'raid consumables',
          item_ids: [
            211880, 212241, 212244, 212247, 212250, 212253, 212256, 212259,
            212262, 212265, 212268, 212271, 212274, 212277, 212280, 212283,
            212301, 212307, 212310, 212313, 212316, 221874, 221878, 221882,
            221955, 222504, 222507, 222510, 222599, 222602, 222605, 222608,
            224107, 224110, 224113, 226036, 232534, 232937
          ],
          categories: []
        }
      ]
    }
  },
  {
    name: 'TWW Crafting Materials',
    description: 'Track price changes for TWW cloth, leather, and inscription materials.',
    config: {
      region: 'NA',
      start_year: 2025,
      start_month: 1,
      start_day: 1,
      end_year: 2025,
      end_month: 6,
      end_day: 25,
      price_groups: [
        {
          name: 'cloth and leather',
          item_ids: [],
          categories: [
            { item_class: 7, item_subclass: 5, expansion_number: 11, min_quality: 2 },
            { item_class: 7, item_subclass: 6, expansion_number: 11, min_quality: 2 }
          ]
        },
        {
          name: 'inscription',
          item_ids: [],
          categories: [
            { item_class: 7, item_subclass: 16, expansion_number: 11, min_quality: 2 },
            { item_class: 7, item_subclass: 16, expansion_number: 11, min_quality: 3 }
          ]
        }
      ]
    }
  },
  {
    name: 'TWW Complete Analysis',
    description: 'Comprehensive price tracking for all TWW crafting and consumable items.',
    config: {
      region: 'NA',
      start_year: 2025,
      start_month: 1,
      start_day: 1,
      end_year: 2025,
      end_month: 6,
      end_day: 25,
      price_groups: [
        {
          name: 'enchants',
          item_ids: [],
          categories: [
            { item_class: 8, item_subclass: -1, expansion_number: 11, min_quality: 3 },
            { item_class: 7, item_subclass: 12, expansion_number: 11, min_quality: 2 }
          ]
        },
        {
          name: 'alch',
          item_ids: [],
          categories: [
            { item_class: 0, item_subclass: 1, expansion_number: 11, min_quality: 3 },
            { item_class: 0, item_subclass: 2, expansion_number: 11, min_quality: 3 },
            { item_class: 0, item_subclass: 3, expansion_number: 11, min_quality: 3 },
            { item_class: 7, item_subclass: 8, expansion_number: 11, min_quality: 2 }
          ]
        },
        {
          name: 'gems',
          item_ids: [],
          categories: [
            { item_class: 3, item_subclass: -1, expansion_number: 11, min_quality: 3 },
            { item_class: 7, item_subclass: 4, expansion_number: 11, min_quality: 2 }
          ]
        },
        {
          name: 'raid consumables',
          item_ids: [
            211880, 212241, 212244, 212247, 212250, 212253, 212256, 212259,
            212262, 212265, 212268, 212271, 212274, 212277, 212280, 212283,
            212301, 212307, 212310, 212313, 212316, 221874, 221878, 221882,
            221955, 222504, 222507, 222510, 222599, 222602, 222605, 222608,
            224107, 224110, 224113, 226036, 232534, 232937
          ],
          categories: []
        },
        {
          name: 'cloth and leather',
          item_ids: [],
          categories: [
            { item_class: 7, item_subclass: 5, expansion_number: 11, min_quality: 2 },
            { item_class: 7, item_subclass: 6, expansion_number: 11, min_quality: 2 }
          ]
        },
        {
          name: 'inscription',
          item_ids: [],
          categories: [
            { item_class: 7, item_subclass: 16, expansion_number: 11, min_quality: 2 },
            { item_class: 7, item_subclass: 16, expansion_number: 11, min_quality: 3 }
          ]
        }
      ]
    }
  }
]

export default function RecommendedWeeklyPriceGroupDelta() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<WeeklyPriceGroupDeltaResponse | null>(null)
  const [pageTitle, setPageTitle] = useState<string>('')
  const [darkMode, setDarkMode] = useState<boolean>(false)

  const handleRunAnalysis = async (rec: typeof recommendedConfigs[0]) => {
    setLoading(true)
    setError(null)
    setResults(null)
    setPageTitle(rec.name)
    try {
      const response = await fetch('/wow/weekly-price-group-delta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          startYear: rec.config.start_year.toString(),
          startMonth: rec.config.start_month.toString(),
          startDay: rec.config.start_day.toString(),
          endYear: rec.config.end_year.toString(),
          endMonth: rec.config.end_month.toString(),
          endDay: rec.config.end_day.toString(),
          priceGroups: JSON.stringify(rec.config.price_groups),
        }).toString(),
      })
      const data = await response.json()
      if (data.exception) {
        setError(data.exception)
      } else {
        setResults(data)
      }
    } catch (e: any) {
      setError(e.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (results) {
    // @ts-ignore: Results is a default export with props in the main file
    return <Results data={results} pageTitle={pageTitle} darkMode={darkMode} />
  }

  return (
    <>
      <main className="flex-1">
        <Banner />
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-blue-900 dark:text-gray-100">
              Recommended Weekly Price Group Delta Configurations
            </h1>
            <div className="text-center my-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Want to create your own custom analysis? Head over to our <a href="/wow/weekly-price-group-delta" className="text-blue-500 hover:text-blue-600 font-medium">Weekly Price Group Delta</a> page to start your analysis from scratch.
              </p>
            </div>
            <div className="not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {recommendedConfigs.map((rec) => (
                <button
                  key={rec.name}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded shadow text-left"
                  onClick={() => handleRunAnalysis(rec)}
                  disabled={loading}
                >
                  <div className="font-semibold text-lg mb-1">{rec.name}</div>
                  <div className="text-sm text-blue-100">{rec.description}</div>
                </button>
              ))}
            </div>
            {loading && <div className="text-blue-600 font-bold">Loading...</div>}
            {error && <div className="text-red-600 font-bold">{error}</div>}
          </div>
        </div>
      </main>
    </>
  )
} 