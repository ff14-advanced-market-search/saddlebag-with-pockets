# How to trade using our WoW Market Overview

Saddlebag Exchange provides unique features found only on our website for a [WoW Market Overview](https://saddlebagexchange.com/wow/marketshare) and [WoW Commodity Shortage Predictions](https://saddlebagexchange.com/wow/shortage-predictor).

<img width="1232" alt="image" src="https://user-images.githubusercontent.com/17516896/217342343-8e4fe736-fb38-4ebb-9847-8abb2773901f.png">

# How to make gold with the market overview

## Learning when to craft or gather an item

TLDR:

- Big boxes with a big current market value are good items to craft/gather
- Little boxes with a small current market value are bad items to craft/gather
- You should craft or gather and sell at current prices when the price overview is **bright green**
- You should craft or gather and sell at a higher price when the quantity overview is bright green
- **You should stay far away from items that are bright red in either the quantity or price overview** they are probably unprofitable

The simplest way to answer this is that you should sell items that are green in the price overview as they have increased in price and are likely profitable and are having a spike or increase with very high prices.

You can also use the quantity overview to find items that are low in quantity as those items may increase in price very soon when the quantity runs out causing a shortage. You can investigate this further with the [WoW Commodity Shortage Predictions](https://saddlebagexchange.com/wow/shortage-predictor) to see if the quantity is still declining and will likely lead to a massive spike in prices.

## Saving gold and profession knowledge points by avoiding small markets:

The best way to use this is to get an idea of what is selling the best. When you are considering using skill points to invest in unlocking a new craft , make sure the market is valuable.

IE. unlocking `Illusory Adornment: Order` takes 20 skill points for enchanters on a rarely used skill line. Looking at the market overview, we can see that it is hardly ever sold at all. Even the larger markets such as the `Illusory Adornment: Fire` is quite small only taking in around 60k revenue per day.

<img width="1252" alt="image" src="https://user-images.githubusercontent.com/17516896/217349388-8634c339-e06e-4ab1-be51-aed73c9e7169.png">

By comparison the `Enchant Bracer - Devotion of Speed` is worth millions of gold each day and investing skill points to unlock it will give you far more opportunities for profit.

<img width="1247" alt="image" src="https://user-images.githubusercontent.com/17516896/217349988-30feae9c-b38d-439d-97aa-33f09961b205.png">

## Learning what items are worth flipping and investing in

When looking at non commodities which are only available on your realm and not on the region wide auction house. You should lower the default sale rate and increase average minimum prices as the most valuable items are usually very slow selling recipes, epic BOA items and possibly even mounts.

<img width="680" alt="image" src="https://user-images.githubusercontent.com/17516896/217350971-1b807926-b944-45ea-953a-12eef86d8fe2.png">

You will often find far more price spikes and bullish markets when looking at local realm items.

<img width="1253" alt="image" src="https://user-images.githubusercontent.com/17516896/217351873-d9df3fc4-cf35-4f19-9f95-e7a1fa5c68f1.png">

Most if not all of these items will not be crafted goods and are instead random drops like BOA's and recipes. As they cannot be mass-produced when prices rise they can actually be a good investment when buying them for a low price and then reposting at a much higher price.

These are great items to watch using our [WoW Discord Price Sniper and Price Spike Alerts](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/WoW-discord-price-sniper-and-spike-alerts) so you can snipe them up when the prices get very low.

# More info on how to use the "Dragonflight Auction House Marketshare Overview"

Our market overview heat map and table offer a complete overview of the market to view what is most valuable.

You begin by selecting what items you want to view. The default options will find what are generally the biggest and most valuable Dragonflight markets.

- You can change the average sale rate to a higher value to find faster-selling items
- You can change the average sale price to get items that sell for higher values
- The category and subcategories narrow down only the items you want to see (an enchanter/tailor may want to view the item enhancements most of all, alchemists or cooks may prefer the consumables, miners/skinners/herbalists may prefer the trade goods section)
- Turning off `Commodity items` will show you details on items not sold on the region-wide auction house like: recipes, BOAs, armor, weapons, mounts, toys, etc. These all have slower sale rates but far less competition.

<img width="666" alt="image" src="https://user-images.githubusercontent.com/17516896/217342269-83c8d326-579e-4eaf-a2ab-566c61283f69.png">

The results page displays a table with information on the top 200 items by market share

<img width="1155" alt="image" src="https://user-images.githubusercontent.com/17516896/217345801-81cb847f-9f80-4879-9fee-040fa4743c4f.png">

- **Current Market Value:** We calculate the current market share by the TSM sales per day value multiplied by the current minimum price of each item
- **Historic Market Value:** We calculate historic market share by the TSM sales per day value multiplied by the TSM average price value

These values are then used to create the boxes within our heatmap

<img width="1232" alt="image" src="https://user-images.githubusercontent.com/17516896/217342343-8e4fe736-fb38-4ebb-9847-8abb2773901f.png">

The map can be changed from current value to historic value to see the change in each one

The map for commodities can show a quantity overview to show you what items are running out of stock and may increase in price soon

Other item stats provided include:

---

- **Percent Changed:** The current price divided by the TSM average
- **Market State:** Depending on _Percent Changed_ this will change the color of each box. `Spiking` (bright green) is over 60% change, `Increasing` (dark green) 60% to 15%, `Stable` (yellow) is 15% to -15% change, `decreasing` (dark red) is -15% to -60%, and `crashing` (bright red) is under -60% change.
- **Sales Per Day:** The soldPerDay value from the TSM API
- **Minimum Price:** The current minimum price at the last blizzard auction house API update
- **Historic Price:** The average-price value from the TSM API
- **Average Quantity:** Average quantity for an item (only available to commodities)
- **Current Quantity:** Current quantity for an item (only available to commodities)
- **Quantity Percent Remaining:** Current quantity divided by average quantity (only available to commodities)
- **Oribos Link:** A link to oribos exchange with their web view of the auction house and quantity vs price graphs
