# [📺 Watch the video guide!](https://www.youtube.com/watch?v=6wyHmxMr6Y8)

# Overview

Our [Crafting Profit Simulator](https://saddlebagexchange.com/ffxiv/craftsim/queries) (based on the wow addon craftsim profit search) will search for the most profitable items you can craft!

<img width="880" alt="image" src="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/d33f51d8-c497-4473-b632-25381e5b76b7">

# Search Menu Options

This search is based on the inputs you choose from our search menu.

<img width="674" alt="Screen Shot 2023-09-03 at 5 37 49 PM" src="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/41246f2b-94d9-44d2-a83e-8cd14c04ac6e">

## Main Search Options

The main search options include:

- `Home Server`: for the server you will be selling on
- `Item Category`: if you want to search for a specific category (multi category select is available in the API but not in the temporary frontend)
- `DoH`: where you pick which job you want to search recipes on or select `Omnicrafter` to search all crafting recipes.
- `sales_per_week`: to filter items by a minimum amount of regional sales per week (increase this for faster selling items)
- `median_sale_price `: to filter items by a minimum median regional sale price per unit (increase this for more valuable items)
- `max_material_cost`: to filter out items with too high of a crafting cost (lower this value if you are poor)

## Cost and Revenue Options

The most important search options are the `Cost` and `Revenue` options. These allow you to select which metrics you wish to use for profit calculations:

<img width="445" alt="image" src="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/c9f55281-c004-46f2-bee6-6d69f20b2a71">
<img width="438" alt="image" src="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/ac8005b4-1f08-427e-b229-cd74f1d14c24">

For costs the tldr; is that the `Costs: based on materials regional median sale price` option is most realistic. If the `Costs: based on materials current regional minimum listing price` option is way lower than the median and you might find some good deals on a few materials, but you will not realistically find all the materials you need at that cost. The true cost of a craft is likely somewhere in between the **Median Cost** and **Minimum Listing Price** options if you shop around or use our [crafter shopping list tool](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Temp-%E2%80%90-How-to-use-FFXIV-Shopping-List)

All cost options include:

- `Costs: based on materials regional median sale price` Will estimate crafting ingredient costs based on the regional median sale price of each ingredient needed. This is typically the most common price found and the realistic metric to use if you are shopping on multiple servers for the best price in your region.
- `Costs: based on materials regional average price` Will estimate crafting ingredient costs based on the regional average sale price of each ingredient needed. This is a more pessimistic and higher cost as it takes into account "lazy" sales that happen when people buy materials for higher price on their local marketboard instead of shopping around.
- `Costs: based on materials current regional minimum listing price` Will estimate crafting ingredient costs based on the current regional minimum listing price each ingredient needed. This is often lower than what you may find as a single listing posted at a very low price can throw off the calculation. This may be a very large and expensive bulk stack at a low price per unit with far more materials than you need or it may be a single small stack that will be far less materials than you need.

For revenue options the tldr; is that you should use the `Revenue: based on current home server minimum listing prices` option as you should probably attempt to sell at the current price on your server for the most potential profit. You might get undercut doing this, but thats not an issue if you use our [undercut alerts](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Undercut-Alerts---Alpha-version).

All revenue options include:

- `Revenue: based on current home server minimum listing prices` to assume you can sell for the current listing price on your server. This will be the most profitable option, but with the most competition.
- `Revenue: based on current regional minimum listing prices` this is the most realistic option. When you sell at or below the lowest price in your region this will attract buyers from other server to come to you! You will have far less competition and far more sales. Anything you can profit on while being the cheapest in the whole region is absolutely a good item to craft and sell!
- `Revenue: based on item regional median sale price` this price will also be very realistic. You should pick this if you want to sell at a low price for more sales. This will be higher than the regional minimum price.
- `Revenue: based on item regional regional sale price` pick this if you are attempting to sell at a high price close to or at your servers the minimum listing price. While the home server minimum listing price will be higher than this value, when attempting to sell that high you will probably be undercut a few times driving the price down until you sell closer to the average price.

## Advanced Options

These options will likely go in an `advanced options` drop down when going in the main website. These are very situational.

- `stars` to only search for recipes with this many stars or higher
- `lvl_lower_limit` to filter out low level crafts that may have more crafters and competition
- `lvl_upper_limit` to filter out high level crafts if you are still leveling a job and do not have the max level with all recipes unlocked
- `yields` to only search for recipes that make multiple items per craft (ex: [Tincture of Strength](https://www.garlandtools.org/db/#item/27786))
- `hide_expert_recipes` to hide any expert level crafts that are not guaranteed to craft the desired item (ex: [Water Otter Fountain Lumber](https://www.garlandtools.org/db/#item/37699))

# Search Results Table

After searching you will be given a table of potential crafts to search through.

You can search for items by name with the search bar. You can also sort the list by clicking on any of the columns. You should probably sort by `profitEst` for more gil or `soldPerWeek` for faster sales.

Main Site
![image](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/062ee4e2-2d31-47ef-a9bb-9682f6e12be0)

Alpha Site
<img width="843" alt="image" src="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/9d2898bc-90cd-471b-bc47-8c71bf3bda05">

The full column list is:

- `itemName`: the name
- `hq`: if the prices are for HQ or NQ craft of the item
- `yields`: the number of items made per craft
- `item-data`: [a link to our custom statistics to tell you everything you need to know about how good an item is to sell.](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/How-to-use-Item-Data-Searches-to-help-you-find-good-items-to-trade)
- `universalisLink`: a link to the item on universalis
- `material - current region min listing cost`: the crafting cost assuming you can buy all materials at the current minumum listing price
- `material - median regional cost`: the crafting cost assuming you can buy all materials at the current median regional sale price
- `material - average regional cost`: the crafting cost assuming you can buy all materials at the current average regional sale price
- `revenue - current home server min listing price`: the revenue made if you can sell at your home servers current minumum listing price
- `revenue - current regional min listing price`: the revenue made if you can sell at your home regions current minumum listing price across all servers
- `revenue - regional median sale price`: the revenue made if you can sell at your home regions current median sale price
- `revenue - regional average sale price`: the revenue made if you can sell at your home regions current average sale price
