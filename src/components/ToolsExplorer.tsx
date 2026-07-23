import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CURATED_TOOLS } from "../data/curatedTools";
import { CuratedTool } from "../types";
import { 
  Search, 
  Sparkles, 
  Code, 
  HelpCircle, 
  ExternalLink, 
  Plus, 
  Minus,
  Check, 
  Grid, 
  FileText,
  Workflow, 
  Video, 
  Mic, 
  ArrowRight,
  Database
} from "lucide-react";

interface ToolsExplorerProps {
  onSuggestTool: (tool: CuratedTool) => void;
}

export const ToolsExplorer: React.FC<ToolsExplorerProps> = ({ onSuggestTool }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [compareList, setCompareList] = useState<CuratedTool[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Categories list derived from tools
  const categories = useMemo(() => {
    const list = new Set(CURATED_TOOLS.map(t => t.category));
    return ["All", ...Array.from(list)];
  }, []);

  // Filter tools
  const filteredTools = useMemo(() => {
    return CURATED_TOOLS.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tool.bestFor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "All" || tool.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  // Handle comparison selection
  const toggleCompare = (tool: CuratedTool) => {
    setCompareList(prev => {
      const isComparing = prev.some(t => t.id === tool.id);
      if (isComparing) {
        return prev.filter(t => t.id !== tool.id);
      } else {
        if (prev.length >= 3) {
          alert("You can compare up to 3 tools at a time.");
          return prev;
        }
        return [...prev, tool];
      }
    });
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Zero-Code": return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
      case "Low-Code": return "text-amber-400 border-amber-500/20 bg-amber-500/5";
      default: return "text-blue-400 border-blue-500/20 bg-blue-500/5";
    }
  };

  const getCategoryIcon = (category: string) => {
    const catLower = category.toLowerCase();
    if (catLower.includes("writing") || catLower.includes("productivity")) return FileText;
    if (catLower.includes("automation")) return Workflow;
    if (catLower.includes("api") || catLower.includes("developer")) return Code;
    if (catLower.includes("video") || catLower.includes("image")) return Video;
    if (catLower.includes("audio")) return Mic;
    return Sparkles;
  };

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto pb-16" id="explorer-container">
      {/* Search and Filters Header */}
      <div className="bg-white/[0.02] border border-white/10 rounded-sm p-6 space-y-5" id="explorer-header">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <h1 className="text-xl font-serif italic text-white tracking-wide">AI Tools Curation Hub</h1>
            <p className="text-xs text-slate-400 mt-0.5">Filter, search, and compare industry-grade models and automation integrations.</p>
          </div>
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tools, capabilities, or pricing..."
              className="w-full bg-black border border-white/10 rounded-sm py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans"
            />
          </div>
        </div>

        {/* Filter Categories and Difficulty */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-white/5">
          <div className="flex flex-wrap gap-1.5 flex-1">
            {categories.map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-medium border transition-colors cursor-pointer ${
                    isSelected 
                      ? "bg-amber-500 text-black border-amber-500" 
                      : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Difficulty Dropdown filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Skill Requirement</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-black border border-white/10 rounded-sm text-xs text-slate-300 py-1.5 px-2 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="All">All Levels</option>
              <option value="Zero-Code">Zero-Code (No Tech)</option>
              <option value="Low-Code">Low-Code (Slight Tech)</option>
              <option value="Developer">Developer (Coding)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Compare Tray Banner */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bg-amber-500/5 border border-amber-500/20 rounded-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
            id="compare-tray"
          >
            <div className="flex items-center gap-3">
              <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-sm border border-amber-500/20">
                <Database className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-white block">Compare AI Tool Specs</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  You have selected <span className="text-amber-400 font-bold">{compareList.length}</span> of 3 tools to compare side-by-side.
                </span>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex gap-1.5 bg-black/40 p-1 rounded-sm border border-white/5">
                {compareList.map(t => (
                  <div key={t.id} className="flex items-center gap-1.5 bg-white/5 border border-white/10 py-1 px-2.5 rounded-sm text-[11px] text-slate-300">
                    <span>{t.name.split(" ")[0]}</span>
                    <button onClick={() => toggleCompare(t)} className="text-slate-500 hover:text-rose-400 cursor-pointer">
                      <Minus className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowCompareModal(true)}
                className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold py-2 px-4 rounded-sm transition-colors cursor-pointer active:scale-95 uppercase tracking-wider"
              >
                Launch Matrix
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Curated Grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16 bg-white/[0.01] border border-white/10 rounded-sm" id="no-tools">
          <HelpCircle className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <h3 className="text-slate-300 font-semibold text-sm">No curated tools fit your query</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-normal">
            Try adjusting your category search term or selecting 'All' in the skills level filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="tools-grid">
          {filteredTools.map((tool, idx) => {
            const CatIcon = getCategoryIcon(tool.category);
            const isComparing = compareList.some(t => t.id === tool.id);
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="bg-white/[0.02] border border-white/10 hover:border-white/20 rounded-sm p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3.5">
                  <div className="flex justify-between items-start gap-3">
                    <div className="p-2 bg-black rounded-sm border border-white/10">
                      <CatIcon className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-sm font-mono border ${getDifficultyColor(tool.difficulty)}`}>
                      {tool.difficulty}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">{tool.name}</h3>
                    <span className="text-[10px] font-mono text-slate-500 mt-0.5 block">{tool.category}</span>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed">{tool.description}</p>

                  <div className="space-y-1.5 bg-black/40 p-3 rounded-sm border border-white/5 text-xs">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Primary Best For</span>
                    <span className="text-slate-300 leading-relaxed block">{tool.bestFor}</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Key Specs / Features</span>
                    <ul className="space-y-1 text-xs text-slate-400">
                      {tool.features.map((feat, i) => (
                        <li key={i} className="flex gap-2 items-start leading-snug">
                          <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 flex gap-2">
                  <button
                    onClick={() => toggleCompare(tool)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs rounded-sm border transition-all active:scale-95 cursor-pointer ${
                      isComparing 
                        ? "bg-amber-500/10 border-amber-500 text-amber-400 font-semibold" 
                        : "bg-black hover:bg-white/5 border-white/10 text-slate-300 hover:text-white"
                    }`}
                  >
                    {isComparing ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        <span>Compare Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Compare</span>
                      </>
                    )}
                  </button>
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-black hover:bg-white/5 border border-white/10 text-slate-400 hover:text-white rounded-sm transition-colors active:scale-95"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Side-by-Side Comparison Matrix Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="matrix-modal">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCompareModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-black border border-white/10 rounded-sm w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-serif italic text-white tracking-wide">AI Capability Comparison Matrix</h2>
                  <p className="text-xs text-slate-500">Evaluating features, pricing, and technical curves side-by-side.</p>
                </div>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-sm transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              {/* Matrix Table Grid */}
              <div className="p-6 overflow-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 px-4 font-mono text-slate-500 uppercase tracking-wider w-1/4">Spec Parameter</th>
                      {compareList.map(tool => (
                        <th key={tool.id} className="py-3 px-4 text-sm font-bold text-white w-1/4">
                          {tool.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    <tr>
                      <td className="py-4 px-4 font-mono text-slate-400 uppercase tracking-widest text-[10px]">Category</td>
                      {compareList.map(t => (
                        <td key={t.id} className="py-4 px-4 font-medium">{t.category}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-mono text-slate-400 uppercase tracking-widest text-[10px]">Primary Focus</td>
                      {compareList.map(t => (
                        <td key={t.id} className="py-4 px-4 leading-relaxed">{t.bestFor}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-mono text-slate-400 uppercase tracking-widest text-[10px]">Skill Barrier</td>
                      {compareList.map(t => (
                        <td key={t.id} className="py-4 px-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded-sm font-mono border ${getDifficultyColor(t.difficulty)}`}>
                            {t.difficulty}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-mono text-slate-400 uppercase tracking-widest text-[10px]">Core Features</td>
                      {compareList.map(t => (
                        <td key={t.id} className="py-4 px-4">
                          <ul className="space-y-1 text-[11px] text-slate-400">
                            {t.features.map((feat, i) => (
                              <li key={i} className="flex gap-1.5 items-start">
                                <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-mono text-slate-400 uppercase tracking-widest text-[10px]">Pricing Model</td>
                      {compareList.map(t => (
                        <td key={t.id} className="py-4 px-4 leading-normal text-amber-400 font-medium">{t.pricing}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-mono text-slate-400 uppercase tracking-widest text-[10px]">Strategic Advice</td>
                      {compareList.map(t => (
                        <td key={t.id} className="py-4 px-4 text-slate-400 leading-relaxed text-[11px]">{t.description}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 flex justify-end gap-2.5 bg-black/80">
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 py-2.5 px-4 rounded-sm text-xs font-semibold cursor-pointer active:scale-95 transition-all"
                >
                  Close Matrix
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
