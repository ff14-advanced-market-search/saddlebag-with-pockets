# What is the `Price Group Deltas` Tool?

---

The `Price Group Deltas` all about observing the Delta Δ (aka the changes) in item prices over long periods of time, making it the ultimate long term investment tool! This lets you observe long term trends on markets with multiple items to find what jumps up in price around patch cycles.

The idea is find which items have increased in price around a major patch, new pvp season, raid release or any major update or event. This means it will be an easy way to earn gold/gil by stocking up right before a patch when demand is low and then selling after the patch at much higher prices!

Each data point represents one week of information (aka the weekly part). Depending on the data and game this could compare, prices, market quantity, sales quantity or total gold/gil earned by an item for any specific week.

We support both WoW and FFXIV:

🔗 [WoW Price Group Deltas](https://saddlebagexchange.com/wow/weekly-price-group-delta-recommended) Webpage  
🔗 [WoW Price Group Deltas](https://saddlebagexchange.com/ffxiv/weekly-price-group-delta) Webpage  
📺 [Wow Tutorial Video](https://www.youtube.com/watch?v=3wbwoDQ8Flk&feature=youtu.be)

---

## Table of Contents

- [What is the Price Group Deltas Tool?](#what-is-the-price-group-deltas-tool)
  - [WoW Chart Example](#wow-chart-example)
  - [FFXIV Chart Example](#ffxiv-chart-example)
  - [Data Table Example](#data-table-example)
  - [Price vs Quantity Chart Example](#price-vs-quantity-chart-example)
  - [Data Availability](#data-availability)
- [WoW Instructions](#wow-instructions)
  - [How to Create WoW Searches](#how-to-create-wow-searches)
    - [Date selection](#date-selection)
    - [Creating Price Groups](#creating-price-groups)
    - [Importing and Copying Presets](#importing-and-copying-presets)
  - [WoW Premade Searches](#wow-premade-searches)
  - [How to use the results and charts](#how-to-use-the-results-and-charts)
    - [Charts](#charts)
      - [Chart Filtering Options](#chart-filtering-options)
      - [Chart View Options](#chart-view-options)
    - [Tables](#tables)
    - [Results Request Data](#results-request-data)
- [Conclusion](#conclusion)
  - [FFXIV Guide](#ffxiv-guide)

---

### WoW Chart Example

![image](https://github.com/user-attachments/assets/ca8d18e0-fae7-4509-b2a5-d786a4006b90)

### FFXIV Chart Example

<img width="1088" alt="image" src="https://github.com/user-attachments/assets/6603dd62-a4ba-439e-96cd-93ec1986d9cc" />

### Data Table Example

<img width="1113" alt="image" src="https://github.com/user-attachments/assets/023846ab-657a-430f-ad0c-4ffc3d926ee9" />

### Price vs Quantity Chart Example

<img width="905" alt="image" src="https://github.com/user-attachments/assets/dd2136c7-99fc-4205-bbb5-121fba247576" />

---

### Data Availability

📊 **WoW Data Availability:**

- All stackable commodities from August 2024 onward. Dragonflight stackable commodities from January 2023 onward. This only covers stackable commodities on the NA/EU regions.
- All data is sourced directly from the blizzard AH api.
- For those who live under a rock all stackable commodities exist in one region wide auction house shared by all other realms in your region. This tools does not cover realm specific non stackable items (aka gear, pets, transmog, mounts, etc)
- The Price Value is the **MEDIAN** minimum price observed across the whole week of the date mentioned. This represents the most realistic price the item could have sold for that week. This also means that opportunities did exist in any week to sell at prices even higher than what is listed in the data, such as times right before and after raid nights!
- The quantity Value is the **AVERAGE** quantity of the item over the week. Quantity cannot be as easily manipulated as price and we want to incorporate both highs and lows in quantity for research purposes.
- The TSM data is from the current week and does not represent the exact sale rates or averages prices that occurred at past points in time.

📊 **FFXIV Data Availability:**

- All items from Jan 2023 Onwards for EU, North-America, Japan and Oceania.
- All data is sourced from [Universalis](https://universalis.app/) sales history API.
- The sales data used to create prices are determined from of all sales across all servers in your region. Prices may be higher or lower on your own server.
- We pull up to 2000 individual sales per week across the whole region. Actual sales might have been higher!

---

# WoW Instructions

## How to Create WoW Searches

<img width="618" alt="image" src="https://github.com/user-attachments/assets/3ee5fa82-8f80-4bf6-9cd3-79f679cf6ce8" />

### Date selection

To Create your own search begin by selecting a range of dates you wish to search from. For example if you want to observe patch 11.1 (mid march 2025) you might want to search from January until may to see the full cycle:

📊 **WoW Data Availability:** All stackable commodities from August 2024 onward. Dragonflight stackable commodities from January 2023 onward. This only covers stackable commodities on the NA/EU regions. It does not cover server specific non stackable items (aka gear, pets, transmog, mounts, etc)

<img width="582" alt="image" src="https://github.com/user-attachments/assets/3c85c227-9393-4d5e-8a91-17a93b3a32d6" />

### Creating Price Groups

Once you know the range now its time to select which items to search for! Each collection of items is called a "Price Group", you can add up to 10 groups. You might want to group some items together if they are part of the same market to see if they move together, like Ores in one group, Food in a different group, Cloth in a 3rd, etc.

Begin by giving your group(s) a name:

<img width="624" alt="image" src="https://github.com/user-attachments/assets/70b6ec9e-40a1-4338-b562-1cdac64cfe17" />

Then its time to pick which items go into your groups. You can do this 2 ways:

- By specific item name.
- By search category.

To add an item by its name simply type in the name of the item an it will appear on the list in your group. You can add add many items as you want to each group. Either type in the full exact item name or select it from the dropdown and click it.

<img width="615" alt="image" src="https://github.com/user-attachments/assets/462b8186-8a94-4b58-a748-573fbfaa371b" />

<img width="649" alt="image" src="https://github.com/user-attachments/assets/54365b0c-dab2-4212-bf42-485af4bc1c17" />

Alternatively you can add an entire category of items by clicking the `Add Category` button. You can also add as many categories as you want an filter by:

- Expansion
- Quality / Rank
- Main Category
- Sub Category

<img width="626" alt="image" src="https://github.com/user-attachments/assets/61be8ae5-22a3-41a1-b8e6-16369951fa31" />

<img width="607" alt="image" src="https://github.com/user-attachments/assets/208cb0ec-32fa-4f1d-bdde-be0cc08dc292" />

### Importing and Copying Presets

Each price group search you create is reusable so you can share your searches with others and easily recreate searches you have used before.

As you create groups in the search you will see a section appear at the bottom with some data inside. Hit the copy button to copy this data to your clipboard. This data will also appear at the bottom of the page after you hit search:

<img width="624" alt="image" src="https://github.com/user-attachments/assets/1efefb99-9fc3-42b7-891e-e0dd8b4712d4" />

You can then reuse this data when you start a new search.

Hit the `Import Configuration` button, which opens a popup box. Paste your search data in and then after hitting `Import` it will restore all the items and categories from your past search.

<img width="686" alt="image" src="https://github.com/user-attachments/assets/1fb54e58-c645-45f3-94b3-d0b7d9b45291" />

### WoW Premade Searches

Our team has also created several pre-made searches that show major price shifts in items over various patch cycles and major expansion events including:

- **TWW Trade Goods 11.1**
- **TWW Consumables 11.1**
- **TWW Trade Goods 11.0**
- **TWW Consumables 11.0**
- **Dragonflight Tier 10.2 Trade Goods**
- **Dragonflight Tier 10.2 Consumables**
- **Dragonflight Tier 10.0.7 and 10.1 Trade Goods**
- **Dragonflight Tier 10.0.7 and 10.1 Consumables**

We also have some very specialized searches including:

- **TWW Eng Mount Ore and Parts**: looks at how prices of old materials skyrocketed after the release of the new engineering mount. Causing items that were worthless before the change to become incredibly valuable afterwords such as the [Solid Stone](https://undermine.exchange/#us-area-52/7912) (which jumped from almost being worthless at 0.01G to over 10g!!! at a 5000%+ increase).
- **Whooraas Midnight Expanse Furnishing Components**: We expect similar performance across a much larger section of the legacy economy when more info is released on player housing items so we have a list we will also be updating over time to showcase these changes as well. The list was made by Wooraah himself (well known goblin) and we added it as well. It will be interesting to see how this progresses over time.

<img width="634" alt="image" src="https://github.com/user-attachments/assets/0d53a1d2-838e-4b95-a292-57c9d3a3a4d4" />

---

## How to use the results and charts

The results section is packed with data! This is separated into 3 sections

1. [**Charts**](#charts): which visualize the changing price data.
2. [**Tables**](#tables): which show the raw data and let you download this data in JSON or CSV format
3. [**Request Data**](#results-request-data): section at the bottom that lets you copy the data needed for [Importing and Copying Presets](#importing-and-copying-presets)

### Charts

<img width="1109" alt="image" src="https://github.com/user-attachments/assets/30f7b117-af51-4615-8069-68c5de77e2ee" />

<img width="1106" alt="image" src="https://github.com/user-attachments/assets/5df91308-45c1-4381-8600-39faa86e28a9" />

<img width="1120" alt="image" src="https://github.com/user-attachments/assets/85511267-318f-49a1-98ab-4e2f698f199a" />

These charts show:

- The percentage change of the price from the starting date price (aka the Delta Δ) vs time for each week.
- An overall `All Groups` view which shows you all price group average changes compared to each other.
- An individual view for each price group containing all items in the group compared to each other.
- Many, many different view and filtering options.

#### Chart Filtering Options

All items can be shown or hidden from the chart by clicking on the checkbox next to its name. By default up to 50 items will be shown in the chart. If more than 50 items are in any price group then all lines are unselected except for the overall average Delta Δ for the whole group.

This is controlled from the `Show/Hide Items` panel on the bottom right of the chart:

<img width="310" alt="image" src="https://github.com/user-attachments/assets/9fe94f7a-0fc8-455e-a4c2-1b76f61722d4" />

You can search for any item by name to limit your view.

<img width="332" alt="image" src="https://github.com/user-attachments/assets/48e30637-37a9-4dce-b2d7-8e38444baf25" />

Using the `Filter Items by Price Change %` option you can automatically filter multiple items at once by selecting ranges and hitting apply.

<img width="1042" alt="image" src="https://github.com/user-attachments/assets/a6f779d8-4edd-4345-8a3a-4f60c909ce55" />

Using the `Exclude Outside` filter you can remove extreme prices that go above or below a Delta Δ percent at any point in your dataset.

> Excludes items that go outside the range at any point. EX: Min to -50% and max to 150% will only show items that stay inbetween those values.

<img width="1035" alt="image" src="https://github.com/user-attachments/assets/6b84cec9-d897-48b8-a81b-1d1675e54229" />

Using the `Include Inside` filter you can search specifically for extremes to find items that went above or below a Delta Δ percent at any point in your dataset.

<img width="1039" alt="image" src="https://github.com/user-attachments/assets/c52af3cf-3d63-4744-a179-a5319a4a94b3" />

Pro tip:

Apply `Any/Any` for the `Include Inside` filter to select all items at once.

<img width="300" alt="image" src="https://github.com/user-attachments/assets/c04f1b41-a904-40dc-8f21-74dcfca30adc" />

Apply a tiny range like `1/2` for `Exclude Outside` to de-select all items at once.

<img width="311" alt="image" src="https://github.com/user-attachments/assets/8eff5588-857f-408b-a87f-d05077f3a602" />

#### Chart View Options

You can also change your view of the chart to zoom in or out.

The start and end dates let you zoom in or out of the X-Axis (left to right).

<img width="746" alt="image" src="https://github.com/user-attachments/assets/d40adddf-80cb-4877-9a51-cbd02c1e36ad" />

The `Zoom in Y-Axis Range` lets you zoom in or out of the Y-Axis (top to bottom).

<img width="242" alt="image" src="https://github.com/user-attachments/assets/09223ea0-a93e-4107-a52a-dc8b011ebe6b" />

### Tables

Below the chart is a table that displays data from all the data on items across all dates. You can change the date with the right option to show data from any specific date across the dataset.

<img width="1088" alt="image" src="https://github.com/user-attachments/assets/a45d05d8-1bb3-41c6-b9d8-c58222993aba" />

At the top of the table you have the options to:

- Download the chart with the date you are viewing in CSV form.
- Download data for all charts in a single JSON file.
- Searching for items by name (like in the chart)
- Changing the date to look at data in on other points in time.

The table itself has several columns, all of which can be sorted by clicking on them:

- `Show in Chart` is the same checkbox used in the chart
- `Item Name` is the item name and rank/quality if the item has a rank/quality
- `Price (YEAR-MONTH-DAY)` is the median minimum price of the item across all hours of the week of that contains the day listed in the data.
- `Delta % (YEAR-MONTH-DAY)` is the change of that price vs the original price at the start of the chart.
- `Price V Quantity` is a button that shows a popup chart with the median price and average market quantity for that item at any hour of that week.
- `Links` contain a saddlebag, undermine and wowhead link
- `TSM Avg Price` and `TSM Sales` are the current average price and sales per day of that item on tsm (note this is not the TSM data of the week in question, we dont have that data).
- `Marketshare` = (`TSM Avg Price`) \* (`TSM Sales`), AKA the average gold the item earns each day in revenue.

### Results Request Data

At the very bottom of the page is the `Request Data` section, this contains the same data mentioned in [Importing and Copying Presets](#importing-and-copying-presets) which lets you copy and reuse your search. Its worth noting the data here will not contain categories and will only have raw lists of item ids. This makes it easy to remove specific items when refining the search for reuse.

<img width="1091" alt="image" src="https://github.com/user-attachments/assets/ad5d5c34-cf91-43a3-9f4a-a2f7ce77c137" />

---

# Conclusion

This is an incredibly powerful research tool in the right hands that lets you validate past trends to find markets where you can easily invest millions to billions of gold/gil. However navigating these trends, researching the data and picking items is not for beginners.

Thats why you should join our [Premium Discord Membership](https://discord.com/servers/saddlebag-exchange-973380473281724476) where we do all the hard research work for you using this tool to create a clear guide on the top 10 items guaranteed to go up in price during any patch so you know exactly what to buy and sell.

## FFXIV Guide

The FFXIV version of this is very similar with some minor differences. We will create a separate guide so stay tuned.
