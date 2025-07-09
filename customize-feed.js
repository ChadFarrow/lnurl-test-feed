#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration object - customize these values
const config = {
  // Your personal information
  username: 'ChadFarrow',
  repoName: 'lnurl-test-feed',
  email: 'chad.farrow@gmail.com',
  name: 'Chad',
  
  // Lightning addresses to test
  lightningAddresses: [
    'chadf@getalby.com',
    'chadf@btcpay.podtards.com',
    'eagerheron90@zeusnuts.com',
    'cobaltfly1@primal.net'
  ],
  
  // Node pubkeys for keysend testing (optional)
  nodePubkeys: [
    '032870511bfa0309bab3ca1832ead69eed848a4abddbc4d50e55bb2157f9525e51'
  ],
  
  // Feed configuration
  feedTitle: 'LNURL Testing Podcast',
  feedDescription: 'A test podcast for LNURL payment integration and Lightning Network testing.',
  feedGuid: 'lnurl-test-feed-2024-02-05',
  
  // Episode configuration
  episodes: [
    {
      title: 'LNURL Testing Episode',
      description: 'A test episode for LNURL payment integration across different Lightning wallets and services. This episode demonstrates value-for-value monetization using Lightning payments with multiple LNURL addresses.',
      guid: 'lnurl-test-001-2024-02-05',
      suggestedAmount: 1000
    }
  ]
};

// Generate the RSS feed content
function generateFeed() {
  const currentDate = new Date().toUTCString();
  const githubBaseUrl = `https://raw.githubusercontent.com/${config.username}/${config.repoName}/main`;
  const githubRepoUrl = `https://github.com/${config.username}/${config.repoName}`;
  
  // Use a static UUIDv5 for podcast:guid (replace with a real UUIDv5 if needed)
  const podcastGuid = 'b7e6a1e2-7e2b-5c2e-8e2b-7e2b5c2e8e2b';
  
  // Generate value recipients with even splits
  const valueRecipients = [];
  
  // Calculate even splits for Lightning addresses
  const totalLightningAddresses = config.lightningAddresses.length;
  const totalNodePubkeys = config.nodePubkeys.length;
  const totalRecipients = totalLightningAddresses + totalNodePubkeys;
  const evenSplit = Math.floor(100 / totalRecipients);
  
  // Add Lightning addresses with even splits and type="wallet"
  config.lightningAddresses.forEach((address, index) => {
    const name = config.lightningNames && config.lightningNames[index] ? config.lightningNames[index] : `Wallet ${index + 1}`;
    valueRecipients.push(`      <podcast:valueRecipient name="${name}" type="wallet" address="${address}" split="${evenSplit}" />`);
  });
  
  // Add node pubkeys with even splits
  config.nodePubkeys.forEach((pubkey, index) => {
    const name = `Node ${index + 1}`;
    valueRecipients.push(`      <podcast:valueRecipient name="${name}" type="node" address="${pubkey}" split="${evenSplit}" />`);
  });
  
  // Generate episodes
  const episodes = config.episodes.map((episode, index) => {
    const episodeNumber = index + 1;
    const episodeDate = new Date(Date.now() + (index * 7 * 24 * 60 * 60 * 1000)).toUTCString();
    
    return `    <!-- Episode ${episodeNumber}: ${episode.title.split(':')[1]?.trim() || episode.title} -->
    <item>
      <title>${episode.title}</title>
      <description>${episode.description}</description>
      <pubDate>${episodeDate}</pubDate>
      <guid isPermaLink="false">${episode.guid}</guid>
      <podcast:transcript url="${githubBaseUrl}/transcripts/episode-${episodeNumber.toString().padStart(3, '0')}.srt" type="text/plain" />
      <itunes:image href="${githubBaseUrl}/images/episode-${episodeNumber.toString().padStart(3, '0')}.jpg" />
      <enclosure url="${githubBaseUrl}/episodes/episode-${episodeNumber.toString().padStart(3, '0')}.mp3" length="15000000" type="audio/mpeg"/>
      <itunes:duration>00:25:00</itunes:duration>
      <podcast:episode>${episodeNumber}</podcast:episode>
      <podcast:person href="${githubRepoUrl}" img="${githubBaseUrl}/host.jpg" group="hosts" role="host">${config.name}</podcast:person>
      
      <!-- Episode-specific value block -->
      <podcast:value type="lightning" method="lnaddress" suggested="${episode.suggestedAmount}">
${valueRecipients.join('\n')}
      </podcast:value>
    </item>`;
  }).join('\n\n');
  
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:podcast="https://podcastindex.org/namespace/1.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
  <channel>
    <title>${config.feedTitle}</title>
    <itunes:author>${config.name}</itunes:author>
    <description>${config.feedDescription}</description>
    <link>${githubRepoUrl}</link>
    <language>en</language>
    <generator>LNURL Test Feed v1.0</generator>
    <pubDate>${currentDate}</pubDate>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <podcast:locked owner="${config.email}">no</podcast:locked>
    <podcast:guid>${podcastGuid}</podcast:guid>
    <itunes:category text="Technology" />
    <itunes:category text="Education" />
    <podcast:location>GitHub</podcast:location>
    <managingEditor>${config.email}</managingEditor>
    <webMaster>${config.email}</webMaster>
    <image>
      <url>${githubBaseUrl}/artwork.jpg</url>
      <title>${config.feedTitle}</title>
      <link>${githubRepoUrl}</link>
      <description>${config.feedTitle} artwork</description>
    </image>
    <podcast:medium>podcast</podcast:medium>
    <podcast:person href="${githubRepoUrl}" img="${githubBaseUrl}/host.jpg" group="hosts" role="host">${config.name}</podcast:person>
    
    <!-- Value Block for Lightning Payments -->
    <podcast:value type="lightning" method="lnaddress" suggested="1000">
${valueRecipients.join('\n')}
    </podcast:value>
    
${episodes}
  </channel>
</rss>`;

  return feed;
}

// Generate README content
function generateReadme() {
  const githubBaseUrl = `https://raw.githubusercontent.com/${config.username}/${config.repoName}/main`;
  const githubRepoUrl = `https://github.com/${config.username}/${config.repoName}`;
  
  return `# ${config.feedTitle}

${config.feedDescription}

## Feed URL
${githubBaseUrl}/feed.xml

## Episodes
${config.episodes.map((episode, index) => `- ${episode.title}`).join('\n')}

## Testing
This feed is designed for testing LNURL payments in podcast apps. Each episode has value blocks that support Lightning payments.

## Value Blocks
The feed includes value blocks with the following recipients:

### Lightning Addresses
${config.lightningAddresses.map(address => `- ${address}`).join('\n')}

${config.nodePubkeys.length > 0 ? `### Node Pubkeys (Keysend)
${config.nodePubkeys.map(pubkey => `- ${pubkey}`).join('\n')}` : ''}

## Setup
1. Clone this repository
2. Customize the \`config\` object in \`customize-feed.js\`
3. Run \`node customize-feed.js\` to generate updated feed
4. Commit and push changes

## Testing Apps
- **Fountain**: Add feed URL to test Lightning payments
- **Breez**: Test LNURL integration
- **Podverse**: Check value block parsing
- **Castamatic**: Test Lightning address support

## Customization
Edit the \`config\` object in \`customize-feed.js\` to:
- Change Lightning addresses
- Add/remove node pubkeys
- Modify episode content
- Update personal information

Then run \`node customize-feed.js\` to regenerate the feed.
`;
}

