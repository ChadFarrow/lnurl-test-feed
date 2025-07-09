# Project Split Summary

This document explains how the LNURL Playground project was split into two separate repositories.

## Split Overview

The original project contained both feed hosting and development/testing tools. These have been separated into:

1. **Feed Hosting Repository** (current) - Contains only the RSS feeds and minimal hosting files
2. **Development Repository** (`../lnurl-playground-dev`) - Contains all development and testing tools

## Feed Hosting Repository (Current)

**Purpose**: Host RSS feeds for testing Lightning Network payment integration

**Contents**:
- `public/lnurl-test-feed.xml` - Main RSS feed with Lightning payment value blocks
- `README.md` - Documentation for the hosted feed
- `update-feed.sh` - Script to update feed timestamps
- `.gitignore` - Git ignore rules

**Feed URL**: `https://raw.githubusercontent.com/ChadFarrow/lnurl-test-feed/main/public/lnurl-test-feed.xml`

**Key Features**:
- Lightning payment value blocks with multiple addresses and node pubkeys
- Podcast standards compliance (RSS 2.0, iTunes, Podcast Index)
- Value-for-value (V4V) podcasting support
- Test episode for validation

## Development Repository (`../lnurl-playground-dev`)

**Purpose**: Development and testing tools for Lightning Network payment integration

**Contents**:
- `v4v-demo/` - React-based testing application
- `customize-feed.js` - Feed generation script
- `docker-compose.yml` - LNbits and PostgreSQL setup
- `btcpay.conf` - BTCPay Server configuration
- `README.md` - Development documentation

**Key Features**:
- RSS feed parser and validator
- Wallet integration (NWC, direct connections)
- Payment testing (Lightning addresses, node pubkeys)
- Automated testing suite
- Infrastructure setup (LNbits, BTCPay)

## Benefits of the Split

1. **Separation of Concerns**: Feed hosting is separate from development tools
2. **Cleaner Repositories**: Each repo has a single, clear purpose
3. **Easier Maintenance**: Feed updates don't require development dependencies
4. **Better Organization**: Development tools can evolve independently
5. **Focused Documentation**: Each repo has targeted documentation

## Migration Notes

### What Moved to Development Repo
- React app (`v4v-demo/`)
- Feed generation scripts (`customize-feed.js`)
- Docker infrastructure (`docker-compose.yml`)
- BTCPay configuration (`btcpay.conf`)
- All development and testing tools

### What Stayed in Feed Hosting Repo
- RSS feed files (`public/lnurl-test-feed.xml`)
- Feed documentation (`README.md`)
- Feed update script (`update-feed.sh`)
- Git configuration (`.gitignore`)

## Usage

### For Feed Hosting
- Update feed content in `public/lnurl-test-feed.xml`
- Run `./update-feed.sh` to update timestamps
- Commit and push changes

### For Development
- Use the development repository for all testing and development
- Generate new feeds using `customize-feed.js`
- Test with the V4V demo app
- Set up infrastructure with Docker Compose

## Repository URLs

- **Feed Hosting**: `https://github.com/ChadFarrow/lnurl-test-feed`
- **Development**: `https://github.com/ChadFarrow/lnurl-playground-dev`

## Next Steps

1. **Push both repositories** to GitHub
2. **Update documentation** to reference the split
3. **Test feed URLs** to ensure they work correctly
4. **Update any external references** to point to the correct repositories 