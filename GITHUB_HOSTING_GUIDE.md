# GitHub Hosting Guide for LNURL Test Feed

This guide will help you host your LNURL test feed on GitHub and submit it to podcastindex.org for testing in various podcast apps.

## Step 1: Create a New GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it something like `lnurl-test-feed` or `lightning-podcast-test`
3. Make it public (required for podcastindex.org)
4. Don't initialize with README (we'll add files manually)

## Step 2: Set Up Your Feed Files

### 1. Create the main feed file
- Copy `lnurl-test-feed.xml` to your repository
- Rename it to `feed.xml` (this will be your main feed URL)
- Customize the following fields:

```xml
<!-- Replace these with your actual information -->
<link>https://github.com/YOUR_USERNAME/YOUR_REPO_NAME</link>
<podcast:locked owner="your-email@domain.com">no</podcast:locked>
<podcast:guid>your-unique-guid-2024</podcast:guid>
<managingEditor>your-email@domain.com</managingEditor>
<webMaster>your-email@domain.com</webMaster>
<image>
  <url>https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO_NAME/main/artwork.jpg</url>
  <link>https://github.com/YOUR_USERNAME/YOUR_REPO_NAME</link>
</image>
<podcast:person href="https://github.com/YOUR_USERNAME" img="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO_NAME/main/host.jpg" group="hosting" role="host">Your Name</podcast:person>

<!-- Update your Lightning address -->
<podcast:valueRecipient name="Host" type="lightning" address="yourname@getalby.com" split="100" />
```

### 2. Add required assets
Create these files in your repository:
- `artwork.jpg` - Podcast artwork (1400x1400px recommended)
- `host.jpg` - Your profile picture (300x300px recommended)
- `episode-001.jpg`, `episode-002.jpg`, `episode-003.jpg` - Episode artwork
- `episodes/episode-001.mp3`, etc. - Audio files (or placeholder files)
- `transcripts/episode-001.srt`, etc. - Transcript files (optional)

### 3. Create a README.md
```markdown
# LNURL Testing Podcast

A test podcast for LNURL payment integration and Lightning Network testing.

## Feed URL
https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO_NAME/main/feed.xml

## Episodes
- Episode 1: Introduction to LNURL
- Episode 2: LNURL-pay Implementation  
- Episode 3: Testing Different Wallets

## Testing
This feed is designed for testing LNURL payments in podcast apps. Each episode has value blocks that support Lightning payments.

## Value Blocks
The feed includes value blocks with Lightning addresses for testing payment integration.
```

## Step 3: Test Your Feed

### 1. Validate the feed
Use the FeedValidator component in your React app:
- URL: `http://localhost:3000/lnurl-test-feed.xml`
- Or use online validators like [RSS Validator](https://validator.w3.org/feed/)

### 2. Test in podcast apps
- **Fountain**: Add your feed URL to test Lightning payments
- **Breez**: Test LNURL integration
- **Podverse**: Check value block parsing
- **Castamatic**: Test Lightning address support

## Step 4: Submit to Podcast Index

1. Go to [Podcast Index](https://podcastindex.org)
2. Click "Add Podcast"
3. Enter your feed URL: `https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO_NAME/main/feed.xml`
4. Fill in the required information
5. Submit for review

## Step 5: Test Different Wallets

### Lightning Addresses to Test
You can easily update the feed to test different wallets:

```xml
<!-- Alby -->
<podcast:valueRecipient name="Host" type="lightning" address="yourname@getalby.com" split="100" />

<!-- Wallet of Satoshi -->
<podcast:valueRecipient name="Host" type="lightning" address="yourname@walletofsatoshi.com" split="100" />

<!-- ln.pizza -->
<podcast:valueRecipient name="Host" type="lightning" address="yourname@ln.pizza" split="100" />

<!-- Multiple recipients -->
<podcast:value type="lightning" method="split" suggested="1000">
  <podcast:valueRecipient name="Host" type="lightning" address="yourname@getalby.com" split="70" />
  <podcast:valueRecipient name="Producer" type="lightning" address="producer@walletofsatoshi.com" split="30" />
</podcast:value>
```

### Node Pubkeys for Keysend Testing
```xml
<!-- Keysend to Lightning node -->
<podcast:valueRecipient name="Host" type="node" address="YOUR_NODE_PUBKEY" split="100" />
```

## Step 6: Update and Iterate

### Easy Updates
1. Edit `feed.xml` in GitHub
2. Commit changes
3. Feed updates automatically (no need to resubmit to Podcast Index)

### Add New Episodes
1. Add new `<item>` elements to your feed
2. Update `lastBuildDate` to current date
3. Commit and push

### Test Different Configurations
- Single recipient vs multiple recipients
- Different suggested amounts
- Mix of Lightning addresses and node pubkeys
- Episode-specific value blocks

## Troubleshooting

### Common Issues
1. **Feed not found**: Check the raw GitHub URL format
2. **Images not loading**: Ensure raw.githubusercontent.com URLs
3. **Value blocks not parsing**: Check podcast namespace
4. **Podcast Index rejection**: Verify feed is public and accessible

### Validation Checklist
- [ ] Feed URL is accessible
- [ ] XML is valid
- [ ] Required elements present (title, description, link)
- [ ] Podcast namespace included
- [ ] Value blocks properly formatted
- [ ] Images hosted on raw.githubusercontent.com
- [ ] Repository is public

## Example Repository Structure
```
your-repo/
├── feed.xml
├── README.md
├── artwork.jpg
├── host.jpg
├── episodes/
│   ├── episode-001.mp3
│   ├── episode-002.mp3
│   └── episode-003.mp3
├── transcripts/
│   ├── episode-001.srt
│   ├── episode-002.srt
│   └── episode-003.srt
└── images/
    ├── episode-001.jpg
    ├── episode-002.jpg
    └── episode-003.jpg
```

## Next Steps

1. **Create your GitHub repository**
2. **Customize the feed with your information**
3. **Add placeholder audio files** (or real episodes)
4. **Test the feed locally**
5. **Submit to Podcast Index**
6. **Test in various podcast apps**
7. **Iterate and improve based on testing results**

This setup gives you a flexible, easily-updatable test feed that you can use to test LNURL integration across different podcast apps and wallets! 