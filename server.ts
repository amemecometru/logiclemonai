import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Ensure Gemini API Key is available, handle gracefully
const apiKey = process.env.GEMINI_API_KEY;

// Lazy initialize Gemini AI client
let ai: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!ai) {
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI assessment results will be simulated locally.");
    }
    ai = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

const app = express();
app.use(express.json());

// API route for AI assessment
app.post("/api/assess", async (req, res) => {
  try {
    const answers = req.body;
    if (!answers) {
      return res.status(400).json({ error: "Answers are required for assessment." });
    }

    if (!apiKey) {
      // Return simulated audit results if no API Key is available
      return res.json(getSimulatedAssessment(answers));
    }

    const client = getGenAI();
    const prompt = `
      Please audit the following business requirements and generate a comprehensive AI Tools Assessment and Recommendation report.
      
      BUSINESS PARAMETERS:
      - Industry: ${answers.industry}
      - Company Size: ${answers.companySize}
      - Primary Pain Points / Goals: ${answers.goals ? answers.goals.join(", ") : "Not specified"}
      - Current AI Tech Maturity: ${answers.currentAiUsage}
      - Technical Team Skill Level: ${answers.techSkillLevel}
      - Monthly Budget for AI: ${answers.budget}
      - Regulatory Compliance / Privacy Constraints: ${answers.compliance}
      - Additional context provided: ${answers.additionalContext || "None"}
      
      Please analyze these details and respond with a highly structured JSON report.
    `;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `
          You are an elite enterprise AI Auditor and IT strategist. Your job is to assess business processes, team capabilities, and compliance needs to recommend the absolute best AI tools, workflows, and implementation strategies.
          
          Provide clear, pragmatic advice. Match your recommended tools strictly to the user's budget and technical skill:
          - If they are 'Non-technical', prioritize user-friendly SaaS, templates, and zero-code interfaces (e.g. ChatGPT, v0, Zapier, Canva).
          - If they are 'Technical', recommend developer-focused API integrations, open-source models, and developer tools (e.g. LangChain, Drizzle, Gemini API, custom server proxies).
          - If their budget is 'Minimal', prioritize free tiers and open-source options.
          - If they have strict compliance constraints (e.g. HIPAA, GDPR), explicitly call out enterprise plans, zero data retention (ZDR) APIs, or local offline alternatives, and identify privacy risks.
          
          You must respond in valid JSON matching the defined schema. Ensure the readiness score is between 0 and 100, reflecting their current maturity and constraints.
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A professional 3-sentence executive summary auditing the company's current state and AI readiness."
            },
            readinessScore: {
              type: Type.INTEGER,
              description: "An AI adoption readiness score (0-100) based on tech skills, budget, and maturity."
            },
            recommendedTools: {
              type: Type.ARRAY,
              description: "List of 3 to 5 highly relevant AI tools tailored specifically to their goals, budget, and skills.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the AI tool (e.g. ChatGPT, Zapier, v0, Midjourney)" },
                  category: { type: Type.STRING, description: "Category (e.g. Customer Service, Workflow Automation, Web Development)" },
                  description: { type: Type.STRING, description: "Brief description of the tool and why it fits this business." },
                  suitabilityScore: { type: Type.INTEGER, description: "Compatibility score from 0 to 100." },
                  pros: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2 key benefits for this company." },
                  cons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2 key limitations or drawbacks for this company." },
                  estimatedCost: { type: Type.STRING, description: "Estimated monthly cost structure (e.g., Free, $20/user/mo, Enterprise-only)" },
                  implementationEffort: { 
                    type: Type.STRING, 
                    description: "Effort to implement ('Low', 'Medium', 'High')" 
                  },
                  recommendedUseCases: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Concrete tasks this company should use the tool for." }
                },
                required: ["name", "category", "description", "suitabilityScore", "pros", "cons", "estimatedCost", "implementationEffort", "recommendedUseCases"]
              }
            },
            roadmap: {
              type: Type.ARRAY,
              description: "A 3-phase strategic implementation roadmap: Phase 1: Quick Wins, Phase 2: Core Integration, Phase 3: Scaling & Optimization.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Title of the phase (e.g., 'Phase 1: Immediate Efficiency / Quick Wins')" },
                  duration: { type: Type.STRING, description: "Estimated timeline (e.g., 'Weeks 1-4', 'Month 2-3')" },
                  actions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        task: { type: Type.STRING, description: "The specific actionable task." },
                        description: { type: Type.STRING, description: "How to execute this action step-by-step." },
                        difficulty: { type: Type.STRING, description: "Difficulty level ('Easy', 'Medium', 'Hard')" },
                        impact: { type: Type.STRING, description: "Expected impact on operations ('High', 'Medium', 'Low')" }
                      },
                      required: ["task", "description", "difficulty", "impact"]
                    }
                  }
                },
                required: ["title", "duration", "actions"]
              }
            },
            risks: {
              type: Type.ARRAY,
              description: "Potential risks regarding compliance, data security, model bias, and lock-in, with actionable mitigations.",
              items: {
                type: Type.OBJECT,
                properties: {
                  riskType: { type: Type.STRING, description: "Type of risk (e.g., Data Privacy, Model Hallucinations, Cost Scaling, Skill Gap)" },
                  severity: { type: Type.STRING, description: "Risk level ('High', 'Medium', 'Low')" },
                  description: { type: Type.STRING, description: "How this risk applies directly to their business configuration." },
                  mitigationStrategy: { type: Type.STRING, description: "Step-by-step guideline to prevent or handle this risk." }
                },
                required: ["riskType", "severity", "description", "mitigationStrategy"]
              }
            },
            criticalAdvice: {
              type: Type.STRING,
              description: "A final, powerful piece of strategic advice (1-2 sentences) directly from the Auditor."
            }
          },
          required: ["summary", "readinessScore", "recommendedTools", "roadmap", "risks", "criticalAdvice"]
        }
      }
    });

    const reportText = response.text;
    if (!reportText) {
      throw new Error("Empty response from AI engine.");
    }

    const reportData = JSON.parse(reportText.trim());
    res.json(reportData);
  } catch (error: any) {
    console.error("AI assessment failed:", error);
    res.status(500).json({ error: error.message || "Failed to process business assessment." });
  }
});

// API route for Interactive Auditor Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, assessmentResult } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message content is required." });
    }

    if (!apiKey) {
      // Simulate local responses if API key is not available
      return res.json({
        reply: `This is a simulated auditor response. Since there is no GEMINI_API_KEY set, I am running in local offline mode. Based on your assessment result with a readiness score of ${assessmentResult?.readinessScore || 50}%, I recommend that you set up your API credentials in the **Settings > Secrets** panel of AI Studio so I can give you full real-time analytical audits!`
      });
    }

    const client = getGenAI();
    
    // Construct chat instruction with current context
    const assessmentSummaryContext = assessmentResult 
      ? `ASSESSMENT RESULT CONTEXT:
         - Business summary: ${assessmentResult.summary}
         - Readiness Score: ${assessmentResult.readinessScore}%
         - Tools Recommended: ${assessmentResult.recommendedTools.map((t: any) => t.name).join(", ")}
         - Risks Audited: ${assessmentResult.risks.map((r: any) => `${r.riskType} (${r.severity})`).join(", ")}`
      : "No assessment report exists yet. Encourage the user to complete the business needs assessment first so we have deep business context!";

    const systemInstruction = `
      You are an elite, analytical, yet friendly and collaborative enterprise AI Auditor. 
      You are talking to a user who is assessing how their organization can adopt AI tools.
      
      Using the business assessment context provided below, answer all user questions with highly specific, granular, actionable advice. Avoid generic fluff. Refer directly to the recommended tools, implementation steps, and security risks from their custom audit.
      
      Keep your tone highly professional, precise, structured, and consultatory (like a McKinsey/Gartner AI partner). Use short, scannable paragraphs and lists.

      ${assessmentSummaryContext}
    `;

    // Map history to the required format for chats
    // Ensure roles map correctly: 'user' is user, 'model' is model
    const contents = history ? history.map((msg: any) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    })) : [];

    // Append current message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text;
    res.json({ reply });
  } catch (error: any) {
    console.error("Auditor Chat failed:", error);
    res.status(500).json({ error: error.message || "Failed to generate chat response." });
  }
});

// Helper for simulated local results when key is missing
function getSimulatedAssessment(answers: any): any {
  const readinessScore = Math.min(
    95,
    Math.max(
      25,
      (answers.techSkillLevel === "Technical" ? 30 : 15) +
      (answers.budget === "Substantial" ? 30 : answers.budget === "Moderate" ? 20 : 10) +
      (answers.currentAiUsage !== "We don't use AI yet" ? 25 : 10)
    )
  );

  return {
    summary: `Local Simulation Mode: Based on our analysis for your ${answers.industry} team of ${answers.companySize} employees, you demonstrate a balanced readiness. There is high potential for workflow automation and generative support, though attention is required for the regulatory constraints specified under '${answers.compliance}'.`,
    readinessScore,
    recommendedTools: [
      {
        name: "ChatGPT Teams & Enterprise",
        category: "General Productivity & Writing",
        description: "Perfect fit for general content creation, draft generation, and routine communications, with robust workspace privacy controls.",
        suitabilityScore: 92,
        pros: ["Instant team-wide adoption", "High quality out of the box"],
        cons: ["Requires training for prompt-writing", "Monthly subscription per seat"],
        estimatedCost: "$25 - $30 / user / month",
        implementationEffort: "Low",
        recommendedUseCases: ["Email drafting", "Document summaries", "Meeting notes distillation"]
      },
      {
        name: "Make.com (with Gemini API)",
        category: "Workflow Automation",
        description: "Visual automation canvas to connect your tools, databases, and AI endpoints seamlessly without needing deep code expertise.",
        suitabilityScore: 85,
        pros: ["Extremely flexible drag-and-drop", "Native integrations for hundreds of apps"],
        cons: ["Requires workflow design logic", "Free tier has limits on monthly runs"],
        estimatedCost: "Free tier available; Paid starts at $9/month",
        implementationEffort: "Medium",
        recommendedUseCases: ["Auto-routing support tickets", "Drafting newsletters", "Syncing CRM data"]
      },
      {
        name: "v0 by Vercel",
        category: "Design & Frontend Prototyping",
        description: "Generative AI tool that builds clean, ready-to-use React and HTML components based on text prompts, accelerating software design.",
        suitabilityScore: 78,
        pros: ["Saves developers hours of UI scaffolding", "Allows non-designers to prototype beautifully"],
        cons: ["Code needs hosting and deployment", "Limited to frontend styling"],
        estimatedCost: "Free tier available; Pro is $20/month",
        implementationEffort: answers.techSkillLevel === "Technical" ? "Low" : "High",
        recommendedUseCases: ["Scaffolding landing pages", "Creating mockups for internal dashboards", "Prototyping dynamic forms"]
      }
    ],
    roadmap: [
      {
        title: "Phase 1: Immediate Efficiency / Quick Wins",
        duration: "Weeks 1 - 3",
        actions: [
          {
            task: "Adopt Team Generative SaaS",
            description: "Onboard core staff to a secure workspace subscription (ChatGPT Team) to eliminate manual drafting and summarizing backlogs.",
            difficulty: "Easy",
            impact: "High"
          },
          {
            task: "Formulate AI Acceptable Use Policy",
            description: "Define guidelines on what company data can be shared with public models, especially regarding compliance constraints: " + answers.compliance,
            difficulty: "Easy",
            impact: "High"
          }
        ]
      },
      {
        title: "Phase 2: Connected Operational Automation",
        duration: "Weeks 4 - 8",
        actions: [
          {
            task: "Integrate Support / Lead Auto-Router",
            description: "Use Make.com to parse incoming requests, classify them via Gemini API, and route them to correct Slack/email endpoints.",
            difficulty: "Medium",
            impact: "High"
          }
        ]
      },
      {
        title: "Phase 3: Scale & Custom Integrations",
        duration: "Month 3+",
        actions: [
          {
            task: "Deploy Custom App Scaffolds",
            description: "Scaffold advanced client dashboards using v0 and connect them to real internal APIs for tailored user capabilities.",
            difficulty: "Hard",
            impact: "Medium"
          }
        ]
      }
    ],
    risks: [
      {
        riskType: "Data Leakage & Privacy",
        severity: answers.compliance !== "Standard / No specific requirements" ? "High" : "Medium",
        description: "Staff copy-pasting customer or proprietary business data into consumer-grade AI models without data privacy protection.",
        mitigationStrategy: "Enforce strict policies and use only API connections or Enterprise tiers which explicitly guarantee zero data-retention."
      },
      {
        riskType: "Workflow Lock-in & Pricing Spikes",
        severity: "Low",
        description: "Heavy dependencies on proprietary API models can lead to high operational overhead if pricing models or token costs increase.",
        mitigationStrategy: "Maintain modular code or middleware that can switch base models (e.g. from Gemini to Claude) with minimal code rewrites."
      }
    ],
    criticalAdvice: `For your ${answers.companySize} business, do not overcomplicate early. Focus entirely on rolling out protected, standard team-seats and small-scale workflow automation before seeking to build costly bespoke integrations.`
  };
}

// Vite and static asset server configuration
async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Tools Assessment Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
