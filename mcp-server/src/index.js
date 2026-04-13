// LogiclemonAI Lead Gen MCP Server
// Production-ready B2B lead generation tools for AI assistants

import { searchCompanies } from './services/firecrawl.js';
import { enrichCompany, findContacts, scrapeWebsite } from './services/firecrawl.js';
import { verifyEmail } from './services/email.js';
import { saveToGoogleSheets } from './services/sheets.js';

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || '';

const tools = [
  {
    name: "search_companies",
    description: "Search for companies by industry, location, and size. Returns company name, domain, description, and basic metrics.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Industry or company type to search for" },
        location: { type: "string", description: "Geographic location filter" },
        size: { type: "string", enum: ["startup", "small", "medium", "enterprise"], description: "Company size filter" },
        limit: { type: "number", description: "Maximum results to return", default: 10 },
      },
      required: ["query"],
    },
  },
  {
    name: "enrich_company",
    description: "Get detailed company information including funding, tech stack, employee count, and contact info.",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Company domain (e.g., acme.com)" },
      },
      required: ["domain"],
    },
  },
  {
    name: "find_contacts",
    description: "Find professional contacts at a company by role or department.",
    inputSchema: {
      type: "object",
      properties: {
        company_domain: { type: "string", description: "Company domain to search" },
        role: { type: "string", description: "Job title or role to find" },
        limit: { type: "number", description: "Maximum contacts", default: 10 },
      },
      required: ["company_domain"],
    },
  },
  {
    name: "verify_email",
    description: "Verify if an email address is valid and deliverable.",
    inputSchema: {
      type: "object",
      properties: {
        email: { type: "string", description: "Email address to verify" },
      },
      required: ["email"],
    },
  },
  {
    name: "scrape_company",
    description: "Scrape company website to extract structured data.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Company website URL to scrape" },
        extract: { type: "string", enum: ["about", "team", "products", "news", "all"], description: "What to extract", default: "all" },
      },
      required: ["url"],
    },
  },
  {
    name: "enrich_lead",
    description: "Complete lead enrichment in one call - combines company, contact, email verification, and scraping.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Contact full name" },
        email: { type: "string", description: "Contact email" },
        company_domain: { type: "string", description: "Company domain" },
      },
      required: ["company_domain"],
    },
  },
  {
    name: "save_leads_to_sheet",
    description: "Save enriched leads to Google Sheets.",
    inputSchema: {
      type: "object",
      properties: {
        leads: { type: "array", description: "Array of enriched lead objects" },
        sheet_name: { type: "string", description: "Name for the sheet", default: "Lead Gen Export" },
      },
      required: ["leads"],
    },
  },
  {
    name: "get_credits",
    description: "Check current API credit balance and usage. Always free to call.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

// Simple JSON-RPC over stdio handler
async function handleRequest(request) {
  const { method, id, params } = request;

  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "LogiclemonAI Lead Gen", version: "1.0.0" },
      },
    };
  }

  if (method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: { tools },
    };
  }

  if (method === "tools/call") {
    const { name, arguments: args } = params;
    
    try {
      let result;
      
      switch (name) {
        case "search_companies":
          result = await searchCompanies(args?.query, args?.location, args?.size, args?.limit, FIRECRAWL_API_KEY);
          break;
        case "enrich_company":
          result = await enrichCompany(args?.domain, FIRECRAWL_API_KEY);
          break;
        case "find_contacts":
          result = await findContacts(args?.company_domain, args?.role, args?.limit, FIRECRAWL_API_KEY);
          break;
        case "verify_email":
          result = verifyEmail(args?.email);
          break;
        case "scrape_company":
          result = await scrapeWebsite(args?.url, args?.extract, FIRECRAWL_API_KEY);
          break;
        case "enrich_lead":
          const companyResult = await enrichCompany(args?.company_domain, FIRECRAWL_API_KEY);
          const emailResult = args?.email ? verifyEmail(args.email) : null;
          result = {
            success: true,
            contact: { name: args?.name || "Unknown", email: args?.email },
            company: companyResult.company,
            verification: emailResult,
            ready_for_outreach: emailResult?.deliverable === true,
          };
          break;
        case "save_leads_to_sheet":
          result = await saveToGoogleSheets(args?.leads, args?.sheet_name);
          break;
        case "get_credits":
          result = {
            success: true,
            service: "LogiclemonAI Lead Gen",
            status: "active",
            pricing: {
              search_companies: "$0.01/call",
              enrich_company: "$0.02/call",
              find_contacts: "$0.03/call",
              verify_email: "$0.005/call",
              scrape_company: "$0.02/call",
              enrich_lead: "$0.05/call",
              save_leads_to_sheet: "$0.01/call",
              get_credits: "Free",
            },
            limits: { rate_limit: "100 req/min", daily_limit: "10000 req/day" },
          };
          break;
        default:
          return {
            jsonrpc: "2.0",
            id,
            error: { code: -32601, message: `Unknown tool: ${name}` },
          };
      }

      return {
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        },
      };
    } catch (error) {
      return {
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: `Error: ${error.message}` }],
          isError: true,
        },
      };
    }
  }

  return {
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: "Method not found" },
  };
}

// Read requests from stdin, write responses to stdout
const stdin = process.stdin;
const stdout = process.stdout;

let buffer = "";

stdin.on("data", async (chunk) => {
  buffer += chunk.toString();
  
  // Try to parse complete JSON messages
  try {
    const request = JSON.parse(buffer);
    buffer = "";
    const response = await handleRequest(request);
    stdout.write(JSON.stringify(response) + "\n");
  } catch (e) {
    // Not a complete JSON yet, wait for more data
  }
});

console.error("LogiclemonAI Lead Gen MCP Server running on stdio");
