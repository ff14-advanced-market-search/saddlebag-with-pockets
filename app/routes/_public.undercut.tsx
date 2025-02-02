import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import GetSellerId from '~/requests/FFXIV/GetSellerId'
import ItemSelect from '~/components/form/select/ItemSelect'
import NoResults from '~/components/Common/NoResults'
import Results from '../components/FFXIVResults/UndercutAlert/Results'
import SelectDCandWorld from '~/components/form/select/SelectWorld'
import z from 'zod'
import { parseZodErrorsToDisplayString } from '~/utils/zodHelpers'
import { parseStringToNumber } from '~/utils/zodHelpers'
import { getUserSessionData } from '~/sessions'
import Banner from '~/components/Common/Banner'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'FFXIV Discord Undercut and Sale Alerts, sell faster!',
    description:
      'Generate data for Sadddlebag Exchange discord bot ffxiv undercut and sale alerts. Sell faster when no one can sell under you!',
    customHeading:
      'Maximize Your Profits with FFXIV Undercut and Sale Alerts from Saddlebag Exchange'
  }
}

export const links: LinksFunction = () => [
  { rel: 'canonical', href: 'https://saddlebagexchange.com/undercut' }
]

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
      <Banner />
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
      <p style={{ fontSize: '1px' }}>
        Mastering the Marketboard: The Essential Role of Undercutting and
        Saddlebag Exchange in FFXIV In the bustling virtual economy of Final
        Fantasy XIV (FFXIV), mastering the Marketboard is crucial for any
        merchant aspiring to profit. This guide dives deep into the strategy of
        undercutting, a common yet powerful technique, and introduces an
        invaluable tool: the Saddlebag Exchange Discord alerts. Understanding
        Undercutting on the Marketboard In FFXIV, the Marketboard operates on a
        simple yet brutal principle: the lowest price wins. If your item is
        priced even a single gil lower than the competition, it captures the
        attention of buyers, potentially monopolizing sales. This highly
        competitive environment makes regular price updates a necessity,
        ensuring that your listings remain attractive to prospective buyers. The
        Drawbacks of Frequent Updates However, updating prices isn't without its
        drawbacks. Accessing the retainer menu to adjust prices means
        temporarily pulling your items off the Marketboard, halting their sales
        until they are listed again. This interruption not only impacts your
        sales but also your efficiency, as managing multiple retainers can
        become a cumbersome task. Saddlebag Exchange: A Game-Changing Solution
        This is where Saddlebag Exchange comes into play. By utilizing their
        Discord bot alerts, merchants can receive notifications whenever they
        are undercut. This service taps into the Universalis data, a
        crowd-sourced database that tracks Marketboard transactions, ensuring
        that the information is both current and accurate. How Saddlebag
        Exchange Works Here's a quick rundown of how you can integrate Saddlebag
        Exchange into your FFXIV trading routine: Subscribe to Alerts: By
        joining the Saddlebag Exchange Discord and subscribing to undercut
        alerts, you can receive notifications directly through Discord—no need
        to constantly check the Marketboard yourself. Minimize Retainer
        Interactions: With alerts notifying you only when necessary, you can
        significantly reduce the number of times you need to access the retainer
        menu, thus minimizing the downtime of your items on the Marketboard.
        Customizable Alerts: You can customize alerts to track specific items,
        ignore non-threatening undercuts, and even filter by item quality (HQ or
        NQ). This level of customization ensures that you receive only the most
        relevant notifications. Setup and Usage Getting started with Saddlebag
        Exchange is straightforward. Here’s how you can set it up: Join the
        Discord: The first step is to join the Saddlebag Exchange Discord
        server. You can either subscribe as a Patreon supporter or start with a
        free trial. Generate Undercut Alerts: Use the provided tools on their
        website to generate your undercut alert data. This involves linking your
        seller ID and selecting specific items you want to monitor. Activate the
        Alerts: Back in Discord, use the bot commands to activate your alerts.
        You can customize your settings to focus on specific items or ignore
        others. Receive and Act on Alerts: Once everything is set up, you’ll
        start receiving real-time alerts whenever you are undercut. This allows
        you to react swiftly and reprice your items, keeping them competitive
        without constant monitoring. Why Use Saddlebag Exchange? Utilizing
        Saddlebag Exchange offers a significant advantage by automating one of
        the most time-consuming aspects of trading on the FFXIV Marketboard.
        This not only saves time but also ensures that your listings remain
        competitive with minimal effort. Conclusion In conclusion, mastering
        undercutting on the FFXIV Marketboard is essential for any serious
        trader. By leveraging tools like Saddlebag Exchange, you can streamline
        the process, reduce the operational hassle, and focus more on your
        trading strategy rather than mundane tasks. Embrace these modern
        solutions to stay ahead in the competitive world of FFXIV trading!
        Navigating the Competitive Landscape of FFXIV's Marketboard with
        Undercutting and Saddlebag Exchange The world of Final Fantasy XIV
        offers players not just epic quests and battles but also a complex and
        thriving in-game economy. Effective use of the Marketboard is crucial
        for players looking to maximize their profits from selling items. One of
        the key strategies in dominating this digital marketplace is
        undercutting, which, when combined with the innovative Saddlebag
        Exchange Discord alerts, can transform your trading game. The Art of
        Undercutting Undercutting is a simple yet strategic approach used by
        sellers on the Marketboard to ensure their items have the best chance of
        being sold. By listing items at prices slightly lower than the
        competition, a seller can more effectively attract buyers. The catch,
        however, is that the lowest-priced listings often see the most traffic
        and sales, necessitating vigilance and timely updates to stay ahead.
        Challenges of Market Management Regularly updating item prices to stay
        competitive typically requires constant attention to the Marketboard,
        which can be both time-consuming and tedious. Moreover, every time
        sellers access their retainers to change prices, those items are
        temporarily removed from the Marketboard, halting any potential sales
        during that period. This creates a need for a solution that minimizes
        the downtime and maximizes efficiency in managing listings. Saddlebag
        Exchange: Enhancing Market Efficiency Enter Saddlebag Exchange, a
        Discord-based tool that significantly eases the burden of manual market
        monitoring. Through real-time alerts, the tool notifies players when
        their listings are undercut, allowing them to react promptly without the
        need to constantly check the Marketboard. Features and Benefits
        Real-Time Notifications: As soon as your item is undercut, Saddlebag
        Exchange alerts you through Discord, enabling quick and strategic
        repricing. Efficiency in Management: By reducing the frequency of
        accessing retainer menus for price updates, you minimize the risk of
        sales interruptions. Customizable Alerts: Tailor your notifications to
        focus on specific items or conditions, such as high-value items or those
        where you hold a large stock. Getting Started with Saddlebag Exchange
        Setting up Saddlebag Exchange is straightforward, ensuring that even
        players new to market trading can easily take advantage of its features:
        Subscription: Join the Saddlebag Exchange Discord and choose between a
        free trial or a paid Patreon subscription to access advanced features.
        Configuration: Utilize the tool on the Saddlebag Exchange website to
        generate your personalized undercut alert data, linking your in-game
        seller ID with the Discord bot. Activation: In Discord, use simple
        commands to start receiving undercut alerts tailored to your market
        activities. Action: With alerts coming directly to your Discord, you can
        immediately update your listings as needed, ensuring they remain
        competitive. Leveraging Saddlebag Exchange for Market Success The
        combination of strategic undercutting and the use of Saddlebag
        Exchange’s notifications creates a powerful toolset for any player
        involved in FFXIV’s Marketboard. This approach not only saves time but
        also significantly enhances your ability to compete effectively in the
        game’s economy. Conclusion Understanding and utilizing undercutting in
        conjunction with tools like Saddlebag Exchange can lead to increased
        sales and higher profits on FFXIV’s Marketboard. By automating the
        monitoring process and reducing the operational demands of market
        management, players can focus more on enjoying the game while still
        engaging effectively in its economic aspects. Embrace these tools to
        become a savvy digital merchant in the world of Final Fantasy XIV.
        Capitalizing on Market Dynamics: The Crucial Role of Undercutting and
        Saddlebag Exchange in FFXIV In Final Fantasy XIV, the Marketboard isn't
        just a feature—it's an arena where fortunes can be made and lost in the
        blink of an eye. For players who engage in the economic side of the
        game, mastering the dynamics of the Marketboard is as critical as any
        quest. A fundamental tactic in this digital marketplace is undercutting,
        which, when paired with the innovative tool of Saddlebag Exchange
        alerts, can substantially enhance your trading effectiveness. The
        Strategy of Undercutting Undercutting involves listing your market items
        at prices slightly below the lowest current price to ensure they appear
        more appealing to buyers. This method is particularly effective due to
        the game's design, where buyers tend to see the lowest-priced items
        first. While seemingly straightforward, the practice of undercutting
        requires precision and timing to avoid unnecessary price wars and profit
        loss. The Complexity of Marketboard Management Regular updates to your
        listings are necessary to stay ahead, but these updates come with their
        own set of challenges. Every time you access your retainers to adjust
        prices, those items are temporarily pulled from the Marketboard,
        potentially missing out on sales. This highlights the need for an
        efficient method to manage updates without disrupting your market
        presence. The Edge Provided by Saddlebag Exchange Saddlebag Exchange
        addresses these challenges by providing Discord-based alerts that notify
        you when your items are undercut. This tool leverages data from
        Universalis, a comprehensive FFXIV market data provider, ensuring that
        the information is accurate and timely. Key Advantages of Using
        Saddlebag Exchange Immediate Alerts: Receive notifications directly on
        Discord the moment your item is undercut, allowing for quick responses
        without constant market monitoring. Minimized Market Downtime: Keep your
        items listed longer by reducing the frequency of retainer menu accesses,
        thus minimizing sales interruptions. Customization Options: Set alerts
        for specific items or conditions to prioritize your most valuable or
        volume-heavy listings. How to Integrate Saddlebag Exchange Into Your
        Market Practices Integrating Saddlebag Exchange into your FFXIV market
        activities is straightforward and can be broken down into a few simple
        steps: Join and Subscribe: Access the tool by joining the Saddlebag
        Exchange Discord community. You can start with a free trial or opt for a
        Patreon subscription for additional features. Set Up Your Alerts: Use
        the Saddlebag Exchange website to generate a configuration that links
        your market activities to the alert system. This setup involves
        identifying your seller ID and specifying which items you want to
        monitor. Discord Notifications: Use the Discord bot to activate your
        settings and start receiving real-time alerts. Respond and Adjust: With
        accurate and timely information, you can promptly adjust your prices
        whenever you are undercut, keeping your listings competitive with
        minimal effort. Conclusion: Enhancing Your FFXIV Trading Experience By
        utilizing the strategic approach of undercutting combined with Saddlebag
        Exchange's real-time notifications, players can maintain a competitive
        edge on the Marketboard with less effort and more efficiency. These
        tools not only help in maximizing profits but also in maintaining a
        robust presence in the game's economy. Whether you are a seasoned trader
        or just starting to explore FFXIV's economic opportunities, leveraging
        these techniques and tools will undoubtedly enhance your trading
        experience and financial success in the realm of Eorzea.
      </p>
    </PageWrapper>
  )
}

export default Index
