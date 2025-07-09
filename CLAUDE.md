# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

The project uses standard Create React App commands. All commands should be run from the `v4v-demo/` directory:

```bash
cd v4v-demo
npm start     # Development server (http://localhost:3000)
npm test      # Run tests in watch mode
npm run build # Production build
npm run eject # Eject from Create React App (one-way operation)
```

## Project Architecture

This is a React-based Value4Value (V4V) demonstration app that implements podcast micropayments using Lightning Network through Nostr Wallet Connect (NWC).

### Key Components

- **Main App Component** (`src/App.js`): Single-page application handling all functionality
- **RSS Feed Parsing**: Extracts `<podcast:value>` blocks from podcast RSS feeds
- **NWC Integration**: Connects to Lightning wallets via Nostr Wallet Connect protocol
- **Payment Methods**: Supports both keysend (node pubkeys) and Lightning addresses

### Core Dependencies

- `@getalby/sdk`: Alby SDK for NWC wallet connections and Lightning payments
- `react`: React 19.1.0 framework
- Standard Create React App testing utilities

### Key Features

- **RSS Feed Parsing**: Parses podcast RSS feeds to extract value blocks with recipient information
- **Multi-Wallet Testing**: Tests different NWC wallets for keysend support compatibility
- **Payment Methods**: Handles both Lightning node pubkeys (keysend) and Lightning addresses (LNURL)
- **Automated Testing**: Built-in test suite for wallet functionality validation

### Technical Implementation Details

- **Node Pubkey Validation**: 66-character hex strings starting with `02` or `03`
- **Amount Handling**: Converts sats to millisats for Lightning payments
- **CORS Handling**: Uses corsproxy.io for cross-origin RSS feed fetching
- **Error Handling**: Comprehensive error handling for payment failures

### Test Assets

Local test feeds are available in `public/` directory:
- `test-feed.xml`: Contains Lightning addresses for testing
- `test-keysend-feed.xml`: Contains node pubkeys for keysend testing
- `test-nodes.xml`: Additional test node configurations

### Development Notes

- The app is designed as a mobile-first single-page application
- All wallet connections use NWC protocol with connection strings
- Payment testing includes both real Lightning node connections and Lightning addresses
- The codebase includes extensive logging for debugging payment flows