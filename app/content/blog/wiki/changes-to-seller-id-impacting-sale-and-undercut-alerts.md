Universalis has changed its listings data and removed the `seller_id` values. So we have reworked the undercut and sale alerts to use retainer names instead. You can use the [allagan-data tool](https://saddlebagexchange.com/allagan-data) to generate new undercut and sales data for yourself that will find all your retainers.

If you have self maintained undercut or sales data just replace the `seller_id` field with a new one called `retainer_names` in this list all of your retainer names.

**sale alert example**

old data:

```
{
    "seller_id": "alksdhf09878aiusdhfiuahusdludfiha",
    "server": "Lich",
    "item_ids": [2,5,6,8]
}
```

new data:

```
{
    "retainer_names": ["my retainer","my other retainer","my other other retainer"],
    "server": "Lich",
    "item_ids": [2,5,6,8]
}
```

**undercut example**

old data:

```
{
    "seller_id": "alksdhf09878aiusdhfiuahusdludfiha",
    "server": "Lich",
    "add_ids": [],
    "ignore_ids": [],
    "hq_only": false,
    "ignore_data_after_hours": 720,
    "ignore_undercuts_with_quantity_over": 9999
}
```

new data:

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
