# LogiclemonAI

AI Agency website and services platform.

## Services

- **AI Development** - Custom models, fine-tuning, integration
- **MCP Servers** - Lead gen, automations, tool integrations
- **AI Assistants** - Chatbots, customer service, sales bots
- **AI Consulting** - Strategy, implementation, audit

## Project Structure

```
logiclemonai/
├── landing/           # React + TypeScript landing page
├── mcp/               # MCP server (Firecrawl, Stripe, Google Drive)
└── .env               # Environment variables
```

## Landing Page

```bash
cd landing
npm install
npm run dev
npm run build
```

## MCP Server

```bash
cd mcp
bun install
bun run dev
```

### MCP Tools
- **Firecrawl** - Web scraping, crawling, deep research
- **Stripe** - Payment processing
- **Google Drive** - Auto-save research results

## Deployment

Tunnel ID configured in `.env` for Cloudflare deployment.

**Live Site:** https://www.logiclemonai.com
