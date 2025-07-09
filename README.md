# LNURL Test Feed

This repository hosts RSS feeds for testing Lightning Network payment integration in podcast apps and value-for-value (V4V) podcasting.

## Feed URL

**Main Test Feed:**
```
https://raw.githubusercontent.com/ChadFarrow/lnurl-test-feed/main/public/lnurl-test-feed.xml
```

## What This Feed Contains

This RSS feed includes:

- **Lightning Payment Value Blocks**: Multiple Lightning addresses and node pubkeys for testing
- **Test Episode**: A sample episode with Lightning payment integration
- **Podcast Standards**: Full RSS 2.0 with iTunes and Podcast Index namespaces
- **Value-for-Value Support**: Complete V4V podcasting implementation

## Lightning Addresses in This Feed

- `chadf@getalby.com` (Alby)
- `chadf@strike.me` (Strike)
- `chadf@btcpay.podtards.com` (BTCPay)
- `eagerheron90@zeusnuts.com` (Zeus Cashu)
- `cobaltfly1@primal.net` (Primal)

## Lightning Node Pubkeys

- `032870511bfa0309bab3ca1832ead69eed848a4abddbc4d50e55bb2157f9525e51` (My Node)
- `03ecb3ee55ba6324d40bea174de096dc9134cb35d990235723b37ae9b5c49f4f53` (The Wolf)
- `03ae9f91a0cb8ff43840e3c322c4c61f019d8c1c3cea15a25cfc425ac605e61a4a` (Podcast Index)

## How to Use This Feed

### For Podcast App Developers

1. **Add the feed URL** to your podcast app
2. **Parse the value blocks** to extract Lightning payment information
3. **Test payment flows** with the included Lightning addresses and node pubkeys
4. **Validate your implementation** against this known working feed

### For Lightning Wallet Developers

1. **Test LNURL integration** with the Lightning addresses
2. **Test keysend payments** with the node pubkeys
3. **Verify payment parsing** from RSS feed value blocks
4. **Test split payments** across multiple recipients

### For Content Creators

1. **Study the feed structure** to understand V4V podcasting
2. **Use as a template** for your own Lightning-enabled podcast
3. **Test with real podcast apps** to see how Lightning payments work

## Testing Apps

This feed has been tested with:
- **Fountain**: Lightning-native podcast app
- **Breez**: Lightning wallet with podcast support
- **Podverse**: Open-source podcast app
- **Castamatic**: iOS podcast app with Lightning support

## Feed Structure

The feed follows the Podcast Index namespace standard for value blocks:

```xml
<podcast:value type="lightning" method="lnaddress" suggested="1">
  <podcast:valueRecipient name="Alby" type="lnaddress" address="chadf@getalby.com" split="15" />
  <podcast:valueRecipient name="My Node" type="node" address="032870511bfa0309bab3ca1832ead69eed848a4abddbc4d50e55bb2157f9525e51" split="15" />
</podcast:value>
```

## Development

The development and testing tools for this feed are in a separate repository:
https://github.com/ChadFarrow/lnurl-playground-dev

## Feed Creation

This feed was created using the [Demu Feed Template](https://github.com/de-mu/demu-feed-template) and follows the standards from [podcasting2.org/podcasters](https://podcasting2.org/podcasters).

## Contributing

To contribute to this feed:
1. Fork this repository
2. Make your changes to the XML files
3. Test with podcast apps
4. Submit a pull request

## License

This feed is open source and available for testing and development purposes.

## Related Resources

- [Demu Feed Template - https://github.com/de-mu/demu-feed-template](https://github.com/de-mu/demu-feed-template)
