#!/bin/bash

echo "🚀 LNURL Test Feed Setup"
echo "========================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found"
echo ""

# Get user input
read -p "Enter your GitHub username: " github_username
read -p "Enter your repository name (e.g., lnurl-test-feed): " repo_name
read -p "Enter your email: " email
read -p "Enter your name: " name

echo ""
echo "📝 Lightning Addresses (press Enter to skip):"
read -p "Alby address (e.g., yourname@getalby.com): " alby_address
read -p "Wallet of Satoshi address (e.g., yourname@walletofsatoshi.com): " wos_address
read -p "ln.pizza address (e.g., yourname@ln.pizza): " lnpizza_address

echo ""
echo "🔑 Node Pubkeys (press Enter to skip):"
read -p "Node pubkey for keysend testing: " node_pubkey

echo ""
echo "📋 Updating configuration..."

# Update the config in customize-feed.js
sed -i.bak "s/username: 'yourusername'/username: '$github_username'/g" customize-feed.js
sed -i.bak "s/repoName: 'lnurl-test-feed'/repoName: '$repo_name'/g" customize-feed.js
sed -i.bak "s/email: 'your-email@domain.com'/email: '$email'/g" customize-feed.js
sed -i.bak "s/name: 'Your Name'/name: '$name'/g" customize-feed.js

# Update Lightning addresses
if [ ! -z "$alby_address" ]; then
    sed -i.bak "s/'yourname@getalby.com'/'$alby_address'/g" customize-feed.js
fi

if [ ! -z "$wos_address" ]; then
    sed -i.bak "s/'yourname@walletofsatoshi.com'/'$wos_address'/g" customize-feed.js
fi

if [ ! -z "$lnpizza_address" ]; then
    sed -i.bak "s/'yourname@ln.pizza'/'$lnpizza_address'/g" customize-feed.js
fi

# Update node pubkey
if [ ! -z "$node_pubkey" ]; then
    sed -i.bak "s/'032870511bfa0309bab3ca1832ead69eed848a4abddbc4d50e55bb2157f9525e51'/'$node_pubkey'/g" customize-feed.js
fi

# Generate the feed
echo "🔧 Generating feed..."
node customize-feed.js

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create a new GitHub repository named '$repo_name'"
echo "2. Upload these files to your repository:"
echo "   - feed.xml"
echo "   - README.md"
echo "   - customize-feed.js"
echo "   - GITHUB_HOSTING_GUIDE.md"
echo ""
echo "3. Add required assets:"
echo "   - artwork.jpg (1400x1400px)"
echo "   - host.jpg (300x300px)"
echo "   - episodes/episode-001.mp3 (and others)"
echo "   - images/episode-001.jpg (and others)"
echo ""
echo "4. Your feed URL will be:"
echo "   https://raw.githubusercontent.com/$github_username/$repo_name/main/feed.xml"
echo ""
echo "5. Test the feed and submit to podcastindex.org"
echo ""
echo "🔧 To update the feed later, just run:"
echo "   node customize-feed.js"
echo ""
echo "📖 See GITHUB_HOSTING_GUIDE.md for detailed instructions" 