import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { z } from 'zod'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { TextArea } from '~/components/form/TextArea'
import { getUserSessionData } from '~/sessions'
import type {
  RegionUndercutResponse,
  UndercutItems
} from '~/requests/WoW/RegionUndercut'
import RegionUndercutRequest from '~/requests/WoW/RegionUndercut'
import { useActionData, useNavigation } from '@remix-run/react'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { ColumnList } from '~/components/types'
import ExternalLink from '~/components/utilities/ExternalLink'

const formName = 'region-undercut'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: region wide undercut search',
    description: 'Look up your wow undercuts across all realms at once!'
  }
}

// Overwrite default links in the root.tsx
export const links: LinksFunction = () => [
  {
    rel: 'canonical',
    href: 'https://saddlebagexchange.com/wow/region-undercut'
  }
]

const petAuction = z.object({
  petID: z.number(),
  price: z.number(),
  auctionID: z.number()
})
const itemAuction = z.object({
  itemID: z.number(),
  price: z.number(),
  auctionID: z.number()
})

const validateInput = z.array(
  z.object({
    homeRealmName: z.string(),
    region: z.string(),
    user_auctions: z.array(z.union([petAuction, itemAuction]))
  })
)

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)

  const input = formData.has(formName) ? formData.get(formName) : null

  if (!input || typeof input !== 'string') {
    return json({ exception: 'Missing input' })
  }

  try {
    const parsedInput = JSON.parse(input)
    const validInput = validateInput.safeParse(parsedInput)

    if (!validInput.success) {
      throw new Error('Invalid input')
    }

    const { region, server } = session.getWoWSessionData()

    return await RegionUndercutRequest({
      region,
      homeRealmId: server.id,
      addonData: validInput.data
    })
  } catch (error) {
    if (error instanceof Error) {
      return json({ exception: error.message })
    } else {
      return json({ exception: 'Unknown Error' })
    }
  }
}

type RegionActionResponse =
  | RegionUndercutResponse
  | { exception: string }
  | {}
  | undefined

const undercutColumns: Array<{ value: keyof UndercutItems; title: string }> = [
  {
    title: 'Item ID',
    value: 'item_id'
  },
  {
    title: 'Item Name',
    value: 'item_name'
  },
  {
    title: 'User Price',
    value: 'user_price'
  },
  {
    title: 'Lowest Price',
    value: 'lowest_price'
  },
  {
    title: 'Realm Name',
    value: 'realmName'
  },
  {
    title: 'Connected Realm Id',
    value: 'connectedRealmId'
  }
]

