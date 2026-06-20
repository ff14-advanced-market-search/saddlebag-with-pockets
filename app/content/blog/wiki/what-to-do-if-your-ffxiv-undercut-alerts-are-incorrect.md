Undercut alerts and the Universalis data source are crowd-sourced meaning it is \***\*not\*\*** a perfect system. If you are frustrated that undercut alerts are giving false positives either alerting you on items already sold or alerts are not showing all items you are undercut on, then see if the following applies:

1. [Compare Saddlebag data to Universalis](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/What-to-do-if-your-FFXIV-Undercut-Alerts-are-incorrect%3F#1-compare-saddlebag-data-to-universalis)
2. [Check the last updated time on Universalis](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/What-to-do-if-your-FFXIV-Undercut-Alerts-are-incorrect%3F#2-check-the-last-updated-time-on-universalis)
3. [Install Dalamud Plugins manually search for items to update Universalis](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/What-to-do-if-your-FFXIV-Undercut-Alerts-are-incorrect%3F#3-look-up-an-item-ingame-with-dalamud-plugins-to-update-universalis-and-saddlebag)
4. [Have UC alerts ignore data that's too old](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/What-to-do-if-your-FFXIV-Undercut-Alerts-are-incorrect%3F#4-ignore-data-thats-too-old)
5. [Have UC alerts ignore specific items](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/What-to-do-if-your-FFXIV-Undercut-Alerts-are-incorrect%3F#5-ignore-specific-items-with-old-data)

## 1. Compare Saddlebag data to Universalis

- If you getting alerts and are not undercut on your items, proceed to Univeralis to verify their data to be correct. If Universalis is correct and Saddlebag is incorrect let us know via the [#bug-reporting](https://discord.com/channels/973380473281724476/973380528797548544) channel via Discord.

## 2. Check the last updated time on Universalis

- It is common for Universalis to be out of date, as the data is crowdsourced and they only update their market data when players with [Dalamud Plugins](https://goatcorp.github.io/DalamudPlugins/plugins.html) manually search for individual items on the FFXIV Marketboard. Due to our data flowing in from Universalis, Saddlebag's search function works with the current up-to-date information provided. If no one with plugins has searched the Market board recently then this will be shown on the universalis page to tell how out of date their data is:

<img width="628" alt="image" src="https://user-images.githubusercontent.com/17516896/221422709-4589e965-cd9b-4bb4-bc3e-ddb7fad5adc4.png">

## 3. Look up an item ingame with Dalamud Plugins to update Universalis and Saddlebag

- You can help Universalis and Saddlebag to improve your undercut alerts by installing [Dalamud Plugins](https://goatcorp.github.io/DalamudPlugins/plugins.html) to manually search for individual items on the FFXIV Marketboard. You have now updated Universalis yourself and provided current data to Saddlebag!

- We also highly recommend [using a favorites list](https://youtu.be/0FlO4pJSIaI) to make it easier and faster to click through the items you need to update without typing them all in.

## 4. Ignore data that's too old

- If you want to just ignore any data that is too old you can add `ignore_data_after_hours` into your JSON data. Add a value for how old you want the data to be at a maximum.

The example below ignores all data when the last update was over 24 hours ago.

<img width="322" alt="image" src="https://user-images.githubusercontent.com/17516896/222303467-fc7809ff-e797-40b6-9dbc-c947d9e1a217.png">

## 5. Ignore specific items with old data

- If you cannot or do not want to update the data in your game manually you can ignore the false positive items with the "Filter out these items" button on the alert generator:

<img width="1028" alt="image" src="https://user-images.githubusercontent.com/17516896/221423050-ece8fcbf-40b1-4ca7-9212-d538dd9f23d2.png">

<img width="432" alt="image" src="https://user-images.githubusercontent.com/17516896/221423125-507391d7-4a07-4fe8-8275-d4171335f122.png">

This will add the IDs to the `ignore_ids` list. You can also do this manually by finding the item ids of what you wish to ignore and plugging them into the list yourself:

![image](https://user-images.githubusercontent.com/17516896/221423217-d1aa8f5c-c167-4e1b-83b2-46cbf394ad8f.png)

---

# For further unanswered questions feel free to reach out via the #bug-reporting channel via our [Discord](https://discord.com/invite/836C8wDVNq)!
