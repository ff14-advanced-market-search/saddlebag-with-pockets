import { MetaFunction, LinksFunction } from '@remix-run/node'
import Banner from '~/components/Common/Banner'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width, initial-scale=1',
  title:
    'How to Best Prepare and Properly Complete Mythic+ Dungeons in World of Warcraft',
  description:
    'Learn how to prepare and properly complete Mythic+ dungeons in World of Warcraft, where you can get the best weapons and gear.',
  customHeading: 'Guide to Mythic+ Dungeons and Best Gear in WoW'
})

export const links: LinksFunction = () => [
  {
    rel: 'canonical',
    href: 'https://saddlebagexchange.com/blog/wow/skycoach'
  }
]

const MythicPlusGuide = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center mb-6">
        <span className="text-blue-600">
          Join Our Discord for access to our best tools!
        </span>
        <a
          href="https://discord.gg/saddlebag-exchange-973380473281724476"
          className="text-blue-600 hover:text-blue-800">
          Discord →
        </a>
      </div>

      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600">
          How to Best Prepare and Properly Complete Mythic+ Dungeons in World of
          Warcraft
        </h1>
        <p className="mt-2 text-gray-600">
          Where you can get the best weapons and gear
        </p>
      </header>

      <div className="mb-8 flex justify-center">
        <img
          src="/images/wowblog1.png"
          alt="World of Warcraft hero character with magical sword and armor in a fantasy landscape"
          className="max-w-[800px] w-full h-auto rounded-lg shadow-lg"
        />
      </div>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          What is Mythic+?
        </h2>
        <p className="text-gray-700">
          M+ is the most difficult and interesting type of raid in WoW. It
          requires a well-prepared and well-coordinated squad that can not only
          defeat a strengthened boss, but also do it in a short period of time.
        </p>
      </section>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <p className="text-gray-700">
          In this guide, we will analyze the main ideas and tips for your
          successful{' '}
          <a href="https://skycoach.gg/wow-boost/dungeons" className="text-blue-600 hover:underline">
            mythic plus carry
          </a>{' '}
          in raids, where teamwork, speed and confident actions in your roles
          play an important role.
        </p>
      </section>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Preparing for Mythic+: Key Points
        </h2>
        <p className="text-gray-700 mb-6">
          Before you go to a Mythic+ raid to improve the key, you need to
          consider several important aspects.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="border border-gray-300 p-4 font-semibold">
                  Equipment
                </td>
                <td className="border border-gray-300 p-4">
                  Use gear of the appropriate level, it can be obtained in the
                  same raid of lower difficulty.
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-4 font-semibold">
                  Resources and consumables
                </td>
                <td className="border border-gray-300 p-4">
                  Take potions, flasks, runes and other items with you that can
                  strengthen you, or restore health or mana.
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-4 font-semibold">
                  Tactical preparation
                </td>
                <td className="border border-gray-300 p-4">
                  learn the dungeon routes and the locations of monsters that
                  can be bypassed to quickly start the battle with the boss and
                  not waste a lot of time.
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-4 font-semibold">
                  Use voice chat
                </td>
                <td className="border border-gray-300 p-4">
                  to quickly and accurately convey information to your
                  teammates. This is important because every second will count.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="mb-8 flex justify-center">
        <img
          src="/images/wowblog2.png"
          alt="Epic battle scene with a warrior facing a demon lord"
          className="max-w-[800px] w-full h-auto rounded-lg shadow-lg"
        />
      </div>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Equipment: what you need to have
        </h2>
        <p className="text-gray-700 mb-4">
          When choosing equipment, it is important to rely on the features of
          your class.
        </p>

        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
          <li>
            Tank - endurance, speed, versatility. Important for maneuverability
            and survivability.
          </li>
          <li>
            Healer - mastery, haste, crit. The chance of double healing and the
            power of health restoration for your allies depend on these skills.
          </li>
          <li>
            DamageDealers - critical strike and speed - the faster and more
            damage the character deals, the faster the boss will die, which is
            important for your WoW mythic+ raid carry.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Accessories:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
          <li>For Tanks - Blood-Spattered Scale, Reactive Defense Matrix.</li>
          <li>For Healers - Soulletting Ruby, Unbound Changeling.</li>
          <li>For DD - Inscrutable Quantum Device, File of Glacial Fury.</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Enchants:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
          <li>Weapon - Sinful Revelation, Celestial Guidance.</li>
          <li>Cloak - Fortified Leech or Twilight Devastation.</li>
          <li>Armor - Eternal Stats, Eternal Agility.</li>
        </ul>

        <p className="text-gray-700">
          Don't forget about stones and enchantments to enhance your equipment
          and weapons, they can add up to 10% to damage or health restoration
          power.
        </p>
      </section>

      <div className="mb-8 flex justify-center">
        <img
          src="/images/wowblog3.png"
          alt="Female warrior with sword and armor facing a monster"
          className="max-w-[800px] w-full h-auto rounded-lg shadow-lg"
        />
      </div>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Consumables - potions, food and flasks
        </h2>
        <p className="text-gray-700 mb-4">
          These are items that are considered consumable, that is, actively used
          to enhance the hero, or restore health and mana.
        </p>

        <h3 className="text-xl font-semibold mb-3">Potions:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
          <li>
            Strength, Intelligence, Dexterity - an instant increase in the main
            attribute of your class to increase your effectiveness.
          </li>
          <li>
            Restoration potions - replenish your health and mana reserves.
          </li>
          <li>
            Enhancement - increase the characteristics you need, such as damage,
            or protect yourself from fire for a certain time.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Food</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
          <li>Increase all characteristics with food.</li>
          <li>You can cook it yourself, or buy it at the auction.</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Runes:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
          <li>
            Runes of enhancement - increases additional characteristics of your
            class.
          </li>
          <li>
            Runes of survival - allows you to increase damage, or increase
            protection from certain enemy attacks.
          </li>
        </ul>
      </section>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Preparing for the route and mechanics of the dungeon
        </h2>
        <p className="text-gray-700 mb-4">
          Studying the game maps and understanding the correct and quick
          direction on the way to the boss is the key to a successful and
          correct{' '}
          <a href="https://skycoach.gg/wow-boost/dungeons" className="text-blue-600 hover:underline">
            WoW Mythic+ raid carry
          </a>
          .
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Pay attention to the movement of monsters to simply bypass them and
            not waste your time on them.
          </li>
          <li>
            Consider dangerous mechanics that can stun, scare, or poison players
            and require the intervention of healers.
          </li>
        </ul>
      </section>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Addons and tools
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Mythic Dungeon Tools - will help you choose the optimal route for
            your mythic plus raid carry.
          </li>
          <li>
            WeakAuras - track the abilities of bosses and features of the
            current week's affixes.
          </li>
          <li>
            Deadly Boss Mods - warns you about the most dangerous mechanics of
            bosses that can harm you.
          </li>
        </ul>
      </section>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Affixes: how to prepare for different weeks
        </h2>
        <p className="text-gray-700 mb-4">
          Affixes are special modifiers that are constantly changing and add
          complexity to your mythic dungeons.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Tyranical - increases the boss, his attack and defense.</li>
          <li>
            Explosive - summons spheres that need to be destroyed so that the
            raid does not end in failure.
          </li>
          <li>
            Necrotic - tanks receive a debuff on the strength of incoming
            healing and before spending mana to restore his health, you need to
            remove the negative effect.
          </li>
        </ul>
      </section>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Team Preparation and Communication
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Be sure to use voice communication - Discord or any other program
            option will do for you.
          </li>
          <li>
            Distribute responsibilities so that each player only does their own
            tasks and does not switch to helping others.
          </li>
          <li>
            Calculate the percentage of destroyed monsters - you can do this
            yourself or with the help of MDT.
          </li>
        </ul>
      </section>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Spare items and tools
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Food and flasks - in case of protracted battles, reuse food, flasks
            and runes so as not to lose your combat potential.
          </li>
          <li>
            Repair equipment with the Repair Kit in the dungeon itself if
            necessary.
          </li>
          <li>
            Tome of the Still Mind - to change talents before certain bosses, if
            affixes change your plans.
          </li>
        </ul>
      </section>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Tactics for fighting bosses and mobs
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Focused damage - kill dangerous monsters and bosses first.</li>
          <li>
            Avoid unnecessary damage - simply dodge attacks to avoid losing
            health and forcing the healer to waste mana on you or resurrect him.
          </li>
          <li>
            Control monsters so that you don't engage in combat with all of them
            at once.
          </li>
        </ul>
      </section>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Conclusion
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Your Mythic+ raids require a careful approach and accelerated
            progression. If you take the right equipment, plan your route to
            engage in less combat and start the battle with the boss faster.
          </p>
          <p>
            Stock up on consumables and be sure to take into account the current
            week's affixes. Act quickly and distribute your roles correctly.
          </p>
          <p>
            Dodge boss attacks to reduce the load on the healer and use addons
            to plan the right routes, take into account the damage to the boss
            and know which skills to dodge.
          </p>
        </div>
      </section>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">FAQ</h2>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            What to do if the group constantly wipes on the same boss?
          </h3>
          <p className="text-gray-700">
            Analyze problematic moments and replace weak members, or do not
            provoke so many monsters.
          </p>
        </div>
      </section>

      <footer className="mt-12 text-center text-gray-500">
        &copy; {new Date().getFullYear()} SaddlebagExchange. All rights
        reserved.
      </footer>
    </div>
  )
}

export default MythicPlusGuide
