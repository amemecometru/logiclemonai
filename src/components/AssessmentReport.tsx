import React from "react";
import { motion } from "motion/react";
import { AssessmentResult, RecommendedTool } from "../types";
import { 
  Award, 
  ShieldAlert, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  Download, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  RotateCcw
} from "lucide-react";

interface AssessmentReportProps {
  report: AssessmentResult;
  onReset: () => void;
  onNavigateToChat: () => void;
}

export const AssessmentReport: React.FC<AssessmentReportProps> = ({ report, onReset, onNavigateToChat }) => {
  // Get color for suitability score
  const getSuitabilityColor = (score: number) => {
    if (score >= 85) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/5";
    if (score >= 70) return "text-amber-400 border-amber-500/30 bg-amber-500/5";
    return "text-rose-400 border-rose-500/30 bg-rose-500/5";
  };

  const getEffortColor = (effort: string) => {
    switch (effort.toLowerCase()) {
      case "low": return "text-emerald-400 bg-emerald-500/10";
      case "medium": return "text-amber-400 bg-amber-500/10";
      default: return "text-rose-400 bg-rose-500/10";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return "bg-rose-500/10 border-rose-500/30 text-rose-400";
      case "medium": return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      default: return "bg-slate-800/60 border-slate-700/50 text-slate-400";
    }
  };

  const handleCopyReport = () => {
    const textToCopy = `
=== AI TOOLS ASSESSMENT REPORT ===
Readiness Score: ${report.readinessScore}/100

SUMMARY:
${report.summary}

RECOMMENDED TOOLS:
${report.recommendedTools.map((t, idx) => `${idx + 1}. ${t.name} (${t.category})
   - Suitability: ${t.suitabilityScore}%
   - Cost: ${t.estimatedCost}
   - Effort: ${t.implementationEffort}
   - Use Cases: ${t.recommendedUseCases.join(", ")}
   - Pros: ${t.pros.join(", ")}
   - Cons: ${t.cons.join(", ")}`).join("\n\n")}

CRITICAL STRATEGIC ADVICE:
${report.criticalAdvice}
    `;
    navigator.clipboard.writeText(textToCopy);
    alert("Report text copied to clipboard!");
  };

  // SVG Circular Gauge Calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (report.readinessScore / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="space-y-10 w-full max-w-5xl mx-auto pb-16"
      id="report-container"
    >
      {/* Overview Dashboard Card */}
      <div className="bg-white/[0.02] border border-white/10 rounded-sm p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl relative overflow-hidden" id="overview-dashboard">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-amber-500/5 blur-[80px] rounded-full pointer-events-none" />
        
        {/* SVG Circle Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0" id="gauge-block">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              className="stroke-white/5"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Animated foreground progress circle */}
            <motion.circle
              cx="72"
              cy="72"
              r={radius}
              className="stroke-amber-500"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-serif italic text-white tracking-wide">{report.readinessScore}</span>
            <span className="text-[9px] font-mono text-slate-400 tracking-widest uppercase mt-0.5">Readiness</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="px-2.5 py-0.5 bg-amber-500/5 text-amber-400 text-xs font-mono rounded-sm border border-amber-500/20">Audit Complete</span>
                <span className="text-xs text-slate-500 font-mono">ID: AI-${Math.floor(1000 + Math.random() * 9000)}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif italic text-white mt-1 tracking-wide">Your Strategic Audit Report</h1>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleCopyReport}
                className="flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors py-2 px-3.5 rounded-sm active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report</span>
              </button>
              <button 
                onClick={onReset}
                className="flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-rose-400 bg-white/5 border border-white/10 hover:bg-rose-950/20 hover:border-rose-900/30 transition-colors py-2 px-3.5 rounded-sm active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Audit</span>
              </button>
            </div>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed font-sans font-normal">
            {report.summary}
          </p>
        </div>
      </div>

      {/* Critical Advice Notice */}
      <div className="bg-amber-500/[0.03] border border-amber-500/20 rounded-sm p-5 flex gap-4 items-start shadow-sm" id="strategic-alert">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-mono text-amber-400 tracking-widest uppercase block font-medium">Critical Strategic Focus</span>
          <p className="text-sm text-slate-200 mt-1 leading-relaxed">
            {report.criticalAdvice}
          </p>
        </div>
      </div>

      {/* Recommended Tools Segment */}
      <div className="space-y-5" id="tools-segment">
        <div className="flex justify-between items-end border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-xl font-serif italic text-white tracking-wide">Tailored AI Toolkit Matches</h2>
            <p className="text-xs text-slate-400 mt-0.5">Custom model selection based on technical capacity, goals, and security requirements.</p>
          </div>
          <button 
            onClick={onNavigateToChat}
            className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-all group cursor-pointer"
          >
            <span>Ask Auditor about these</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {report.recommendedTools.map((tool, idx) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.35 }}
              className="bg-slate-900/30 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between space-y-5 transition-all group"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">{tool.category}</span>
                    <h3 className="text-base font-semibold text-white tracking-tight mt-0.5 group-hover:text-amber-400 transition-colors">{tool.name}</h3>
                  </div>
                  <div className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg border ${getSuitabilityColor(tool.suitabilityScore)} shrink-0`}>
                    {tool.suitabilityScore}% Match
                  </div>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">{tool.description}</p>

                {/* Grid stats */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Cost Index</span>
                    <span className="text-xs text-slate-300 font-medium truncate block mt-0.5">{tool.estimatedCost}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Effort</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium inline-block mt-1 ${getEffortColor(tool.implementationEffort)}`}>
                      {tool.implementationEffort}
                    </span>
                  </div>
                </div>

                {/* Pros / Cons */}
                <div className="space-y-2 text-xs pt-1">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block tracking-wider uppercase mb-1">Impact Pros</span>
                    <div className="space-y-1">
                      {tool.pros.map((pro, i) => (
                        <div key={i} className="flex gap-2 items-start text-slate-300 leading-snug">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-1.5">
                    <span className="text-[10px] font-mono text-slate-400 block tracking-wider uppercase mb-1">Constraints & Cons</span>
                    <div className="space-y-1">
                      {tool.cons.map((con, i) => (
                        <div key={i} className="flex gap-2 items-start text-slate-400 leading-snug">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500/60 shrink-0 mt-0.5" />
                          <span>{con}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Use Cases */}
              <div className="border-t border-white/5 pt-3.5">
                <span className="text-[10px] font-mono text-slate-500 block tracking-wider uppercase mb-1">Suggested Deployment Target</span>
                <div className="flex flex-wrap gap-1.5">
                  {tool.recommendedUseCases.map((uc, i) => (
                    <span key={i} className="px-2 py-0.5 bg-black/50 border border-white/10 rounded-sm text-[10px] text-slate-300 font-mono">
                      {uc}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Timeline Implementation Roadmap */}
      <div className="space-y-6" id="roadmap-segment">
        <div>
          <h2 className="text-xl font-serif italic text-white tracking-wide border-b border-white/10 pb-3">Strategic Implementation Roadmap</h2>
          <p className="text-xs text-slate-400 mt-0.5">A phased, milestone-driven integration roadmap designed to secure immediate returns.</p>
        </div>

        <div className="relative border-l border-white/10 ml-4 pl-8 space-y-10 py-2">
          {report.roadmap.map((phase, phaseIdx) => (
            <div key={phase.title} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-sm bg-black border border-white/10 flex items-center justify-center text-[10px] font-mono font-bold text-amber-500 shadow-md">
                {phaseIdx + 1}
              </div>

              <div className="space-y-4">
                {/* Phase Title */}
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-white">{phase.title}</h3>
                    <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-amber-400 text-xs font-mono rounded-sm">
                      {phase.duration}
                    </span>
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.actions.map((action, actionIdx) => (
                    <div 
                      key={actionIdx}
                      className="bg-white/[0.02] border border-white/10 rounded-sm p-4.5 space-y-2.5 hover:border-white/20 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-semibold text-sm text-slate-100 leading-tight">{action.task}</h4>
                        <div className="flex gap-1">
                          <span className={`text-[9px] px-1.5 py-0.5 font-mono rounded-sm border border-white/5 ${
                            action.impact === "High" ? "bg-emerald-500/5 text-emerald-400" : "bg-white/5 text-slate-400"
                          }`}>
                            {action.impact} Impact
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{action.description}</p>
                      <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-white/5 text-slate-500 font-mono">
                        <span>Step Complexity</span>
                        <span className={`font-semibold ${
                          action.difficulty === "Easy" ? "text-emerald-400" : action.difficulty === "Medium" ? "text-amber-400" : "text-rose-400"
                        }`}>{action.difficulty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance & Risk Matrix */}
      <div className="space-y-5" id="risks-segment">
        <div>
          <h2 className="text-xl font-serif italic text-white tracking-wide border-b border-white/10 pb-3">Risk Matrix & Security Safeguards</h2>
          <p className="text-xs text-slate-400 mt-0.5">Critical regulatory checkpoints, hallucination guards, and organizational policy guidelines.</p>
        </div>

        <div className="border border-white/10 rounded-sm overflow-hidden bg-white/[0.02]" id="risks-table">
          <div className="grid grid-cols-12 bg-white/5 p-3 text-xs font-mono text-slate-400 border-b border-white/10">
            <div className="col-span-3">Risk Factor</div>
            <div className="col-span-2">Severity</div>
            <div className="col-span-7">Audit Description & Custom Safeguard</div>
          </div>
          <div className="divide-y divide-white/10">
            {report.risks.map((risk, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 p-4 text-sm gap-3">
                <div className="col-span-12 md:col-span-3 font-semibold text-slate-200">
                  {risk.riskType}
                </div>
                <div className="col-span-12 md:col-span-2 flex items-start">
                  <span className={`px-2 py-0.5 text-[10px] rounded-sm font-mono font-medium border ${getSeverityColor(risk.severity)}`}>
                    {risk.severity} Severity
                  </span>
                </div>
                <div className="col-span-12 md:col-span-7 space-y-2 text-xs">
                  <p className="text-slate-300 leading-relaxed font-sans">{risk.description}</p>
                  <div className="bg-black/40 p-2.5 rounded-sm border border-white/5 flex gap-2.5 items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider block font-medium">Audit Mitigation Step</span>
                      <p className="text-slate-400 leading-normal mt-0.5 font-sans">{risk.mitigationStrategy}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section to talk to Expert */}
      <div className="bg-gradient-to-r from-white/[0.03] to-amber-950/5 border border-white/10 rounded-sm p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Need granular implementation advice?</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-lg">
            Discuss integrations, budget configurations, or legal terms with our expert AI Auditor. The Auditor has full context of your report results.
          </p>
        </div>
        <button
          onClick={onNavigateToChat}
          className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold py-3 px-6 rounded-sm transition-all active:scale-95 cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-lg shadow-amber-500/10 uppercase tracking-widest"
        >
          <span>Chat with AI Auditor</span>
          <ChevronRight className="w-4 h-4 stroke-[3px]" />
        </button>
      </div>
    </motion.div>
  );
};
