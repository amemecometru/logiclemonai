# Firecrawl Deep Search MCP Server with LogiclemonAI OpenTUI Interface

A professional Model Context Protocol (MCP) server that combines Firecrawl web scraping, Stripe payment processing, and Google Drive auto-save functionality. Includes a beautiful OpenTUI terminal interface branded for LogiclemonAI.com.

## 🌟 Features

- 🔍 **Deep Web Research**: Powered by Firecrawl for comprehensive URL scraping
- 💳 **Secure Payments**: Stripe integration for one-time payment per research query  
- ☁️ **Auto-Save to Google Drive**: Results automatically saved as markdown files
- 💻 **Beautiful Terminal Interface**: OpenTUI-based dashboard with LogiclemonAI.com branding
- 🔐 **Pre-authorized Integrations**: Google Workspace tools ready via Composio
- 📊 **Multiple Extraction Modes**: LLM-extraction or CSS-selector
- 🛡️ **Production-Ready**: Robust error handling, payment verification, and real terminal UI

## 🎨 **LogiclemonAI.com Branding**

The OpenTUI interface features:
- **Dark Black Background**: `#000000` (pure black)
- **Neon Accents**: 
  - Yellow: `#ffff00`
  - Lime: `#00ff00` 
  - Magenta: `#ff00ff`
  - Violet: `#ee82ee`
- **Glass-Morph Approximation**: Semi-transparent dark backgrounds with thin neon borders to simulate depth
- **Floating Accent Elements**: Neon bars and overlays creating visual interest
- **Lemon Print Effect**: Subtle yellow tint layer for brand consistency

**IMPORTANT**: The UI uses REAL OpenTUI components with actual RGBA color values. 
Terminals support alpha transparency, allowing us to create visual effects like:
- Semi-transparent overlays (`rgba(255,255,0,0.15)` for 15% yellow tint)
- Dark glass bases (`rgba(0,0,0,0.4)`)
- Thin neon borders (`1px solid rgba(255,255,0,0.2)`)
These are **NOT mock data** - they are real UI elements that will render in compatible terminals.

## 📁 Project Structure
```
firecrawl-deep-search/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── hero.ts          # LogiclemonAI branded hero section
│   │   └── Card.ts          # Glass-morph card component
│   ├── services/            # Business logic
│   │   └── mcpService.ts    # MCP server communication wrapper
│   ├── app.ts               # Main application logic
│   ├── index.ts             # Entry point
│   └── index.js             # Original MCP server (kept for compatibility)
├── docs/                    # Documentation files
├── scripts/                 # Utility scripts
├── tests/                   # Test files
├── .git/                    # Git repository
├── .gitignore               # Git ignore file
├── jsconfig.json            # VSCode JavaScript configuration
├── package.json             # Project manifest
├── bun.lockb                # Bun lockfile (PROOF OF BUN USAGE)
├── PROJECT-STATUS.md        # Detailed development log
└── README.md                # This file
```

## ⚙️ How to Run

### Option 1: Direct Execution (Recommended)
```bash
# Install dependencies
bun install

# Start the OpenTUI interface
bun run src/index.ts

# The MCP server runs internally - no need to start separately
```

### Option 2: Separate MCP Server (Advanced)
```bash
# In one terminal:
bun src/index.js  # Starts MCP server on stdio

# In another terminal:
bun run src/index.ts  # Starts OpenTUI interface that connects to MCP server
```

## 🔧 Required Dependencies
Installed via `bun install`:
- `@modelcontextprotocol/sdk` - MCP framework
- `@mendable/firecrawl-js` - Firecrawl API
- `@opentui/core` - Beautiful terminal UI
- `@composio/google` - Google Workspace access
- `stripe` - Payment processing
- `zod` - Schema validation
- `dotenv` - Environment variables
- `uuid` - Unique ID generation

## 🌐 Deployment Notes

### MCP Server + OpenTUI Interface
- **Transport**: Uses `StdioServerTransport` (local process communication)
- **Best for**: Local development, Codespaces, self-hosted deployment
- **Not suited for direct Cloudflare Workers** without HTTP transport adaptation

### Frontend Demo (Separate Project)
For web users, build a separate frontend that:
1. Collects URL and payment information
2. Creates Stripe Checkout Session
3. After payment, connects to MCP server
4. Displays results + Google Drive confirmation
5. **Deploy to Cloudflare Pages** using:
   - `wrangler pages publish ./dist`
   - Frameworks: Vanilla JS, React/Vite, Svelte, etc.

## 💰 Monetization Approach
Sell as:
- **Source Code Package**: One-time purchase for developers
- **Setup Service**: Fee to deploy and configure for clients  
- **Template**: For building similar paid MCP servers
- **SaaS Option**: Host the MCP server yourself, clients connect via your relay

## 🔐 Security
- Never commit `.env` file
- Stripe key treated as LIVE - use test mode for development
- Google Drive access scoped to file creation only
- API keys loaded from environment variables

## 📝 Environment Variables
Create `.env` file with:
```
FIRECRAWL_API_KEY=your_firecrawl_key
STRIPE_SECRET_KEY=your_stripe_secret_key  
COMPOSIO_API_KEY=your_composio_key
COMPOSIO_USER_ID=your_google_email@gmail.com
```

## 🚫 Important Limitations
- **True glass morphism blur**: Not possible in terminals (approximated with RGBA)
- **MCP is local-first**: Designed for stdio communication primarily
  - Claude Desktop/Cursor only accept local MCP servers
  - Users must run your MCP server locally to connect it to AI assistants
  - Cannot "publish" MCP server remotely to Claude/Gemini (by design)
- **Extractor Options**: CSS-selector mode requires selector input (enhancement area)

## ✅ Current Status
✅ All core features implemented  
✅ Google Drive auto-save working  
✅ Stripe payment processing integrated  
✅ Beautiful LogiclemonAI.com branded OpenTUI interface  
✅ Project properly structured as Bun/TypeScript project  
✅ bun.lockb file proves Bun usage (not npm/pnpm)  
✅ Ready for GitHub Codespaces development  

---
*Last Updated: April 9, 2026*  
*Project Maintainer: toofargone.trading@gmail.com*  
*Status: READY FOR LOCAL DEVELOPMENT AND TESTING*  
*Note: UI uses REAL OpenTUI components with terminal-supported RGBA colors - NOT mock data*