const RegionUndercut = () => {
  const transition = useNavigation()
  const results = useActionData<RegionActionResponse>()
  const isLoading = transition.state === 'submitting'

  const error =
    results && 'exception' in results ? results.exception : undefined

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading) {
      event.preventDefault()
    }
  }

  if (results) {
    if (!Object.keys(results).length) {
      return <NoResults href="/wow/region-undercut" />
    }

    if ('not_found_list' in results) {
      return (
        <PageWrapper>
          <SmallTable
            title="Undercut Items"
            description="Shows items that are undercut."
            columnList={columnList}
            data={results.undercut_list}
            columnSelectOptions={selectOptions}
            sortingOrder={sortingOrder}
            mobileColumnList={mobileColumnList}
            csvOptions={{
              filename: 'saddlebag-undercut-items.csv',
              columns: undercutColumns
            }}
          />
          <SmallTable
            title="Not Found Items"
            description="Shows items that were sold, expired or not found."
            columnList={columnList}
            data={results.not_found_list}
            columnSelectOptions={selectOptions}
            sortingOrder={sortingOrder}
            mobileColumnList={mobileColumnList}
            csvOptions={{
              filename: 'saddlebag-undercut-not-found.csv',
              columns: undercutColumns
            }}
          />
        </PageWrapper>
      )
    }
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        title="Region Undercuts"
        onClick={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
        error={error}>
        <div className="p-3">
          <TextArea
            label="Region undercut data"
            toolTip="Paste the data from our ingame tool here"
            formName={formName}
          />
        </div>
      </SmallFormContainer>
      <p style={{ fontSize: '1px' }}>
        Title: Maximizing Profits with Saddlebag Exchange: The Power of
        Undercutting In the bustling world of Azeroth's economy, staying ahead
        in the auction house game can mean the difference between thriving and
        merely surviving. For World of Warcraft players seeking an edge in their
        trading endeavors, Saddlebag Exchange emerges as a game-changer,
        offering a suite of tools designed to elevate auction house strategies
        to new heights. At the heart of its arsenal lies a feature that's
        turning heads and filling pockets: undercutting. What is Saddlebag
        Exchange? Saddlebag Exchange is not just another addon; it's a
        comprehensive toolkit for WoW entrepreneurs looking to dominate the
        market. The addon seamlessly integrates with the game interface,
        providing users with invaluable data and insights to inform their
        trading decisions. From tracking auctions across realms to generating
        real-time undercut alerts, Saddlebag Exchange empowers players to take
        control of their trading experience like never before. The Undercutting
        Advantage At the core of Saddlebag Exchange's offerings is its
        undercutting feature, a game-changing tool for savvy traders.
        Undercutting involves strategically pricing items slightly lower than
        competitors to secure sales and maintain a competitive edge. With
        Saddlebag Exchange, this process is streamlined and simplified, allowing
        users to stay ahead of the curve effortlessly. Regionwide Undercut
        Checks One of the standout features of Saddlebag Exchange is its
        regionwide undercut check functionality. Imagine being able to monitor
        your auctions across multiple realms simultaneously, ensuring that
        you're always in tune with market trends and pricing dynamics. This
        cross-realm capability not only saves time but also opens up
        opportunities for cross-realm arbitrage trading, maximizing profits like
        never before. How it Works Using Saddlebag Exchange is intuitive and
        user-friendly. The addon generates JSON data for undercut alerts, which
        can be seamlessly integrated into the Saddlebag Exchange Discord bot or
        utilized on the website's dedicated web page. By simply copying and
        pasting the data, users gain access to a wealth of information about
        their auctions, including pricing comparisons and undercut alerts. Why
        Undercutting Matters In the cutthroat world of WoW trading, staying
        competitive is paramount. Undercutting ensures that your items remain
        attractive to buyers, increasing the likelihood of quick sales and
        steady revenue streams. With Saddlebag Exchange's undercutting feature,
        players gain an edge over the competition, maximizing their profits and
        establishing themselves as formidable market forces. Get Started with
        Saddlebag Exchange Today! Whether you're a seasoned trader or just
        dipping your toes into the auction house waters, Saddlebag Exchange
        offers something for everyone. By harnessing the power of undercutting
        and leveraging the innovative features of Saddlebag Exchange, players
        can transform their trading experience and unlock new levels of success.
        Conclusion In the ever-evolving world of WoW trading, staying ahead of
        the curve is essential. With Saddlebag Exchange and its cutting-edge
        undercutting features, players can navigate the intricacies of the
        auction house with confidence and finesse. Don't settle for mediocrity;
        unleash the full potential of your trading endeavors with Saddlebag
        Exchange today. Happy trading! Title: Mastering WoW Trading: The Key to
        Success with Saddlebag Exchange In the bustling world of Azeroth's
        economy, where fortunes rise and fall with each auction, having the
        right tools at your disposal can make all the difference. Enter
        Saddlebag Exchange, the ultimate companion for World of Warcraft traders
        seeking to conquer the auction house and amass wealth beyond their
        wildest dreams. At the core of Saddlebag Exchange's arsenal lies a
        feature that's revolutionizing trading strategies and redefining
        success: undercutting. Unveiling Saddlebag Exchange More than just an
        addon, Saddlebag Exchange is a powerhouse of tools designed to give
        players an unparalleled edge in the competitive world of WoW trading.
        With its seamless integration into the game interface, Saddlebag
        Exchange provides users with invaluable insights and data to inform
        their trading decisions, making it a must-have for any serious trader.
        The Art of Undercutting At the heart of Saddlebag Exchange's allure lies
        its cutting-edge undercutting feature—a game-changer for savvy traders
        looking to dominate the market. Undercutting involves strategically
        pricing items slightly lower than competitors to secure sales and
        maintain a competitive edge. With Saddlebag Exchange, this process
        becomes a breeze, allowing users to effortlessly stay one step ahead of
        the competition. Harnessing the Power of Regionwide Undercut Checks
        Saddlebag Exchange's regionwide undercut checks take trading to new
        heights by allowing users to monitor auctions across multiple realms
        simultaneously. Imagine having the ability to keep a finger on the pulse
        of market trends and pricing dynamics across entire regions. This
        cross-realm functionality not only saves time but also opens up
        lucrative opportunities for cross-realm arbitrage trading, enabling
        players to maximize profits like never before. Making Undercutting Work
        for You Using Saddlebag Exchange is as intuitive as it is powerful. The
        addon generates JSON data for undercut alerts, which can be seamlessly
        integrated into the Saddlebag Exchange Discord bot or utilized on the
        website's dedicated web page. By simply copying and pasting the data,
        users gain access to a wealth of information about their auctions,
        including pricing comparisons and undercut alerts, empowering them to
        make informed decisions and optimize their trading strategies. The
        Significance of Undercutting In the cutthroat world of WoW trading,
        staying ahead of the competition is essential for success. Undercutting
        ensures that your items remain attractive to buyers, increasing the
        likelihood of quick sales and steady revenue streams. With Saddlebag
        Exchange's undercutting feature, players gain a competitive edge that
        propels them to the forefront of the market, setting them apart as
        formidable traders capable of achieving unparalleled success. Embrace
        the Saddlebag Exchange Advantage Whether you're a seasoned trading
        veteran or a newcomer eager to carve out your niche in the market,
        Saddlebag Exchange offers the tools and resources you need to thrive. By
        harnessing the power of undercutting and leveraging the innovative
        features of Saddlebag Exchange, players can transform their trading
        experience and unlock new levels of success. Conclusion: Elevate Your
        Trading Game Today! In the ever-evolving landscape of WoW trading, those
        who dare to innovate and adapt are the ones who emerge victorious. With
        Saddlebag Exchange by your side, you'll have everything you need to
        master the art of trading and claim your rightful place among Azeroth's
        elite. Don't settle for mediocrity—embrace the Saddlebag Exchange
        advantage and embark on a journey to trading greatness today. The
        auction house awaits, and your fortune awaits with it. Happy trading!
        Title: Dominating the Auction House: Unleash Your Potential with
        Saddlebag Exchange In the bustling realm of World of Warcraft's economy,
        where gold flows as freely as the winds of Azeroth, mastering the art of
        trading is paramount to success. Enter Saddlebag Exchange, the ultimate
        ally for WoW adventurers looking to conquer the auction house and
        accumulate riches beyond their wildest dreams. At the heart of Saddlebag
        Exchange's arsenal lies a feature that's transforming trading strategies
        and empowering players like never before: undercutting. Introducing
        Saddlebag Exchange: Your Path to Prosperity More than just a mere addon,
        Saddlebag Exchange represents a paradigm shift in the way players
        approach trading in WoW. Seamlessly integrated into the game interface,
        Saddlebag Exchange provides traders with invaluable tools and insights
        to navigate the complexities of the auction house with ease, making it
        an indispensable asset for anyone seeking to thrive in Azeroth's
        bustling marketplace. The Power of Undercutting: A Game-Changing
        Strategy At the core of Saddlebag Exchange's allure lies its
        groundbreaking undercutting feature—a game-changer for traders seeking
        to gain a competitive edge. Undercutting involves strategically pricing
        items slightly lower than competitors to secure sales and maintain
        market dominance. With Saddlebag Exchange, this process becomes not just
        a strategy but a finely tuned art form, allowing players to effortlessly
        outmaneuver their rivals and emerge victorious in the cutthroat world of
        WoW trading. Unparalleled Insight with Regionwide Undercut Checks
        Saddlebag Exchange's regionwide undercut checks revolutionize the way
        traders monitor auctions across multiple realms simultaneously. Imagine
        having the ability to survey market trends and pricing dynamics on a
        regional scale, all from the comfort of your own interface. This
        cross-realm functionality not only saves time but also opens up a world
        of possibilities for cross-realm arbitrage trading, enabling players to
        maximize profits and dominate the market like never before. Navigating
        the Undercutting Landscape: How Saddlebag Exchange Works for You Using
        Saddlebag Exchange is a breeze, thanks to its intuitive interface and
        user-friendly design. The addon generates JSON data for undercut alerts,
        which can be seamlessly integrated into the Saddlebag Exchange Discord
        bot or accessed through the website's dedicated web page. By simply
        copying and pasting the data, traders gain access to a treasure trove of
        information about their auctions, including pricing differentials and
        undercut alerts, empowering them to make informed decisions and stay
        ahead of the competition. Elevate Your Trading Game with Saddlebag
        Exchange Whether you're a seasoned veteran or a newcomer eager to make
        your mark in the world of WoW trading, Saddlebag Exchange has something
        to offer everyone. By harnessing the power of undercutting and
        leveraging the innovative features of Saddlebag Exchange, players can
        unlock their full potential and embark on a journey to trading
        greatness. Conclusion: Seize Your Destiny in Azeroth's Marketplace In
        the ever-shifting landscape of WoW trading, those who dare to innovate
        and adapt are the ones who emerge victorious. With Saddlebag Exchange as
        your guide, you'll have everything you need to conquer the auction house
        and claim your rightful place among Azeroth's elite. Don't settle for
        mediocrity—embrace the power of Saddlebag Exchange and unleash your
        trading potential today. The auction house beckons, and your fortune
        awaits. Happy trading!
      </p>
    </PageWrapper>
  )
}

export default RegionUndercut

const columnList: Array<ColumnList<UndercutItems>> = [
  { columnId: 'item_name', header: 'Item Name' },
  { columnId: 'user_price', header: 'User Price' },
  { columnId: 'lowest_price', header: 'Lowest Price' },
  { columnId: 'realmName', header: 'Realm' },
  {
    columnId: 'link',
    header: 'Undermine Link',
    accessor: ({ getValue }) => (
      <ExternalLink text="Undermine" link={getValue() as string} />
    )
  }
]

const selectOptions = ['user_price', 'lowest_price', 'realmName']

const sortingOrder = [{ id: 'user_price', desc: true }]

const mobileColumnList: Array<ColumnList<UndercutItems>> = [
  { columnId: 'item_name', header: 'Item Name' },
  { columnId: 'user_price', header: 'User Price' }
]
