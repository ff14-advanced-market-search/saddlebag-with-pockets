# [WoW Discord Undercut Alerts](https://www.curseforge.com/wow/addons/saddlebag-exchange)

## Description:

To use our undercut alerts you either need to ask us for access in [our discord](https://discord.gg/836C8wDVNq) or become a patreon.

Our WoW Addon will generate json data for undercut alerts! You will then go to [our discord](https://discord.gg/836C8wDVNq) and run `/wow undercut-register` to give this to our discord bot.

This works even better on our webpage https://saddlebagexchange.com/wow/region-undercut

Web Page:
<img width="522" alt="alpha-undercut-check" src="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/c1f3c0c6-5234-430d-9f9f-82c56ce37929">

Discord Alert:
![image](https://user-images.githubusercontent.com/17516896/218138395-8a577074-6da9-440d-bf74-2363fa93ce72.png)

Our alerts track the price levels of your auctions vs the blizzard auction api data and alerts you via discord when we find that you have been undercut. We only do this for items that are not commodities (only sell in stacks of 1) as commodities are almost always undercut within an hour.

The great thing about our tool is that it can alert you when you are away from the auction house or even when you're offline as it relies on web api data instead of in game data. This is very useful on items like Recipes that are high value and slow moving allowing you the chance to be alerted via discord before a potential buyer arrives.

# How to Setup Undercut alerts?

1. Download the Saddlebag Exchange addon from curseforge: https://www.curseforge.com/wow/addons/saddlebag-exchange

2. When you open the auction house window you will notice 2 buttons at the top, you must click on your `Auctions` tab to view your auctions for the data to populate automatically or update.

- `Show Single Undercut Data` will show just the json data for your current character
- `View Full Undercut Data` will show you all of the json data for all of your characters

![image](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/f1ff7226-fce4-4287-9b17-5e938230fc22)

![image](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/a70cb12f-4a7b-4ed6-beda-6db0cdb46e5c)

![image](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/e9219a01-0974-4b2e-8793-32e1c996d51b)

3. Copy this to your clipboard with `control` + `c` and you will then give it to our discord bot:

Addon Undercuts Json Example:

```json
[
  {
    "homeRealmName": "16",
    "region": "US",
    "user_auctions": [
      { "petID": 3331, "price": 33339900, "auctionID": 1225766256 },
      { "petID": 1387, "price": 99990000, "auctionID": 1228529275 },
      { "petID": 845, "price": 33339400, "auctionID": 1228528783 },
      { "petID": 844, "price": 66669000, "auctionID": 1228528435 },
      { "petID": 1804, "price": 114900, "auctionID": 1228529658 },
      { "petID": 846, "price": 25000000, "auctionID": 1225767527 }
    ]
  }
]
```

4. In our discord run `/wow undercut-register`

<img width="846" alt="image" src="https://user-images.githubusercontent.com/17516896/218140207-15352ddb-33da-4694-a117-6f7d14c08149.png">

5. A window will pop up and you put your json data in there:

<img width="451" alt="image" src="https://user-images.githubusercontent.com/17516896/218140545-25d25216-9c87-459a-9019-d256f8fa720d.png">

6. When we get new data from the api once per hour you will get an alert if we find the price of your item is undercut or it is no longer there meaning your item and all at the same price probably sold!
