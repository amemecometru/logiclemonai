import { CuratedTool } from "../types";

export const CURATED_TOOLS: CuratedTool[] = [
  {
    id: "gemini-api",
    name: "Google Gemini API & AI Studio",
    category: "Developer APIs & Reasoning",
    pricing: "Pay-as-you-go (Very cost-effective, rich free tier available)",
    description: "Google's state-of-the-art multimodal model suite featuring groundbreaking 2-million token context windows, native audio processing, and lightning-fast speed.",
    bestFor: "Complex analytical pipelines, parsing massive documents or codebases, real-time voice, and building highly custom apps.",
    features: [
      "Up to 2M context window",
      "Native Multimodal processing (Text, Image, Video, Audio)",
      "High-speed generation & low latency",
      "Official @google/genai TS SDK support"
    ],
    difficulty: "Developer",
    website: "https://aistudio.google.com"
  },
  {
    id: "chatgpt-enterprise",
    name: "ChatGPT Team & Enterprise",
    category: "General Productivity & Reasoning",
    pricing: "$25 - $30 / user / month",
    description: "The gold standard conversational assistant for office productivity. The Team & Enterprise tiers guarantee that your inputs are never used to train the base models.",
    bestFor: "Day-to-day drafting, brainstorming, translating, simple coding, and custom data analysis using Advanced Data Analysis.",
    features: [
      "Team-shared custom GPT workspace",
      "Guaranteed enterprise-grade data privacy",
      "Advanced file analysis & visualization",
      "DALL-E 3 image generation integrated"
    ],
    difficulty: "Zero-Code",
    website: "https://openai.com/chatgpt"
  },
  {
    id: "claude-pro",
    name: "Claude Team",
    category: "Writing, Strategy & Coding",
    pricing: "$25 - $30 / user / month",
    description: "Anthropic's model series renowned for nuanced writing, exceptional logical reasoning, and developer productivity via Projects.",
    bestFor: "Drafting long-form technical articles, reviewing complex legal contracts, writing flawless code blocks, and structured analysis.",
    features: [
      "Shared Team Projects with shared context",
      "Industry-leading conversational nuance",
      "Excellent technical code generation",
      "ZDR (Zero Data Retention) API contracts available"
    ],
    difficulty: "Zero-Code",
    website: "https://anthropic.com/claude"
  },
  {
    id: "make-com",
    name: "Make.com",
    category: "Workflow Automation",
    pricing: "Free tier (1,000 operations/mo); Paid plans start at $9/mo",
    description: "An advanced, visual drag-and-drop automation platform to connect your CRM, emails, databases, and AI endpoints seamlessly.",
    bestFor: "Designing multi-step business logic pipelines, automatically translating emails, classifying leads, and syncing databases.",
    features: [
      "Visual drag-and-drop builder",
      "Thousands of pre-built app integrations",
      "Supports routers, filters, and JSON processing",
      "Works natively with standard HTTP APIs"
    ],
    difficulty: "Low-Code",
    website: "https://make.com"
  },
  {
    id: "zapier",
    name: "Zapier",
    category: "Workflow Automation",
    pricing: "Free limited tier; Professional starts at $19.99/mo",
    description: "The easiest, most popular workflow connector. Connects thousands of popular SaaS tools in simple trigger-action 'Zaps' with minimal setup.",
    bestFor: "Quick non-technical automations, linking standard web forms to spreadsheets, and automated email/slack alerts.",
    features: [
      "Zero-code trigger-action interface",
      "AI-assisted Zap builder (describe in English)",
      "Vast library of consumer SaaS apps",
      "Built-in simple database tables"
    ],
    difficulty: "Zero-Code",
    website: "https://zapier.com"
  },
  {
    id: "v0-vercel",
    name: "v0 by Vercel",
    category: "UI & Frontend Development",
    pricing: "Free tier with credits; Premium is $20/mo",
    description: "A revolutionary generative UI platform that builds highly polished React and Tailwind components based on simple natural language descriptions.",
    bestFor: "Rapidly prototyping web layouts, generating beautiful dashboards, and scaffolding modern web app frontends.",
    features: [
      "Produces clean React + Tailwind + Radix UI code",
      "Interactive component editing and iterative adjustments",
      "One-click sandbox preview and deployment",
      "Integrates with popular icon sets"
    ],
    difficulty: "Low-Code",
    website: "https://v0.dev"
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs Voice AI",
    category: "Audio & Speech Synthesis",
    pricing: "Free tier; Starter from $5/mo; Creator from $11/mo",
    description: "The premier speech synthesis engine. Generates hyper-realistic, human-sounding voiceovers, translations, and custom voice clones.",
    bestFor: "Narrating marketing videos, generating localized educational audio, and scaling multi-lingual customer voice lines.",
    features: [
      "Flawless emotional tone and pacing",
      "Instant voice cloning from short 10s audio",
      "Support for 29+ languages natively",
      "Developer-friendly audio streaming APIs"
    ],
    difficulty: "Zero-Code",
    website: "https://elevenlabs.io"
  },
  {
    id: "runway-gen3",
    name: "Runway Gen-3 Alpha",
    category: "Video & Image Generation",
    pricing: "Starts at $12 / user / month",
    description: "A leading multimodal video generation platform that produces stunning cinematic clips, camera animations, and video edits from text prompts.",
    bestFor: "B-roll video production for ads, visual concepts for client presentations, and creative animations.",
    features: [
      "Exceptional temporal consistency",
      "Granular camera motion controls",
      "Text-to-video and image-to-video capabilities",
      "High-speed generation modes"
    ],
    difficulty: "Zero-Code",
    website: "https://runwayml.com"
  },
  {
    id: "perplexity-ai",
    name: "Perplexity Enterprise Pro",
    category: "Research & Market Intelligence",
    pricing: "$20 / month; Enterprise $40 / user / month",
    description: "An AI-powered search and answer engine that performs comprehensive deep research across the live web and provides parsed, cited sources.",
    bestFor: "Compiling market research, performing competitive intelligence, checking news sources, and verifying citations.",
    features: [
      "Real-time search across the entire internet",
      "Exhaustive inline citations for transparency",
      "Focus modes (Academic, Writing, YouTube, Reddit)",
      "File uploads for deep data reading"
    ],
    difficulty: "Zero-Code",
    website: "https://perplexity.ai"
  }
];
