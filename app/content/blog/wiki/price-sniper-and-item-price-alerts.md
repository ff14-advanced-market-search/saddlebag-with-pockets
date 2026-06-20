# Price Discount Sniper and Price Spike Alerts

A discord bot that will alert you when prices are low on items you want to buy or when prices are high on items you want to sell! The bot reads through [Universalis crowd sourced data](https://universalis.app/docs/index.html) and will message you with a DM whenever universalis finds items matching your price floor or ceiling.

When sniping for deals this will show you the cheapest price in your region. If you don't know how to travel to other datacenters in your region, [then watch this guide on how to do that.](https://www.youtube.com/watch?v=BwBMwXadUNI&feature=youtu.be)

These alerts require a free trial or the `Patreon Supporter` rank. Either join our [patreon](https://www.patreon.com/indopan) or just join the discord and run the `/free-trial` command to get a free trial of our advanced patreon features.

`We are only using publicly available data. We are **NOT** relying on any in-game data services and these alerts are **TOS compliant**.`

# Alert Example:

<img width="537" alt="image" src="https://user-images.githubusercontent.com/17516896/209980120-ef220ee5-ba0b-4d7d-bab2-d9d341173b85.png">

# Setup

1. Go to our price level alert generator https://saddlebagexchange.com/price-sniper
2. Select the items you want to monitor along with:

- The price you desire for the item.
- Select `above` to be alerted when the marketboard price is above your price on your home server.
- Or pick `below` to be alerted when the marketboard price is below your price region wide.
- If you want to only be alerted on HQ versions or all version of the item.
- Choose the `Quantity` button if you want to be alerted on quantity instead of price.

<img width="710" alt="image" src="https://user-images.githubusercontent.com/17516896/210079936-5a6a6472-b2d6-400a-89c4-2f87258e9a6e.png">
<img width="606" alt="image" src="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/assets/17516896/dbd80afc-1687-4cf0-a27c-8ef2203d6adf">

3. Click add to add this to your json data.

4. When you are done copy your json data to your clipboard. It may look like the following:

```
{
    "home_server": "Famfrit",
    "user_auctions": [
        {"itemID": 4745, "price": 100, "desired_state": "above", "hq": false},
        {"itemID": 4745, "price": 1000, "desired_state": "below", "hq": true},
        {"itemID": 4745, "price": 100, "desired_state": "above", "hq": true},

        {"itemID": 4097, "price": 100, "desired_state": "above", "hq": false},
        {"itemID": 4097, "price": 100, "desired_state": "below", "hq": false},
        {"itemID": 2, "price": 1000, "desired_state": "below", "hq": true},
        {"itemID": 2, "price": 1000, "desired_state": "below", "hq": false},
        {"itemID": 30406, "price": 1000, "desired_state": "below", "hq": false}
    ]
}
```

# Discord Bot Setup

Once you have generated you alert data you can go to the discord and add this to our alert cycle with the following `/ff price` commands same as the undercut alert:

- `/ff price-register` to start alerts
- `/ff price-unregister` to stop the alerts
- `/ff price-update` to update without stopping

For quantity based alerts its the same just swap `price` with `quantity`:

- `/ff quantity-register` to start alerts
- `/ff quantity-unregister` to stop the alerts
- `/ff quantity-update` to update without stopping

<img width="400" alt="image" src="https://user-images.githubusercontent.com/17516896/209980419-8a5b3f48-21a9-4ada-99b2-9ef406dc6114.png">

# Notes

This is still in the alpha phase so there will be some bugs.

It does require the patreon rank which you can obtain [through our patreon](https://www.patreon.com/indopan), by joining the dev team to help us build the site or by requesting a 1 month free trial allowing you access to all discord bot alerting features.
