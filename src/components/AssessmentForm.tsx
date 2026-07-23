import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QuestionnaireAnswers } from "../types";
import { 
  Building2, 
  Users, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldAlert, 
  BrainCircuit, 
  Sparkles, 
  BadgeDollarSign, 
  Briefcase 
} from "lucide-react";

interface AssessmentFormProps {
  onSubmit: (answers: QuestionnaireAnswers) => void;
  isSubmitting: boolean;
}

const INDUSTRIES = [
  { value: "Technology & Software", icon: BrainCircuit, desc: "SaaS, mobile apps, hardware, IT services" },
  { value: "Retail & E-commerce", icon: Building2, desc: "Physical stores, online storefronts, distribution" },
  { value: "Professional Services", icon: Briefcase, desc: "Legal, accounting, consulting, marketing agencies" },
  { value: "Healthcare & Biotech", icon: ShieldAlert, desc: "Clinics, wellness platforms, medical diagnostics" },
  { value: "Creative, Design & Media", icon: Sparkles, desc: "Agencies, content creators, media publishers" },
  { value: "Education & Non-Profit", icon: Users, desc: "Schools, online academies, community foundations" }
];

const COMPANY_SIZES = [
  { value: "Solopreneur / Founder (1)", label: "Solo Operator" },
  { value: "Small Team (2 - 20)", label: "Agile Startup / Agency" },
  { value: "Medium Business (21 - 100)", label: "Scaling Enterprise" },
  { value: "Enterprise (100+)", label: "Large Organization" }
];

const BUSINESS_GOALS = [
  { value: "Content Creation & Copywriting", label: "Scale marketing drafts, blogs, emails & ad copy" },
  { value: "Customer Support & Communication", label: "Deploy smart chatbots, email routers & Q&A help desks" },
  { value: "Data Analysis & Business Intelligence", label: "Parse heavy spreadsheets, compile KPI reports & query insights" },
  { value: "Software Development & Tech Support", label: "Generate React components, auto-document code & draft scripts" },
  { value: "Workflow Automation & Operations", label: "Link apps via trigger-action visual workflows to eliminate manual data entry" },
  { value: "Design & Multimedia Production", label: "Create cinematic video trailers, vector art & realistic voice voiceovers" }
];

const TECH_LEVELS = [
  { value: "Non-technical (need simple UI / zero-code)", label: "Zero-Code Focus", desc: "No coding expertise. We need plug-and-play SaaS with simple graphical buttons." },
  { value: "Average (can use spreadsheets, basic API keys)", label: "Low-Code Friendly", desc: "Can manage API keys, configure visual nodes, and run basic spreadsheet macros." },
  { value: "Technical (developers on team, can write code)", label: "Developer Capable", desc: "Full-stack programmers on staff. Can handle SDKs, build custom web proxies, and use APIs." }
];

const BUDGETS = [
  { value: "Minimal / Free tiers only", label: "Free / Under $20/mo", desc: "Maximum focus on open-source, community nodes, and comprehensive free trial tiers." },
  { value: "Moderate ($50 - $200 / user or tool)", label: "Pro / Up to $200/mo", desc: "Can purchase individual seat licenses for premium assistants and paid automators." },
  { value: "Substantial ($200 - $1000+)", label: "Enterprise Ready", desc: "Willing to invest in dedicated team contracts, customized models, and secure databases." }
];

const COMPLIANCE_OPTIONS = [
  { value: "Standard / No specific requirements", label: "Standard Privacy", desc: "No complex audits required. Focus is pure efficiency." },
  { value: "Strict (GDPR, HIPAA, SOC2, proprietary data security)", label: "Strict Compliance & IP Protection", desc: "Data privacy is critical. We need zero data retention, local offline options, or dedicated enterprise servers." }
];

