# Introducing Undercut Alerts and Discord Bot

A Discord bot that will revolutionize FFXIV markets! The bot reads through [Universalis crowd-sourced data](https://universalis.app/docs/index.html) and will message you whenever Universalis indicates that you are undercut.

These alerts require a free trial or the `Patreon Supporter` rank. Either join our [Patreon](https://www.patreon.com/indopan) or join the Discord and run the `/free-trial` command to get a one-month free trial of our advanced Patreon features.

> We are only using publicly available data. We are **NOT** relying on any in-game data services, and these alerts are **TOS compliant**.

The best way to create undercut JSON is with the [Allagan Tools](https://saddlebagexchange.com/allagan-data) page, which will find all your retainer names. See this note on why we [no longer use the `seller_id` values](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Changes-to-%60seller_id%60-impacting-sale-and-undercut-alerts).

You can also use [this page](https://saddlebagexchange.com/undercut) to construct your undercut data from scratch by adding all your retainer names.

![Bot Image](https://user-images.githubusercontent.com/17516896/225727554-226108e7-b7f2-443d-8118-a143c3b15b51.png)

## Bot Commands

![Bot Commands](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/ffae6d74-3745-40fb-b86e-bc90b4a37a7a)

### To Start Alerts

Type `/ff undercut` in any Discord channel to add yourself to undercut alerts.

### To Stop Alerts

Type `/ff undercut-unregister` to stop alerts and remove yourself from future alerts.

### Quick Notes

- UC alerts will automatically find items based on your retainer_names if you are within the lowest 30 listings.
- UC alerts rely on Universalis, which only updates when an item is looked up on the market board by a PC player with [Dalamud Plugins](https://github.com/goatcorp/Dalamud).
- The bot may spam you when you are not undercut anymore because Universalis has not updated (this is why we have `ignore_ids`).
- You will need to allow messages from server members to receive direct message alerts from the bot.

![Bot Example](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/63af2b36-9b11-4934-99e5-30fb342308da)

UC alerts are still in early stages; there may be some downtime while we work out the bugs.

## Setup

1. **To set up undercut alerts, become a [Patreon Subscriber](https://www.patreon.com/indopan/membership) or join our Dev/QA team as the feature is in early access and not yet publicly available:**

You can either subscribe to our Patreon or ask `indopan#7191` on Discord to give you a 1-month free trial. After 1 month, you can either become a Patreon, join the Dev team to QA test new features, or become a full Dev and help us build the website. We encourage you to become a Patreon to help pay our server bills.

- `Members` or `Free-Trials` can register 1 character.
- `Fancy Members` can register 3 characters.
- `Elite Members` can register 20 characters.

Once you have the `Patreon Supporter` or `Team` rank in Discord, you are ready to enable undercut alerts.

2. **Generate your Undercut JSON Data:** Go to our [undercut alert info generator](https://saddlebagexchange.com/undercut) and generate your undercut JSON data.

Then the form will make your undercut data. Be sure to add all your retainers into the name list with the `Add Retainers` button:

![Undercut Data Example](https://github.com/user-attachments/assets/11c68f94-13cf-439e-9cf1-eb651587a755)

Below that, you can also grab data for **Sale Alerts** that tell you when items sell. Add this with the bot command `/ff sale-register`.

![Sale Alerts](https://github.com/user-attachments/assets/8011f148-f7a3-4948-9bb8-10f87812fdde)

3. **Create the data for `/ff undercut`:**

If you have just one character, you can use the JSON as is for `/ff undercut`:

```json
{
  "retainer_names": [
    "my retainer",
    "my other retainer",
    "my other other retainer"
  ],
  "server": "Lich",
  "add_ids": [],
  "ignore_ids": [],
  "hq_only": false,
  "ignore_data_after_hours": 720,
  "ignore_undercuts_with_quantity_over": 9999
}
```

If you want to run undercut checks for more than one character on any server, data center, or region, use the [undercut alert info generator](https://saddlebagexchange.com/undercut) for each server you sell on. Then, add all your JSON blobs into the list:

```json
[
  {
    "retainer_names": [
      "my retainer",
      "my other retainer",
      "my other other retainer"
    ],
    "server": "Famfrit",
    "add_ids": [],
    "ignore_ids": [],
    "hq_only": false,
    "ignore_data_after_hours": 720
  },
  {
    "retainer_names": [
      "my 2retainer",
      "my other 2retainer",
      "my other other 2retainer"
    ],
    "server": "Moogle",
    "add_ids": [],
    "ignore_ids": [],
    "hq_only": false,
    "ignore_data_after_hours": 720
  }
]
```

4. **Giving data to the Discord bot:**

Go to any channel in our Discord and type `/ff undercut` and select the `/ff undercut` option (note that in the older version this was `/ff undercut-register`).

![Undercut Register](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/434ce4d1-1c32-4126-8f17-bb234edf7d2c)

A message will pop up, select the `JSON` option.

![JSON Option](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/cac763a1-6b46-4ca7-aab4-06679a6d2b9c)

A text box will pop up, paste in the data we created in **step 3** and hit `Submit`.

![JSON Submit](https://user-images.githubusercontent.com/17516896/202043112-f56df509-7f92-4f23-a913-7b8ce67db5c5.png)

You will now be registered for undercuts and receive a message whenever you are undercut. The data is checked every 5 minutes to see if you are being undercut.

## For more options, see our advanced undercuts guide

[FFXIV Advanced Undercut Alert Options](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/FFXIV-Advanced-Undercut-Alert-Options)

## You only want to be alerted on HQ undercuts for some items

See the guide on how to do this in the advanced section:

[HQ Undercuts Guide](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/FFXIV-Advanced-Undercut-Alert-Options#you-only-want-to-be-alerted-on-hq-undercuts-for-some-items)

## Alternative seller id finder

[Alternative Seller ID Lookup](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/FFXIV-Alternative-Seller-Id-Lookup)

## Additional Data

There are 6 fields in the data you send to the bot:

1. **`retainer_names`**: This is where you list all the names of your retainers on a server. We will automatically find items you are selling on any retainer for your character if the listings are in the lowest 30 listings. This is based on the data that is in Universalis. If you are not being updated, then it's possible Universalis does not have the latest data.

2. **`server`**

: This is the server you are selling on.

3. **`add_ids`**: If alerts are not finding an item based on your `retainer_names`, find the item's specific `item_id` and add this to the `add_ids` section of your data. For example, `"add_ids": [4745, 33275]` will add [Orange Juice](https://universalis.app/market/4745) and [Icebox](https://universalis.app/market/33275) to make sure it looks for your retainers in that auction. The `item_id` will be at the end of the Universalis URL. For example, "Orange Juice" is 4745:
   ![Item ID](https://user-images.githubusercontent.com/17516896/202045382-148adec9-7655-421f-9493-151c33328620.png)

4. **`ignore_ids`**: If you don't want to be alerted on an item, add it in a comma-separated list to `ignore_ids`, similar to `add_ids`. This can be useful if you are selling an HQ item and are undercut by NQ items and don't want to be alerted by those.

5. **`ignore_data_after_hours`**: Ignores data that is too old. The default value is 720 hours (i.e., 30 days) where all items will be ignored when the data was last updated on Universalis over 30 days ago. The minimum value is 1 and will only alert on the latest data.

6. **`hq_only`**: If you want to ignore all NQ items, change this from `false` to `true`. This is only recommended if you sell nothing but HQ items.

## Updating Data and Getting Results in Real-Time

To update the data in real-time, follow these steps:

1. Install [Dalamud Plugins](https://github.com/goatcorp/Dalamud).
2. Look up the item on the market board in-game to update Universalis data. We recommend creating a favorites list of all items you are selling so you can spam-click them.
3. Once you see the listings on the market board, Universalis will update.
4. Check that Universalis has your retainer and listing visible on the bottom 30 auctions by the lowest price.
5. Our data will update shortly after that, and you will get an alert if undercut.

## Common Questions

**Q: I did undercuts for one retainer. Do I need to do it for everyone?**  
**A:** No, you only ever have to do this once per server. But you must add all retainer names on the list.

**Q: Why are some of my items undercut but not showing up in alerts?**  
**A:** Undercut alerts and all Saddlebag data come from Universalis. Universalis is crowdsourced and updates when someone with Dalamud Plugins installed looks at an item on the market board in-game. Check the last updated time on Universalis; if it's very old, go look up the item yourself to update the data.

![Universalis Update](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/d2e4347d-b9d8-493a-a76b-65159a3febb7)

**Q: I changed items in my retainers, and the undercuts are wrong.**  
**A:** Universalis does not update when you change your retainers. Universalis updates when someone with Dalamud Plugins installed looks at an item on the market board in-game.

**Q: Do I need to update Universalis by looking up items on the market board every time I add an item?**  
**A:** It helps, but it is not necessary. If you want it updated immediately, then yes, look it up. Otherwise, someone will eventually update it. That's how crowdsourcing works.

**Q: I don't see my retainer and get an error.**

![Retainer Error](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/0e06dc70-8240-44b9-a4b5-48ae82b178aa)

![Universalis Retainer Check](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/bd6a5ed6-464b-431c-9210-62d0d9d76a25)

**A:** Go to Universalis and see if your retainer is there. If not, then Universalis may be out of date. Make sure you have Dalamud Plugins installed, and then go to the market board in-game and look up the item. That will update Universalis.

![Universalis Retainer](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/2b27360d-12ab-452d-b824-b0ef969c990a)
