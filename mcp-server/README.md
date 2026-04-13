# LogiclemonAI Lead Gen MCP Server

Production-ready B2B lead generation MCP server for AI assistants.

## Tools (8 tools)

| Tool | Description | Price |
|------|-------------|-------|
| `search_companies` | Find companies by industry, location, size | $0.01/call |
| `enrich_company` | Get detailed company info (description, LinkedIn) | $0.02/call |
| `find_contacts` | Find contacts at company by role | $0.03/call |
| `verify_email` | Verify email validity and deliverability | $0.005/call |
| `scrape_company` | Extract data from company websites | $0.02/call |
| `enrich_lead` | Complete lead enrichment in one call | $0.05/call |
| `save_leads_to_sheet` | Export leads to Google Sheets | $0.01/call |
| `get_credits` | Check API usage (free) | Free |

## Setup

```bash
npm install
cp .env.example .env
# Add your API keys to .env
```

## Environment Variables

```env
FIRECRAWL_API_KEY=your_firecrawl_api_key
```

## Usage

```bash
npm start
```

## MCP Client Configuration

Add to Claude Desktop, Cursor, or other MCP clients:

```json
{
  "mcpServers": {
    "logiclemonai-leadgen": {
      "command": "node",
      "args": ["./src/index.js"],
      "env": {
        "FIRECRAWL_API_KEY": "your_key"
      }
    }
  }
}
```

## Example Usage

```
Search for SaaS companies in Austin:
→ search_companies { query: "SaaS software", location: "Austin", limit: 10 }

Enrich a company:
→ enrich_company { domain: "acme.com" }

Find contacts:
→ find_contacts { company_domain: "acme.com", role: "VP Sales" }

Verify email:
→ verify_email { email: "john@acme.com" }

Full lead enrichment:
→ enrich_lead { name: "John", email: "john@acme.com", company_domain: "acme.com" }
```

## Pricing

- **Pay per call**: $0.005 - $0.05 per tool call
- **Monthly plans**: Coming soon
- **Enterprise**: Custom pricing with dedicated support

## License

MIT
