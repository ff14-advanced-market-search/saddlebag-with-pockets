Our Allagan Data tool will analyze your inventory and items you are selling on the marketboard.

https://saddlebagexchange.com/allagan-data

This tool will do the following:

1. Show you valuable items in your inventory you may have forgotten about
2. Create the json data for our sale alerts
3. Adds a 2nd method of generating json for undercut alerts (we still recommend [the original method](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Undercut-Alerts---Alpha-version) for more [advanced filtering](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/FFXIV-Advanced-Undercut-Alert-Options))
4. Shows you what items are out of date on universalis, that you should update before leaving the marketboard.

Quicklinks:

- [How to use the Allgan Data import](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Allagan-Tools-Inventory-Analysis#how-to-use-the-allgan-data-import)
- [How to use the in bags report](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Allagan-Tools-Inventory-Analysis#in-bags-report)
- [How to update items for "out of date data"](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Allagan-Tools-Inventory-Analysis/#out-of-date-data)
- [How to get json data for sale and undercut alerts](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Allagan-Tools-Inventory-Analysis#sale-and-undercut-alert-json-data)

## How to use the Allgan Data import

1. Make sure you have Dalamund Plugins and Allagan tools installed and that you have the following columns enabled.

![image](https://user-images.githubusercontent.com/17516896/233134089-43ac28d4-a66a-45b1-a82c-73fc504e658f.png)

Make sure source, location, quantity and type are enabled

![image](https://user-images.githubusercontent.com/17516896/235263844-cb4916c5-335e-466e-84bd-04bf112f6bac.png)

2. On the top left menu click > Edit > Copy List Contents > JSON Format

![image](https://github.com/user-attachments/assets/476deec1-ab2d-4d84-b367-7b09a313a9d3)

3. Make sure your server is set in the website settings, go to https://saddlebagexchange.com/allagan-data, then paste in the json data from Allagan Tools and hit search:

![image](https://user-images.githubusercontent.com/17516896/233134974-3bbe02e9-2135-4063-a0e4-e1ada8350121.png)

4. Review the report fields

![image](https://user-images.githubusercontent.com/17516896/233135238-f4cd7412-5ae2-4f6b-97de-faa28c179ee7.png)

## In Bags Report

The in bags report is very simple it shows you the most valuable items sitting in your inventory you may have forgotten about. These are very good items to list on the marketboard:

![image](https://user-images.githubusercontent.com/17516896/233135654-297610a4-ed5f-4840-97f2-bd373f106aa2.png)

## Out of Date Data

When an item shows up in the `Out of date` lists for undercuts or sale alerts, it means that universalis does not see the data we need for our alerts. This could also mean that you are already undercut or have already sold these items.

![image](https://user-images.githubusercontent.com/17516896/233136822-c8b9b4fb-a86e-4dfd-8e40-9f344bc6c5bd.png)

To update this you just need to go to the marketboard (while Dalamund Plugins is running) and view the listings for any items that show up in our lists:

![image](https://user-images.githubusercontent.com/17516896/233136282-47e399f3-db11-4d30-a16e-3e23a62a1d19.png)

To make this easier I recommend adding all items you are selling to your favorites list so you can click through them instead of pasting the names into your marketboard search:

![image](https://user-images.githubusercontent.com/17516896/233137655-d813b06c-a1a5-484b-a449-054b7d5a9eed.png)

After you do this and all items are up to date then the list will be empty and you are ready to use the sale alerts and undercut alerts:

![image](https://user-images.githubusercontent.com/17516896/233136947-d1dea61e-1570-4869-a508-e87a59787b5b.png)

## Sale and Undercut alert json data

If you click the copy to clipboard buttons for the undercut or sale alerts you will get data similar to the following to be used in our discord with slash commands.

Sale alert (use with `/ff sale-register`):

```
{
  "item_ids":[21826,20744,35562,2731,7148,3023,35984,29682,7986,39378,2642,6460,4311,35573,6459,2236,30813,39391],
  "retainer_names":["my retainer","my other retainer","my other other retainer"],
  "server":"Famfrit"
}
```

![image](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/b2496327-c429-400c-aac4-4af712a6be10)

Undercut alert (use with `/ff undercut`):

```
{
    "retainer_names": ["my retainer","my other retainer","my other other retainer"],
    "server": "Lich",
    "add_ids": [],
    "ignore_ids": [],
    "hq_only": false,
    "ignore_data_after_hours": 720,
    "ignore_undercuts_with_quantity_over": 9999
}
```
