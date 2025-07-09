#!/bin/bash

# Update feed timestamps
echo "Updating feed timestamps..."

# Get current date in RSS format
CURRENT_DATE=$(date -u +"%a, %d %b %Y %H:%M:%S GMT")

# Update the feed file with current timestamps
sed -i.bak "s/<pubDate>.*<\/pubDate>/<pubDate>$CURRENT_DATE<\/pubDate>/g" public/lnurl-test-feed.xml
sed -i.bak "s/<lastBuildDate>.*<\/lastBuildDate>/<lastBuildDate>$CURRENT_DATE<\/lastBuildDate>/g" public/lnurl-test-feed.xml

# Remove backup files
rm -f public/lnurl-test-feed.xml.bak

echo "Feed updated with current timestamps: $CURRENT_DATE"
echo "Feed URL: https://raw.githubusercontent.com/ChadFarrow/lnurl-test-feed/main/public/lnurl-test-feed.xml" 