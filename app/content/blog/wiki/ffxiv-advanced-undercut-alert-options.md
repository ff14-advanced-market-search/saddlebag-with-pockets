You may want your undercut alerts to behave differently than normal to ignore additional items, handle HQ vs NQ differently, handle big stacks differently than your small stacks, ignore certain retainers, etc. Check out the solutions here and see if they solve the problem you have:

- [You want to ignore some items that get undercut too often](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/FFXIV-Advanced-Undercut-Alert-Options#you-want-to-ignore-some-items-that-get-undercut-too-often)
- [You only want to be alerted on specific items](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/FFXIV-Advanced-Undercut-Alert-Options#you-only-want-to-be-alerted-on-specific-items)
- [You want to set up alerts for multiple servers](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/FFXIV-Advanced-Undercut-Alert-Options#you-want-to-set-up-alerts-for-multiple-servers)
- [You only want to be alerted on HQ undercuts for some items](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/FFXIV-Advanced-Undercut-Alert-Options#you-only-want-to-be-alerted-on-hq-undercuts-for-some-items)
- [I want to ignore annoying retainers](https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/FFXIV-Advanced-Undercut-Alert-Options#i-want-to-ignore-annoying-retainers)

# You want to ignore some items that get undercut too often

When you deal with constant undercutters on items like crafted gear the alerts can get annoying. You can choose to not be alerted on those at all by ignoring them.

1. On the undercut screen click `Filter out these items`

![image](https://user-images.githubusercontent.com/17516896/228265500-90b11641-5466-4bb7-85d3-25d4d8996a04.png)

2. Search for each item you want to ignore by name and select them from the dropdown

![image](https://user-images.githubusercontent.com/17516896/228261531-7e4bbbce-6459-4b55-91ae-23f164e0f338.png)

3. You will then see the item ids show up under the `ignore_ids` section of the json and you will no longer be alerted on those items

![image](https://user-images.githubusercontent.com/17516896/228261592-accd6582-5891-4e97-8cea-12bbdc5dc246.png)

# You only want to be alerted on specific items

1. Under `I want to be alerted on these items` click the `Selected Items` option:

![image](https://user-images.githubusercontent.com/17516896/228265393-b76caf3d-0770-412d-8c48-52a33d2474a6.png)

2. Add the names of the specific items you want to be alerted on

<img width="425" alt="image" src="https://user-images.githubusercontent.com/17516896/228265983-5bd8cfe2-5758-4992-8380-c249bd819d81.png">

You will now see the item ids show up in the `add_ids` section:

<img width="327" alt="image" src="https://user-images.githubusercontent.com/17516896/228266157-00b74dc8-076a-4fc4-8298-68f878c790a4.png">

# You want to set up alerts for multiple servers

If you are a `Fancy Patreon` or higher you can get alerts for multiple servers.

1. use the [undercut alert info generator](https://saddlebagexchange.com/undercut) for each server you sell on.
2. After just add all of your json blobs into the list. Note that you will have one `seller_id` for all retainers across all characters in that entire server:

```
[
    {
        "seller_id": "myfirstid",
        "server": "Famfrit",
        "add_ids": [],
        "ignore_ids": [],
        "hq_only": false,
        "ignore_data_after_hours": 720
    },
    {
        "seller_id": "mysecondid",
        "server": "Moogle",
        "add_ids": [],
        "ignore_ids": [],
        "hq_only": false,
        "ignore_data_after_hours": 720
    }
]
```

# You only want to be alerted on HQ undercuts for some items

We know that for some items being undercut on an NQ item does not matter when you are selling an HQ item.

The workaround is to use the `Selected Sales` option and make a list of all the HQ items you care about. Also check the `HQ only` box.

<img width="600" alt="image" src="https://user-images.githubusercontent.com/17516896/227581130-f30e3d13-be91-49f8-a97c-fdadcc0ff0d6.png">

This will give you the list of item ids for those HQ only items. Next do the following:

1. Put that list in `ignore_ids` for the undercut json that has `"hq_only": false,`
2. And then leave them in the `add_ids` for the `"hq_only": true,` one with `"ignore_ids": [-1],`
3. Put them both in a list like this

Then it will only alert on those specific item when its an hq undercut and all the rest of your items will alert on any undercut

```
[
    {
      "seller_id": "adfamyselleridadsfa",
      "server": "Goblin",
      "add_ids": [],
      "ignore_ids": [37840,37842,37843,37844,37841,38929,38930,38261,38263,38264,38265,38266,38267,38268,37282,38270,38269],
      "hq_only": false,
      "ignore_data_after_hours": 24
    },
    {
      "seller_id": "adfamyselleridadsfa",
      "server": "Goblin",
      "add_ids": [37840,37842,37843,37844,37841,38929,38930,38261,38263,38264,38265,38266,38267,38268,37282,38270,38269],
      "ignore_ids": [-1],
      "hq_only": true,
      "ignore_data_after_hours": 24
    }
]
```

# I want to ignore annoying retainers

For high competition items you may want to ignore that retainer to limit alerts or ignore someone elses retainer if they keep undercutting you and you are sick of it.

All you have to do is add the `"ignore_retainers"` list and then add the names of all retainers you hate in there:

```
{
      "seller_id": "adfasdfasdfasdfa",
      "server": "Zodiark",
      "add_ids": [],
      "ignore_ids": [],
      "hq_only": false,
      "ignore_data_after_hours": 720,
      "ignore_undercuts_with_quantity_over": 9999,
      "ignore_retainers": ["Myannoyingretainer", "Anotherannoyingone"]
}
```