// Main execution
function main() {
  console.log('🔧 Generating LNURL Test Feed...\n');
  
  // Generate feed content
  const feedContent = generateFeed();
  const readmeContent = generateReadme();
  
  // Write files
  fs.writeFileSync('feed.xml', feedContent);
  fs.writeFileSync('README.md', readmeContent);
  
  console.log('✅ Generated files:');
  console.log('  - feed.xml (main RSS feed)');
  console.log('  - README.md (documentation)');
  console.log('\n📋 Next steps:');
  console.log('  1. Review and customize the config object above');
  console.log('  2. Add required assets (artwork.jpg, host.jpg, etc.)');
  console.log('  3. Create GitHub repository and upload files');
  console.log('  4. Test feed URL: https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/feed.xml');
  console.log('  5. Submit to podcastindex.org');
  console.log('\n🔗 Your feed URL will be:');
  console.log(`   https://raw.githubusercontent.com/${config.username}/${config.repoName}/main/feed.xml`);
  
  // Show current configuration
  console.log('\n📝 Current Configuration:');
  console.log(`  Username: ${config.username}`);
  console.log(`  Repository: ${config.repoName}`);
  console.log(`  Email: ${config.email}`);
  console.log(`  Name: ${config.name}`);
  console.log(`  Lightning Addresses: ${config.lightningAddresses.length}`);
  console.log(`  Node Pubkeys: ${config.nodePubkeys.length}`);
  console.log(`  Episodes: ${config.episodes.length}`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateFeed, generateReadme, config }; 