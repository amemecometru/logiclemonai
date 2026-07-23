export interface QuestionnaireAnswers {
  industry: string;
  companySize: string;
  goals: string[];
  currentAiUsage: string;
  techSkillLevel: string;
  budget: string;
  compliance: string;
  additionalContext?: string;
}

export interface RecommendedTool {
  name: string;
  category: string;
  description: string;
  suitabilityScore: number; // 0-100
  pros: string[];
  cons: string[];
  estimatedCost: string;
  implementationEffort: 'Low' | 'Medium' | 'High';
  recommendedUseCases: string[];
}

export interface RoadmapPhase {
  title: string;
  duration: string;
  actions: {
    task: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    impact: 'High' | 'Medium' | 'Low';
  }[];
}

export interface RiskAnalysis {
  riskType: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  mitigationStrategy: string;
}

export interface AssessmentResult {
  summary: string;
  readinessScore: number; // 0-100
  recommendedTools: RecommendedTool[];
  roadmap: RoadmapPhase[];
  risks: RiskAnalysis[];
  criticalAdvice: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'auditor';
  text: string;
  timestamp: string;
}

export interface CuratedTool {
  id: string;
  name: string;
  category: string;
  pricing: string;
  description: string;
  bestFor: string;
  features: string[];
  difficulty: 'Zero-Code' | 'Low-Code' | 'Developer';
  website: string;
}
