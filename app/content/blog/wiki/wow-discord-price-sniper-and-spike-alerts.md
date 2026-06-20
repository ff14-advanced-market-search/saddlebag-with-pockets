# Saddlebag Discord Bot Price Sniper

# Summary

Available to 🦸🏻[Gaming Hero Subscribers!](https://discord.gg/U2qvBbNj3w)🦸🏻

Available to 🥇[Gold Capped Members!](https://discord.gg/goldcapped)🥇

Available to [discord subscribers](https://discord.com/servers/saddlebag-exchange-973380473281724476), [patreons](https://www.patreon.com/indopan) and free trial members.

**Also available for free in discords that install the AzerothAuctionAssassin mini bot!**

Now with a `quantity` option to snipe based on quantity or price!

<img width="560" alt="image" src="https://user-images.githubusercontent.com/17516896/211570855-8d427d1c-33b5-4734-b79f-65a746bdf7dc.png">

<img width="418" alt="image" src="https://github.com/user-attachments/assets/1847cbe5-dcf8-4e45-837a-18d87cbe2041">

## TLDR

Heres how to get price alerts!

1. [Make your data here on this webpage](https://saddlebagexchange.com/wow/price-alert)
2. Then go in discord and give it to the bot.
3. Wait for alerts in your DMs

Heres the commands for AAA mini:

```
- /alert-start
- /alert-stop
- /alert-update
```

If you are a saddlebag exchange discord user you will do this instead

```
- /wow price-register
- /wow price-update
- /wow price-unregister
- /check-alerts
```

# Setup

1. [Go to the bot data generator on our website.](https://saddlebagexchange.com/wow/price-alert) The default screen looks like this:

<img width="989" alt="image" src="https://user-images.githubusercontent.com/17516896/211571241-49aa27c8-1eaf-4125-8e0c-d1be55725d94.png">

2. Pick the items you want to monitor by name and pick a price.
3. Pick if you want to be alerted when they go below a price or above a price.

<img width="738" alt="image" src="https://user-images.githubusercontent.com/17516896/211571777-58b3ac30-bc6c-4964-b7f0-0947e33c5585.png">

4. Click add to add it to the json data below.
5. Select your region and server name.
6. After that your json data will look like the following. Click the copy button to copy the data to your clipboard.

<img width="683" alt="image" src="https://user-images.githubusercontent.com/17516896/211573313-3e032adb-f0c4-4873-a008-19f721ae1efa.png">

If you want to be alerted for every server in your region instead of just one at a time for sniping Recipes and BOA's then use our desktop app the [Azeroth Auction Assassin](https://github.com/ff14-advanced-market-search/AzerothAuctionAssassin/blob/main/README.md) which supports both retail and classic!

<img width="546" alt="image" src="https://github.com/user-attachments/assets/c24b48b6-7dbd-4a19-b109-4f4f31725678">

7. [Go to our discord](https://discord.gg/Pbp5xhmBJ7) and in any channel (or the bot-command channels if you are confused) run the `/wow price-register` command. **Type out the command and the bot will autocomplete**, don't paste the `/wow price-register` command in discord it wont pop up.

If you are using the **Azeroth Auction Assassin** mini bot then you will use `/alert-start` and `/alert-stop` instead, but they act exactly the same.

Using Saddlebag Bot:

<img width="456" alt="image" src="https://user-images.githubusercontent.com/17516896/211572821-8b269e6b-2964-488d-8a90-28392c471e26.png">

Using AAA mini Bot (they work the same, just different names):

<img width="511" alt="image" src="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/59c69af8-dca9-408e-b774-dfbffdd64cf9">

8. This will cause a box to pop up. Paste your json data from the website in here.

<img width="433" alt="image" src="https://user-images.githubusercontent.com/17516896/211573203-67bde3d9-76c8-411d-b14d-fc6ed7c7488a.png">

9. After the Blizzard data updates (around 30 min past the hour) you will receive alerts on anything above or below your set parameters.

# Get alerts for multiple realms

OPTIONAL To monitor more than one realm use a json list instead, if you want help with formatting ask [chatgpt](https://chat.openai.com/chat):

```
[
{
  "region": "NA",
  "homeRealmName": "Thrall",
  "user_auctions": [
    { "itemID": 194641, "price": 1000000000, "desired_state": "above" },
    { "itemID": 420420, "price": 1000000000, "desired_state": "above" }
  ]
},
{
  "region": "NA",
  "homeRealmName": "Emerald Dream",
  "user_auctions": [
    { "itemID": 194641, "price": 1000000000, "desired_state": "above" },
    { "itemID": 420420, "price": 1000000000, "desired_state": "above" }
  ]
}
]
```