export const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit, isSubmitting }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({
    goals: []
  });

  const nextStep = () => setStep((s) => Math.min(4, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const selectIndustry = (industry: string) => {
    setAnswers(prev => ({ ...prev, industry }));
  };

  const selectCompanySize = (companySize: string) => {
    setAnswers(prev => ({ ...prev, companySize }));
  };

  const toggleGoal = (goal: string) => {
    setAnswers(prev => {
      const currentGoals = prev.goals || [];
      const updatedGoals = currentGoals.includes(goal)
        ? currentGoals.filter(g => g !== goal)
        : [...currentGoals, goal];
      return { ...prev, goals: updatedGoals };
    });
  };

  const selectTechSkill = (techSkillLevel: string) => {
    setAnswers(prev => ({ ...prev, techSkillLevel }));
  };

  const selectBudget = (budget: string) => {
    setAnswers(prev => ({ ...prev, budget }));
  };

  const selectCompliance = (compliance: string) => {
    setAnswers(prev => ({ ...prev, compliance }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!answers.industry && !!answers.companySize;
      case 2:
        return (answers.goals || []).length > 0;
      case 3:
        return !!answers.techSkillLevel;
      case 4:
        return !!answers.budget && !!answers.compliance;
      default:
        return false;
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStepValid()) {
      onSubmit(answers as QuestionnaireAnswers);
    }
  };

  // Apple-like transition springs
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 150 : -150,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0.15,
        duration: 0.45
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -150 : 150,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.25
      }
    })
  };

  return (
    <div className="w-full max-w-3xl mx-auto" id="assessment-container">
      {/* Step Header */}
      <div className="mb-8" id="step-header">
        <div className="flex justify-between items-center text-xs text-slate-400 font-mono tracking-widest uppercase mb-3">
          <span>AI Audit Assessor</span>
          <span>Step {step} of 4</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`h-full flex-1 rounded-full transition-all duration-300 ${
                i <= step ? "bg-amber-500" : "bg-white/5"
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="relative min-h-[460px] overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && (
              <motion.div
                key="step1"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6"
                id="step-1-panel"
              >
                <div>
                  <h2 className="text-2xl font-serif italic text-white tracking-wide">
                    Tell us about your organization
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Select your industry segment and core team size to baseline your requirements.
                  </p>
                </div>

                {/* Industry Selection */}
                <div className="space-y-3">
                  <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
                    What industry best describes your team?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {INDUSTRIES.map((ind) => {
                      const Icon = ind.icon;
                      const isSelected = answers.industry === ind.value;
                      return (
                        <button
                          key={ind.value}
                          type="button"
                          onClick={() => selectIndustry(ind.value)}
                          className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer ${
                            isSelected
                              ? "bg-amber-500/5 border-amber-500/80 text-white shadow-[0_0_15px_rgba(212,175,55,0.05)]"
                              : "bg-white/[0.02] border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/[0.04]"
                          }`}
                          style={{ transitionProperty: "transform, border-color, background-color" }}
                        >
                          <div className={`p-2 rounded-lg ${isSelected ? "bg-amber-500/10 text-amber-400" : "bg-white/5 text-slate-400"}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-medium block text-sm">{ind.value}</span>
                            <span className="text-xs text-slate-400 block mt-0.5 leading-snug">{ind.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Company Size */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
                    What is your approximate organization size?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {COMPANY_SIZES.map((size) => {
                      const isSelected = answers.companySize === size.value;
                      return (
                        <button
                          key={size.value}
                          type="button"
                          onClick={() => selectCompanySize(size.value)}
                          className={`p-3 rounded-lg border text-center transition-all active:scale-[0.97] cursor-pointer ${
                            isSelected
                              ? "bg-amber-500/5 border-amber-500/80 text-white font-medium shadow-[0_0_15px_rgba(212,175,55,0.05)]"
                              : "bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/[0.04]"
                          }`}
                        >
                          <span className="text-xs block text-slate-300 font-mono mb-1">{size.label}</span>
                          <span className="text-sm block">{size.value.split(" (")[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6"
                id="step-2-panel"
              >
                <div>
                  <h2 className="text-2xl font-serif italic text-white tracking-wide">
                    Identify your primary AI goals
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Select all operational processes where you seek custom AI tools, automations, or content boosters.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                      Business Goals (Select at least one)
                    </label>
                    <span className="text-xs text-slate-500 font-mono">
                      {(answers.goals || []).length} selected
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {BUSINESS_GOALS.map((goal) => {
                      const isSelected = (answers.goals || []).includes(goal.value);
                      return (
                        <button
                          key={goal.value}
                          type="button"
                          onClick={() => toggleGoal(goal.value)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all active:scale-[0.99] cursor-pointer ${
                            isSelected
                              ? "bg-amber-500/5 border-amber-500/80 text-white shadow-[0_0_15px_rgba(212,175,55,0.05)]"
                              : "bg-white/[0.02] border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className="pr-4">
                            <span className="font-medium text-sm block">{goal.value}</span>
                            <span className="text-xs text-slate-400 mt-0.5 block leading-snug">{goal.label}</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                            isSelected ? "bg-amber-500 border-amber-500 text-black" : "border-white/10 bg-black/40"
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6"
                id="step-3-panel"
              >
                <div>
                  <h2 className="text-2xl font-serif italic text-white tracking-wide">
                    Gauge technical capabilities
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Your team's technical depth ensures recommended tools are immediately implementable, not paralyzing.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
                    What is the technical capability of your team?
                  </label>
                  <div className="space-y-3">
                    {TECH_LEVELS.map((level) => {
                      const isSelected = answers.techSkillLevel === level.value;
                      return (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => selectTechSkill(level.value)}
                          className={`w-full flex items-start gap-4 p-5 rounded-xl border text-left transition-all active:scale-[0.99] cursor-pointer ${
                            isSelected
                              ? "bg-amber-500/5 border-amber-500/80 text-white shadow-[0_0_15px_rgba(212,175,55,0.05)]"
                              : "bg-white/[0.02] border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? "border-amber-500 bg-amber-500 text-black" : "border-white/10 bg-black/40"
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                          </div>
                          <div>
                            <span className="font-mono text-xs text-amber-400 uppercase tracking-widest block mb-0.5">{level.label}</span>
                            <span className="font-semibold text-sm block text-white">{level.value}</span>
                            <span className="text-xs text-slate-400 mt-1 block leading-snug">{level.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6"
                id="step-4-panel"
              >
                <div>
                  <h2 className="text-2xl font-serif italic text-white tracking-wide">
                    Budget & Regulatory parameters
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Compliance limits and budgets frame the scope of secure options (like enterprise Zero Data Retention layers).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Budget */}
                  <div className="space-y-3">
                    <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
                      Target Monthly AI Budget
                    </label>
                    <div className="space-y-2.5">
                      {BUDGETS.map((bud) => {
                        const isSelected = answers.budget === bud.value;
                        return (
                          <button
                            key={bud.value}
                            type="button"
                            onClick={() => selectBudget(bud.value)}
                            className={`w-full flex flex-col p-4 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer ${
                              isSelected
                                ? "bg-amber-500/5 border-amber-500/80 text-white shadow-[0_0_15px_rgba(212,175,55,0.05)]"
                                : "bg-white/[0.02] border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/[0.04]"
                            }`}
                          >
                            <span className="font-mono text-xs text-amber-400 mb-0.5">{bud.label}</span>
                            <span className="font-semibold text-xs text-white">{bud.value}</span>
                            <span className="text-[11px] text-slate-400 mt-1 leading-snug">{bud.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Compliance */}
                  <div className="space-y-3">
                    <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
                      Compliance & Data Security level
                    </label>
                    <div className="space-y-2.5">
                      {COMPLIANCE_OPTIONS.map((comp) => {
                        const isSelected = answers.compliance === comp.value;
                        return (
                          <button
                            key={comp.value}
                            type="button"
                            onClick={() => selectCompliance(comp.value)}
                            className={`w-full flex flex-col p-4 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer ${
                              isSelected
                                ? "bg-amber-500/5 border-amber-500/80 text-white shadow-[0_0_15px_rgba(212,175,55,0.05)]"
                                : "bg-white/[0.02] border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/[0.04]"
                            }`}
                          >
                            <span className="font-mono text-xs text-amber-400 mb-0.5">{comp.label}</span>
                            <span className="font-semibold text-xs text-white line-clamp-1">{comp.value.split(" (")[0]}</span>
                            <span className="text-[11px] text-slate-400 mt-1 leading-snug">{comp.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Additional Text */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
                    Any additional business context or constraints? (Optional)
                  </label>
                  <textarea
                    value={answers.additionalContext || ""}
                    onChange={(e) => setAnswers(prev => ({ ...prev, additionalContext: e.target.value }))}
                    placeholder="E.g., We use Salesforce and need integrations. Or: We are highly worried about customer data leaking to public LLMs..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 h-20 resize-none font-sans"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center border-t border-white/10 mt-8 pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              disabled={isSubmitting}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors bg-white/5 border border-white/10 hover:border-white/20 py-2.5 px-4 rounded-xl active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!isStepValid()}
              className="flex items-center gap-2 text-sm font-semibold text-black bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:hover:bg-amber-500 py-2.5 px-5 rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!isStepValid() || isSubmitting}
              className="flex items-center gap-2 text-sm font-bold text-black bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-40 py-3 px-6 rounded-xl transition-all active:scale-95 cursor-pointer shadow-lg shadow-amber-500/10"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Auditing Systems...</span>
                </>
              ) : (
                <>
                  <span>Generate AI Strategy</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
