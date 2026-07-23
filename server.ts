import { GoogleGenAI } from "@google/genai";

// 1. Cloudflare Environment Bindings & Secrets Interface
export interface Env {
  d1: D1Database;
  WEBHOOKS_KV: KVNamespace;
  ASSETS: Fetcher; // Serves the React static UI from dist/
  GEMINI_API_KEY: string;
  HMAC_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
  GITHUB_CLIENT_ID?: string;
  YOUTUBE_DATA_v3?: string;
  STRIPE_SECRET_KEY?: string;
}

// 2. Global CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-HMAC-Signature",
};

// Helper function for consistent JSON responses with CORS headers
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

// 3. Worker Request Handler
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // --- ROUTE 1: Browser CORS Preflight (OPTIONS) ---
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders, status: 204 });
    }

    // --- ROUTE 2: Healthcheck (API ONLY) ---
    if (url.pathname === "/api/health" && request.method === "GET") {
      return jsonResponse({
        status: "online",
        service: "LogicLemon AI Auditing Engine",
        timestamp: new Date().toISOString(),
      });
    }

    // --- ROUTE 3: AI Assessment Handler (POST /api/assess) ---
    if (url.pathname === "/api/assess" && request.method === "POST") {
      try {
        if (!env.GEMINI_API_KEY) {
          return jsonResponse({ error: "GEMINI_API_KEY is not configured in Cloudflare secrets." }, 500);
        }

        const body = (await request.json()) as Record<string, any>;

        // Extract client/lead information with fallbacks
        const clientName = body.name || body.clientName || "Anonymous";
        const clientEmail = body.email || body.clientEmail || "N/A";
        const companyName = body.company || body.companyName || "N/A";

        // Initialize Gemini client with Cloudflare secret
        const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `You are an expert AI operations auditor. Analyze these assessment responses and generate a structured diagnostic audit report:\n\n${JSON.stringify(body, null, 2)}`,
        });

        const reportText = response.text || "No report generated.";

        // Async non-blocking log to Cloudflare D1 Database (Contact info + Report)
        if (env.d1) {
          ctx.waitUntil(
            env.d1
              .prepare(
                "INSERT INTO audit_reports (client_name, client_email, company_name, report_text, created_at) VALUES (?, ?, ?, ?, ?)"
              )
              .bind(clientName, clientEmail, companyName, reportText, new Date().toISOString())
              .run()
              .catch((err) => console.error("D1 Insert Error:", err))
          );
        }

        return jsonResponse({ success: true, result: reportText });
      } catch (error: any) {
        console.error("Assessment execution error:", error);
        return jsonResponse({ error: error.message || "Failed to process assessment." }, 500);
      }
    }

    // --- ROUTE 4: Stripe Webhook Deduplication (POST /api/webhook/stripe) ---
    if (url.pathname === "/api/webhook/stripe" && request.method === "POST") {
      try {
        const eventId = request.headers.get("stripe-signature") || `evt_${Date.now()}`;

        if (env.WEBHOOKS_KV) {
          const processed = await env.WEBHOOKS_KV.get(eventId);
          if (processed) {
            return jsonResponse({ message: "Webhook already processed" }, 200);
          }

          // Cache event in KV for 24 hours
          await env.WEBHOOKS_KV.put(eventId, "processed", { expirationTtl: 86400 });
        }

        return jsonResponse({ success: true, received: true });
      } catch (error: any) {
        return jsonResponse({ error: error.message }, 500);
      }
    }

    // --- ROUTE 5: FRONTEND UI FALLBACK ---
    // Serve the React frontend application from dist/ for non-API routes
    if (!url.pathname.startsWith("/api") && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    // --- ROUTE 6: Unhandled API Endpoint 404 ---
    return jsonResponse({ error: "Endpoint not found" }, 404);
  },
};
