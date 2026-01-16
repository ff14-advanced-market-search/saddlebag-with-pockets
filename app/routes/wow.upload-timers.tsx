import type { MetaFunction } from '@remix-run/cloudflare'
import { PageWrapper } from '~/components/Common'
import type {
  UploadTimersResponse,
  UploadTimersItem
} from '~/requests/WoW/UploadTimers'
import UploadTimers from '~/requests/WoW/UploadTimers'
import { useLoaderData } from '@remix-run/react'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { ColumnList } from '~/components/types'
import Banner from '~/components/Common/Banner'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { title: 'Saddlebag Exchange: WoW Realm Status API Upload Timers' },
    { name: 'description', content: 'WoW: see what time blizzard updates the auctionhouse api data, this is the time when saddlebag exchange and azeroth auction assassin will update with the latest data!' },
    { tagName: 'link', rel: 'canonical', href: 'https://saddlebagexchange.com/wow/upload-timers' }
  ]
}

export const loader: LoaderFunction = async () => {
  return UploadTimers()
}

const Index = () => {
  const results = useLoaderData<
    UploadTimersResponse | { exception: string } | {} | undefined
  >()

  if (results) {
    if (Object.keys(results).length === 0) {
      return <NoResults href="/wow/upload-timers" />
    }

    if ('data' in results) {
      return (
        <PageWrapper>
          <h1 className="text-white">World of Warcraft API Upload Times</h1>
          <Banner />
          <SmallTable
            // title="Upload Timers"
            description="Shows when the WoW auction house data was last uploaded."
            columnList={columnList}
            data={results.data}
            columnSelectOptions={selectOptions}
            sortingOrder={sortingOrder}
            mobileColumnList={mobileColumnList}
            csvOptions={{
              filename: 'saddlebag-upload-timers.csv',
              columns: [
                { title: 'Dataset ID', value: 'dataSetId' },
                { title: 'Dataset Name', value: 'dataSetName' },
                { title: 'Table Name', value: 'tableName' },
                { title: 'Region', value: 'region' },
                { title: 'Last Upload Time (unix)', value: 'lastUploadUnix' },
                { title: 'Last Upload Minute', value: 'lastUploadMinute' }
              ]
            }}
          />
          <p style={{ fontSize: '1px' }}>
            Tracking the World of Warcraft API Upload Times for the Auction
            House: An Essential Tool for Gold Makers Introduction In the
            ever-evolving world of World of Warcraft (WoW), mastering the
            Auction House (AH) is a crucial aspect of gold making. For many
            players, understanding the timing and frequency of Auction House
            data uploads is a game-changer. The Auction House API provided by
            Blizzard offers invaluable data, but knowing when this data is
            updated can make all the difference in staying ahead of the market.
            This is where the Saddlebag Exchange comes into play, providing a
            dedicated page to track these upload times and offering players an
            edge in their gold-making endeavors. The Importance of Auction House
            Data Auction House data is the lifeblood of any serious gold maker
            in WoW. This data includes the current listings, prices, and trends
            for every item available on the Auction House. By analyzing this
            information, players can: Identify Market Trends: Recognize which
            items are in demand and which are not. Set Competitive Prices:
            Ensure their listings are competitively priced to attract buyers.
            Find Bargains: Spot underpriced items for potential profit. Manage
            Inventory: Decide which items to stockpile and which to sell.
            However, all these strategies hinge on having up-to-date data.
            Knowing when the Auction House data is refreshed through the API is
            essential for making timely decisions. Challenges with the Auction
            House API Blizzard’s Auction House API is a powerful tool, but it is
            not without its challenges. The primary issue for many players is
            the unpredictability of upload times. Data uploads can vary due to
            several factors, including server load, maintenance schedules, and
            other technical issues. During updates or outages, these upload
            times can become even more erratic, making it difficult for players
            to rely on the API for accurate and timely information. Introducing
            Saddlebag Exchange's Upload Timers To address this issue, Saddlebag
            Exchange has developed a comprehensive solution for tracking the
            Auction House API upload times. Their dedicated page, Saddlebag
            Exchange Upload Timers, provides real-time updates and historical
            data on the upload frequencies. Key Features of Saddlebag Exchange
            Upload Timers: Real-Time Tracking: Monitor the exact times when
            Auction House data is uploaded to the API. Historical Data: Access
            historical data to identify patterns and predict future uploads.
            Alerts and Notifications: Set up alerts to be notified when new data
            is available. User-Friendly Interface: Easy-to-navigate interface
            with clear and concise information. How It Works Saddlebag Exchange
            utilizes sophisticated algorithms and constant monitoring to track
            the Auction House API uploads. The system checks for new data at
            regular intervals, logs the exact time of each update, and displays
            this information in an easily accessible format. This allows players
            to plan their activities around the upload times, ensuring they
            always have the most current data at their fingertips. Why Timing
            Matters for Gold Making The timing of Auction House data uploads can
            significantly impact a player’s gold-making strategies. Here are a
            few scenarios where knowing the upload times is crucial: Price
            Fluctuations: Prices on the Auction House can fluctuate wildly. By
            knowing when the data is updated, players can react swiftly to price
            changes, buying low and selling high. Market Manipulation: Some
            players engage in market manipulation by buying out entire stocks of
            an item to control its price. Knowing the upload times can help
            players avoid falling victim to these tactics or even engage in them
            strategically. Competition: High-demand items often see fierce
            competition. Being the first to list an item at a competitive price
            after an update can make a significant difference in sales.
            Event-Driven Markets: During in-game events or expansions, certain
            items can spike in value. Tracking upload times ensures players can
            capitalize on these opportunities as soon as they arise. Dealing
            with API Downtime Blizzard’s API can experience downtime,
            particularly during updates or server maintenance. During these
            periods, the lack of fresh data can disrupt gold-making strategies.
            Saddlebag Exchange’s upload timers become even more valuable in
            these situations. By providing the last known upload times and
            predicting the next possible update, players can make informed
            decisions even when the API is down. Tips for Managing Downtime:
            Monitor Historical Patterns: Use historical data from Saddlebag
            Exchange to estimate when the next update might occur. Set Alerts:
            Utilize the alert system to get notified immediately when the API
            comes back online. Stay Informed: Keep an eye on official Blizzard
            channels and community forums for announcements regarding API
            status. Plan Ahead: During known maintenance windows, plan your
            buying and selling activities around the expected downtime to
            minimize disruptions. Conclusion In the competitive world of World
            of Warcraft gold making, staying ahead of the market is all about
            timing. The Auction House API provides crucial data, but knowing
            when this data is updated is the key to leveraging it effectively.
            Saddlebag Exchange’s upload timers offer a powerful tool for
            tracking these updates, ensuring players always have access to the
            freshest information. By utilizing this resource, gold makers can
            enhance their strategies, react swiftly to market changes, and
            maximize their profits even during API downtimes. Whether you’re a
            seasoned Auction House veteran or a newcomer looking to make your
            mark, understanding and utilizing the Auction House API upload times
            can give you the edge you need to succeed. Visit Saddlebag Exchange
            Upload Timers today and take control of your gold-making journey in
            World of Warcraft.
          </p>
        </PageWrapper>
      )
    }
  }

  return <NoResults href="/wow/upload-timers" />
}

export default Index

const columnList: Array<ColumnList<UploadTimersItem>> = [
  { columnId: 'dataSetID', header: 'Data Set ID' },
  { columnId: 'lastUploadMinute', header: 'Last Upload Minute' },
  { columnId: 'lastUploadTimeRaw', header: 'Last Upload Time Raw' },
  { columnId: 'region', header: 'Region' },
  {
    columnId: 'dataSetName',
    header: 'Data Set Name',
    accessor: ({ row }) => (
      <p className="py-2 px-3 w-[200px] overflow-x-scroll">
        {row.dataSetName.join(', ')}
      </p>
    )
  }
]

const selectOptions = ['dataSetID', 'lastUploadMinute', 'region', 'dataSetName']

const sortingOrder = [{ id: 'dataSetName', desc: true }]

const mobileColumnList: Array<ColumnList<UploadTimersItem>> = [
  { columnId: 'dataSetName', header: 'Data Set Name' }
]
