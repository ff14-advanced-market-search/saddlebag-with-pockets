import type { MetaFunction } from '@remix-run/cloudflare'
import { Link } from '@remix-run/react'
import Banner from '~/components/Common/Banner'
import recommendedConfigs from '~/components/recommended/FFXIV/WeeklyPriceGroup'

export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title:
      'Saddlebag Exchange: FFXIV Weekly Price Group Delta Recommended Configurations',
    description:
      'Pre-configured weekly price group delta analyses for FFXIV markets. Track price changes across different item categories and make informed investment decisions.',
    links: [
      {
        rel: 'canonical',
        href: 'https://saddlebagexchange.com/ffxiv/weekly-price-group-delta-recommended'
      }
    ]
  }
}

export default function RecommendedWeeklyPriceGroupDelta() {
  const handleRunAnalysis = (rec: (typeof recommendedConfigs)[0]) => {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/ffxiv/weekly-price-group-delta'

    const addField = (name: string, value: string) => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = name
      input.value = value
      form.appendChild(input)
    }

    addField('region', rec.config.region)
    addField('startYear', rec.config.start_year.toString())
    addField('startMonth', rec.config.start_month.toString())
    addField('startDay', rec.config.start_day.toString())
    addField('endYear', rec.config.end_year.toString())
    addField('endMonth', rec.config.end_month.toString())
    addField('endDay', rec.config.end_day.toString())
    addField('minimum_marketshare', rec.config.minimum_marketshare.toString())
    addField('hq_only', rec.config.hq_only ? 'true' : 'false')
    addField('price_setting', rec.config.price_setting)
    addField('quantity_setting', rec.config.quantity_setting)
    addField('priceGroups', JSON.stringify(rec.config.price_groups))

    document.body.appendChild(form)
    form.submit()
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
            <div className="text-center my-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow">
              <p className="text-lg text-gray-700 dark:text-gray-200 font-medium mb-3">
                Analyze Final Fantasy XIV market board data for multiple items
                at once. Visualize price trends, market shifts, and economic
                patterns to inform your long-term investments and patch cycle
                strategies—all in one place.
              </p>
              <div className="flex flex-col items-center gap-2">
                <span className="inline-block text-base text-gray-600 dark:text-gray-300 font-semibold">
                  <span className="mr-1" role="img" aria-label="database">
                    📊
                  </span>
                  <span className="font-bold">Data Availability:</span> All
                  market board items from{' '}
                  <span className="font-semibold">January 2024</span> onward.
                </span>
                <div className="flex flex-row justify-start gap-4">
                  <a
                    href="https://youtu.be/3wbwoDQ8Flk?si=8XzPhRRivnmdAInl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold shadow transition-colors duration-150">
                    📺 Watch the Video Guide
                  </a>
                  <a
                    href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/How-to-Use-Price-Group-Deltas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold shadow transition-colors duration-150">
                    📚 Read the Written Wiki
                  </a>
                </div>
              </div>
            </div>
            <div className="text-center my-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Want to create your own custom analysis? Head over to our{' '}
                <Link
                  to="/ffxiv/weekly-price-group-delta"
                  className="text-blue-500 hover:text-blue-600 font-medium">
                  Weekly Price Group Delta
                </Link>{' '}
                page to start your analysis from scratch.
              </p>
            </div>
            <div className="not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {recommendedConfigs.map((rec) => (
                <button
                  type="button"
                  key={rec.name}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded shadow text-left"
                  onClick={() => handleRunAnalysis(rec)}>
                  <div className="font-semibold text-lg mb-1">{rec.name}</div>
                  <div className="text-sm text-blue-100">{rec.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
