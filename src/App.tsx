import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Layers, 
  Bot, 
  Sparkles, 
  Activity, 
  HelpCircle,
  AlertTriangle,
  Cpu
} from "lucide-react";
import { QuestionnaireAnswers, AssessmentResult } from "./types";
import { AssessmentForm } from "./components/AssessmentForm";
import { AssessmentReport } from "./components/AssessmentReport";
import { ToolsExplorer } from "./components/ToolsExplorer";
import { AuditorChat } from "./components/AuditorChat";

export default function App() {
  const [activeTab, setActiveTab] = useState<"assessor" | "explorer" | "chat">("assessor");
  const [answers, setAnswers] = useState<QuestionnaireAnswers | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Restore session from cache
  useEffect(() => {
    try {
      const cachedAnswers = localStorage.getItem("ai_audit_answers");
      const cachedResult = localStorage.getItem("ai_audit_result");
      
      if (cachedAnswers) setAnswers(JSON.parse(cachedAnswers));
      if (cachedResult) setAssessmentResult(JSON.parse(cachedResult));
    } catch (err) {
      console.error("Failed to restore cache session:", err);
    }
  }, []);

  // Save session helper
  const saveSession = (newAnswers: QuestionnaireAnswers, newResult: AssessmentResult) => {
    try {
      localStorage.setItem("ai_audit_answers", JSON.stringify(newAnswers));
      localStorage.setItem("ai_audit_result", JSON.stringify(newResult));
      setAnswers(newAnswers);
      setAssessmentResult(newResult);
    } catch (err) {
      console.error("Failed to cache session:", err);
    }
  };

  const handleClearSession = () => {
    try {
      localStorage.removeItem("ai_audit_answers");
      localStorage.removeItem("ai_audit_result");
      setAnswers(null);
      setAssessmentResult(null);
      setActiveTab("assessor");
      setErrorMessage(null);
    } catch (err) {
      console.error("Failed to clear session:", err);
    }
  };

  const handleAssessmentSubmit = async (formAnswers: QuestionnaireAnswers) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/assess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formAnswers)
      });

      if (!response.ok) {
        throw new Error("Assessment processing request failed.");
      }

      const reportData: AssessmentResult = await response.json();
      saveSession(formAnswers, reportData);
    } catch (err: any) {
      console.error("Audit failed:", err);
      setErrorMessage(
        err.message || "Failed to establish a secure audit connection with our Gemini server node. Please ensure your keys are configured."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-x-hidden text-slate-300 flex flex-col justify-between" id="app-root">
      
      {/* Dynamic ambient grid background styling */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2023_1px,transparent_1px),linear-gradient(to_bottom,#1f2023_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl mx-auto px-4 md:px-6 pt-8 flex-1">
        
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10 relative z-10" id="main-header">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-10 h-10 bg-amber-500 rounded flex items-center justify-center text-black font-extrabold text-sm tracking-wider font-serif italic shrink-0 shadow-lg shadow-amber-500/10">
              AA
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <span className="text-[10px] font-mono font-semibold tracking-widest text-amber-500 uppercase">Q3 Assessment Cycle — Enterprise v4.1</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Audit Active
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif italic text-white mt-1 tracking-wide">AI Tools Assessment & Audit Engine</h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex bg-white/5 p-1 rounded-lg border border-white/10" id="nav-tabs">
            <button
              onClick={() => setActiveTab("assessor")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold tracking-wide transition-[transform,background-color,color] duration-150 cursor-pointer active:scale-95 ${
                activeTab === "assessor"
                  ? "bg-amber-500 text-black font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{assessmentResult ? "Your Audit Report" : "Business Assessor"}</span>
            </button>
            <button
              onClick={() => setActiveTab("explorer")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold tracking-wide transition-[transform,background-color,color] duration-150 cursor-pointer active:scale-95 ${
                activeTab === "explorer"
                  ? "bg-amber-500 text-black font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Curated Directory</span>
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold tracking-wide transition-[transform,background-color,color] duration-150 cursor-pointer active:scale-95 ${
                activeTab === "chat"
                  ? "bg-amber-500 text-black font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Auditor Chat Console</span>
            </button>
          </nav>
        </header>

        {/* Error Banner */}
        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-4.5 rounded-xl text-rose-400 text-xs mb-8 flex gap-3 items-start" id="error-banner">
            <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm">System Node Error</span>
              <p className="mt-0.5 leading-relaxed text-slate-300">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Viewport content */}
        <main className="relative z-10" id="main-viewport">
          <AnimatePresence mode="wait">
            {activeTab === "assessor" && (
              <motion.div
                key="assessor-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {assessmentResult ? (
                  <AssessmentReport
                    report={assessmentResult}
                    onReset={handleClearSession}
                    onNavigateToChat={() => setActiveTab("chat")}
                  />
                ) : (
                  <div className="bg-slate-900/10 border border-slate-900 rounded-3xl p-6 md:p-10 shadow-xl max-w-4xl mx-auto">
                    <div className="mb-10 text-center space-y-3">
                      <div className="inline-flex p-3 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">Begin Your Systems Audit</h2>
                      <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                        Complete this brief questionnaire to assess business priorities, evaluate technical skill barriers, and generate custom AI recommendations with an executable roadmap.
                      </p>
                    </div>
                    <AssessmentForm
                      onSubmit={handleAssessmentSubmit}
                      isSubmitting={isSubmitting}
                    />
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "explorer" && (
              <motion.div
                key="explorer-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <ToolsExplorer 
                  onSuggestTool={(tool) => {
                    setActiveTab("chat");
                  }}
                />
              </motion.div>
            )}

            {activeTab === "chat" && (
              <motion.div
                key="chat-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <AuditorChat assessmentResult={assessmentResult} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16 py-8 text-center text-[10px] text-slate-500 font-mono tracking-widest relative z-10" id="main-footer">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <span>© 2026 AI SYSTEMS AUDITOR • BUSINESS COMPLIANCE HUB</span>
            <span className="hidden md:inline text-white/10">|</span>
            <span className="uppercase text-slate-600">Licensed to: Global Intelligence Partners</span>
          </div>
          <div className="flex gap-4">
            <span className="uppercase tracking-widest font-mono text-slate-600">STX-990-AUDIT-LOCKED</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>SYSTEMS INTEGRITY: OPTIMIZED</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
