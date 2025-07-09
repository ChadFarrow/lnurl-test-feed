# RSS Feed Creation Guide for Value for Value Testing

This guide will help you create real RSS feeds with value blocks to test your Lightning payment app.

## Quick Start - Use the Pre-made Feeds

I've created several test feeds for you in the `public/` directory:

### Basic Test Feeds
1. **`real-test-feed.xml`** - Mixed feed with both node pubkeys and Lightning addresses
2. **`lightning-address-feed.xml`** - Uses only Lightning addresses (easier for testing)
3. **`node-only-feed.xml`** - Uses only Lightning node pubkeys (for keysend testing)

### Real Podcast Feeds (Based on de-mu Template)
4. **`real-podcast-feed.xml`** - Complete podcast feed that works with real podcast apps
5. **`customizable-podcast-feed.xml`** - Template you can customize for your own podcast

To test these feeds in your app:
- Use URL: `http://localhost:3000/real-test-feed.xml`
- Use URL: `http://localhost:3000/lightning-address-feed.xml`
- Use URL: `http://localhost:3000/node-only-feed.xml`
- Use URL: `http://localhost:3000/real-podcast-feed.xml`
- Use URL: `http://localhost:3000/customizable-podcast-feed.xml`

## Creating Your Own RSS Feed

### Basic Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:podcast="https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md">
  <channel>
    <title>Your Podcast Title</title>
    <description>Your podcast description</description>
    <link>https://yourwebsite.com</link>
    <language>en</language>
    
    <!-- Value Block - This is what your app looks for -->
    <podcast:value type="lightning" method="split" suggested="1000">
      <podcast:valueRecipient name="Host" type="node" address="YOUR_NODE_PUBKEY" split="70" />
      <podcast:valueRecipient name="Producer" type="lightning" address="yourname@getalby.com" split="30" />
    </podcast:value>
    
    <!-- Podcast Episodes -->
    <item>
      <title>Episode Title</title>
      <description>Episode description</description>
      <pubDate>Mon, 01 Jan 2024 12:00:00 GMT</pubDate>
      <guid>https://yourwebsite.com/episode1</guid>
    </item>
  </channel>
</rss>
```

### Value Block Components

The `<podcast:value>` block has these attributes:
- `type="lightning"` - Always use this for Lightning payments
- `method="split"` - Distributes payments among recipients
- `suggested="1000"` - Suggested payment amount in sats

Each `<podcast:valueRecipient>` has:
- `name` - Human-readable name
- `type` - Either "node" (for keysend) or "lightning" (for Lightning addresses)
- `address` - Node pubkey or Lightning address
- `split` - Percentage of the payment (should total 100)

### Getting Real Lightning Addresses

1. **Get a Lightning Address:**
   - Sign up at [getalby.com](https://getalby.com) - you get `yourname@getalby.com`
   - Or use [Wallet of Satoshi](https://walletofsatoshi.com) - you get `yourname@walletofsatoshi.com`
   - Or use [ln.pizza](https://ln.pizza) - you get `yourname@ln.pizza`

2. **Get a Lightning Node Pubkey:**
   - If you run your own Lightning node, use your node's pubkey
   - Or use known working pubkeys for testing (see the feeds I created)

### Testing Your Feed

1. **Save your RSS file** in the `public/` directory of your React app
2. **Start your React app** with `npm start`
3. **Test the feed** by entering `http://localhost:3000/your-feed.xml` in your app
4. **Connect a wallet** and try sending payments

### Example: Your Personal Feed

Here's a template for your own feed:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:podcast="https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md">
  <channel>
    <title>My Lightning Podcast</title>
    <description>A podcast about Lightning Network and Bitcoin</description>
    <link>https://mypodcast.com</link>
    <language>en</language>
    <podcast:value type="lightning" method="split" suggested="500">
      <podcast:valueRecipient name="Me" type="lightning" address="yourname@getalby.com" split="100" />
    </podcast:value>
    <item>
      <title>My First Episode</title>
      <description>This is my first podcast episode with Lightning payments!</description>
      <pubDate>Mon, 05 Feb 2024 12:00:00 GMT</pubDate>
      <guid>https://mypodcast.com/episode1</guid>
    </item>
  </channel>
</rss>
```

### Publishing Your Feed

To make your feed accessible to others:

1. **Host it on a web server** (GitHub Pages, Netlify, Vercel, etc.)
2. **Use the public URL** in your app instead of localhost
3. **Share the RSS URL** with others to test

### Troubleshooting

- **Make sure the XML is valid** - use an XML validator
- **Check the namespace** - the `xmlns:podcast` attribute is required
- **Verify addresses** - Lightning addresses should be in format `name@domain.com`
- **Check node pubkeys** - Should be 66 characters starting with 02 or 03

### Real Podcast Feeds to Test

You can also test with real podcast feeds that have value blocks:
- [Stephan Livera's Podcast](https://stephanlivera.com/feed/)
- [Bitcoin Rapid-Fire](https://anchor.fm/s/1c1c1c1c/podcast/rss)

### Using with Real Podcast Apps

The `real-podcast-feed.xml` and `customizable-podcast-feed.xml` are designed to work with real podcast apps like:
- Apple Podcasts
- Spotify
- Google Podcasts
- Pocket Casts
- Overcast
- Castro

To use with real podcast apps:
1. **Host your feed** on a public web server (GitHub Pages, Netlify, Vercel, etc.)
2. **Submit the RSS URL** to podcast directories
3. **Listeners can subscribe** and your app will still be able to parse the value blocks

### Customizing the de-mu Template

The `customizable-podcast-feed.xml` is based on the [de-mu feed template](https://github.com/de-mu/demu-feed-template) and includes:
- Full podcast metadata (iTunes, Podcast Index standards)
- Episode-specific value blocks
- Transcript support
- Person tags for contributors
- Proper GUIDs and dates

Replace the placeholder values (YOUR_NAME, yourname@getalby.com, etc.) with your actual information.

These will help you test with real-world scenarios! 