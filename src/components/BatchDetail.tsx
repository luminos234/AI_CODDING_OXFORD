/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MeetingBatch, SeverityType, PriorityType } from '../types';
import AbstractArtwork from './AbstractArtwork';
import { formatDate } from './BatchCard';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  ListChecks, 
  FileText, 
  Files, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Download,
  Award,
  Copy,
  Check
} from 'lucide-react';

interface BatchDetailProps {
  batch: MeetingBatch;
  onBack: () => void;
  onToggleTask: (id: string, actionItemText: string) => void;
}

type TabType = "Summary" | "Decisions" | "Risks" | "TalkingPoints" | "NextSteps" | "Files";

export default function BatchDetail({ batch, onBack, onToggleTask }: BatchDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>("Summary");
  const [copied, setCopied] = useState(false);

  if (!batch) return null;

  const intel = batch.intelligence;

  // Render when a batch has no intelligence because it is still processing
  if (batch.status === "Processing" || !intel) {
    return (
      <div className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto w-full flex flex-col items-center justify-center h-[70vh] space-y-4 text-center">
        <div className="w-16 h-16 rounded-full bg-workspace-blue/10 flex items-center justify-center text-workspace-blue border border-workspace-blue/20 animate-pulse">
          <Sparkles className="w-8 h-8 animate-spin" />
        </div>
        <h3 className="serif-font text-xl font-bold text-workspace-brown">
          Analyzing Extraction Pipeline Assets...
        </h3>
        <p className="text-xs text-workspace-charcoal/60 max-w-sm leading-relaxed">
          The server is parsing raw PDF/PPTX layouts, running optical structure checks, and extracting dynamic semantic intelligence. This will refresh automatically.
        </p>
      </div>
    );
  }

  const getSeverityBadge = (level: SeverityType) => {
    switch (level) {
      case "High": return "bg-red-50 text-red-700 border-red-200/60";
      case "Medium": return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "Low": return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      default: return "bg-workspace-beige text-workspace-brown border-workspace-sand";
    }
  };

  const getPriorityBadge = (priority: PriorityType) => {
    switch (priority) {
      case "High": return "bg-red-50 text-red-700 border-red-100";
      case "Medium": return "bg-[#FDF6E2] text-[#B58900] border-[#F9F0D0]";
      case "Low": return "bg-[#EEF7F2] text-[#2E7D32] border-[#D4EDDA]";
      default: return "bg-workspace-cream text-workspace-charcoal/70 border-workspace-sand/50";
    }
  };

  const copyToClipboard = () => {
    if (intel.follow_up_message) {
      navigator.clipboard.writeText(intel.follow_up_message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-8 animate-fade-in selection:bg-workspace-sand/40">
      
      {/* Top Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-workspace-sand/65 pb-5">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-xs font-mono font-bold text-workspace-charcoal/65 hover:text-workspace-terracotta transition-colors"
          id="btn-back-to-archives"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Workspace Archive</span>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-mono text-workspace-charcoal/40 uppercase tracking-widest">
            SECURE BRIEFING DOSSIER
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-workspace-sage/15 text-workspace-sage border border-workspace-sage/20 text-xxs font-mono">
            {batch.status}
          </span>
        </div>
      </div>

      {/* Main Title Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="serif-font text-2xl sm:text-3xl font-extrabold text-workspace-charcoal tracking-tight sm:leading-tight">
              {batch.title}
            </h1>
            <div className="flex items-center gap-3.5 mt-2 flex-wrap text-xxs font-mono text-workspace-charcoal/65">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-workspace-terracotta" />
                <span>Created {formatDate(batch.dateCreated)}</span>
              </div>
              <span className="opacity-40">•</span>
              <div className="flex items-center gap-1">
                <Files className="w-3.5 h-3.5 text-workspace-blue" />
                <span>Includes {batch.filesCount} file briefs</span>
              </div>
            </div>
          </div>

          {/* Attendee indicators */}
          <div className="flex items-center gap-1 shrink-0 bg-workspace-cream border border-workspace-sand px-3 py-1.5 rounded-xl text-xxs select-none">
            <span className="font-semibold text-workspace-brown pr-1.5">Executive Panel:</span>
            <div className="flex -space-x-1.5">
              <img className="w-5.5 h-5.5 rounded-full object-cover border border-workspace-cream" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" referrerPolicy="no-referrer" alt="Attendee" />
              <img className="w-5.5 h-5.5 rounded-full object-cover border border-workspace-cream" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150" referrerPolicy="no-referrer" alt="Attendee" />
              <img className="w-5.5 h-5.5 rounded-full object-cover border border-workspace-cream" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150" referrerPolicy="no-referrer" alt="Attendee" />
            </div>
            <span className="text-workspace-charcoal/50 font-bold pl-1">+4</span>
          </div>
        </div>
      </div>

      {/* Tabs Layout panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Custom tabs selector */}
        <div className="lg:col-span-3 space-y-2 bg-workspace-cream border border-workspace-sand p-3.5 rounded-xl select-none">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F7466] font-bold block px-2.5 mb-2">
            Intelligence Layers
          </span>
          
          <button
            onClick={() => setActiveTab("Summary")}
            className={`w-full flex items-center gap-3.5 text-xs font-semibold px-3 py-2.5 rounded-lg border text-left transition-all ${
              activeTab === "Summary"
                ? 'bg-workspace-brown text-workspace-cream border-workspace-brown shadow-2xs'
                : 'bg-workspace-cream border-transparent text-workspace-charcoal/80 hover:bg-workspace-sand/55 hover:text-workspace-brown'
            }`}
          >
            <FileText className="w-4.5 h-4.5 shrink-0" />
            <span>1. Executive Summary</span>
          </button>

          <button
            onClick={() => setActiveTab("Decisions")}
            className={`w-full flex items-center gap-3.5 text-xs font-semibold px-3 py-2.5 rounded-lg border text-left transition-all ${
              activeTab === "Decisions"
                ? 'bg-workspace-brown text-workspace-cream border-workspace-brown shadow-2xs'
                : 'bg-workspace-cream border-transparent text-workspace-charcoal/80 hover:bg-workspace-sand/55 hover:text-workspace-brown'
            }`}
          >
            <CheckCircle className="w-4.5 h-4.5 shrink-0" />
            <span>2. Decisions & Questions</span>
          </button>

          <button
            onClick={() => setActiveTab("Risks")}
            className={`w-full flex items-center gap-3.5 text-xs font-semibold px-3 py-2.5 rounded-lg border text-left transition-all ${
              activeTab === "Risks"
                ? 'bg-workspace-brown text-workspace-cream border-workspace-brown shadow-2xs'
                : 'bg-workspace-cream border-transparent text-workspace-charcoal/80 hover:bg-workspace-sand/55 hover:text-workspace-brown'
            }`}
          >
            <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
            <span>3. Risks & Concerns</span>
          </button>

          <button
            onClick={() => setActiveTab("TalkingPoints")}
            className={`w-full flex items-center gap-3.5 text-xs font-semibold px-3 py-2.5 rounded-lg border text-left transition-all ${
              activeTab === "TalkingPoints"
                ? 'bg-workspace-brown text-workspace-cream border-workspace-brown shadow-2xs'
                : 'bg-workspace-cream border-transparent text-workspace-charcoal/80 hover:bg-workspace-sand/55 hover:text-workspace-brown'
            }`}
          >
            <Award className="w-4.5 h-4.5 shrink-0" />
            <span>4. Key Talking Points</span>
          </button>

          <button
            onClick={() => setActiveTab("NextSteps")}
            className={`w-full flex items-center gap-3.5 text-xs font-semibold px-3 py-2.5 rounded-lg border text-left transition-all ${
              activeTab === "NextSteps"
                ? 'bg-workspace-brown text-workspace-cream border-workspace-brown shadow-2xs'
                : 'bg-workspace-cream border-transparent text-workspace-charcoal/80 hover:bg-workspace-sand/55 hover:text-workspace-brown'
            }`}
          >
            <ListChecks className="w-4.5 h-4.5 shrink-0" />
            <span>5. Action Checklist</span>
          </button>

          <button
            onClick={() => setActiveTab("Files")}
            className={`w-full flex items-center gap-3.5 text-xs font-semibold px-3 py-2.5 rounded-lg border text-left transition-all ${
              activeTab === "Files"
                ? 'bg-workspace-brown text-workspace-cream border-workspace-brown shadow-2xs'
                : 'bg-workspace-cream border-transparent text-workspace-charcoal/80 hover:bg-workspace-sand/55 hover:text-workspace-brown'
            }`}
          >
            <Files className="w-4.5 h-4.5 shrink-0" />
            <span>6. Uploaded Briefs</span>
          </button>

          {/* Watermark inside column selector */}
          <div className="pt-4 mt-3 border-t border-workspace-sand/60 px-2 space-y-3">
            <span className="text-[10px] font-mono text-[#8F7466] uppercase block">
              Intelligence Provenance
            </span>
            
            {intel.generationSource === "ai" ? (
              <div className="bg-[#8A9A5B]/5 border border-[#8A9A5B]/30 rounded-lg p-3 space-y-1.5 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8A9A5B] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8A9A5B]"></span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#55632E] uppercase tracking-wide">
                    Gemini Live Model
                  </span>
                </div>
                <div className="space-y-1.5 text-[9px] text-[#55632E]/80 leading-normal font-sans">
                  {typeof intel.extractedCharactersCount === 'number' && (
                    <>
                      <div className="flex justify-between items-center bg-[#8A9A5B]/5 p-1 rounded">
                        <span className="text-[8px] text-workspace-charcoal/70 uppercase">Files Parsed:</span>
                        <strong className="font-bold text-[#3E4A1C]">{intel.extractedFileCount || 1}</strong>
                      </div>
                      <div className="flex justify-between items-center bg-[#8A9A5B]/5 p-1 rounded">
                        <span className="text-[8px] text-workspace-charcoal/70 uppercase">Full Extract:</span>
                        <strong className="font-bold text-[#3E4A1C]">{(intel.extractedCharactersCount / 1024).toFixed(1)} KB text</strong>
                      </div>
                    </>
                  )}
                  <span className="block pt-0.5 italic">
                    ✓ Real structural extraction executed directly.
                  </span>
                </div>
              </div>
            ) : intel.generationSource === "fallback" ? (
              <div className="bg-[#B97455]/5 border border-[#B97455]/30 rounded-lg p-3 space-y-1.5 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B97455]"></span>
                  <span className="text-[10px] font-mono font-bold text-[#B97455] uppercase tracking-wide">
                    Diagnostic Backup
                  </span>
                </div>
                <p className="text-[9px] text-[#3D3A35]/80 leading-relaxed font-sans">
                  The workspace executed a graceful fallback because no raw credentials were declared. Content was resolved locally.
                </p>
              </div>
            ) : (
              <div className="bg-[#7E97A6]/5 border border-[#7E97A6]/30 rounded-lg p-3 space-y-1.5 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7E97A6]"></span>
                  <span className="text-[10px] font-mono font-bold text-[#7E97A6] uppercase tracking-wide">
                    Standard Archive
                  </span>
                </div>
                <p className="text-[9px] text-[#3D3A35]/80 leading-relaxed font-sans">
                  This record is a pre-analyzed template shipped with standard corporate compliance vectors.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 9 Columns: Live Content Area */}
        <div className="lg:col-span-9 bg-workspace-card border border-workspace-sand/85 p-6 sm:p-8 rounded-2xl min-h-[500px]">
          
          {/* TAB 1: EXECUTIVE SUMMARY */}
          {activeTab === "Summary" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="border-b border-workspace-sand pb-4">
                <h3 className="serif-font text-lg font-bold text-workspace-brown mb-1 flex items-center gap-2">
                  <FileText className="w-5.5 h-5.5 text-workspace-terracotta" />
                  <span>Executive Summary & Strategic Takeaways</span>
                </h3>
                <p className="text-xs text-workspace-charcoal/65 font-mono">
                  Synthesized core takeaways, meeting purpose overview, and official correspondence drafts
                </p>
              </div>

              {/* Cover visual decorative header */}
              <div className="rounded-xl overflow-hidden shadow-2xs border border-workspace-sand/30">
                <AbstractArtwork 
                  title={batch.title} 
                  paletteNames={["sage green", "sand", "soft gold", "warm beige"]} 
                  height={120} 
                />
              </div>

              {/* Key Takeaways */}
              {intel.key_takeaways && intel.key_takeaways.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#8F7466] font-mono uppercase tracking-wider block">
                    Strategic Key Takeaways
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {intel.key_takeaways.map((takeaway, i) => (
                      <div key={i} className="flex gap-2.5 p-3.5 bg-workspace-cream border border-workspace-sand/50 rounded-lg text-xs leading-relaxed text-workspace-charcoal/90">
                        <Sparkles className="w-4 h-4 text-workspace-terracotta shrink-0 mt-0.5" />
                        <p>{takeaway}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Executive Summary bullet list */}
              {intel.meeting_summary && intel.meeting_summary.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-[#8F7466] font-mono uppercase tracking-wider block">
                    Meeting Summary & Conclusions
                  </h4>
                  <div className="space-y-2.5">
                    {intel.meeting_summary.map((point, i) => (
                      <div key={i} className="flex gap-3 bg-workspace-cream/30 p-3.5 border border-workspace-sand/40 rounded-lg">
                        <span className="text-xs font-mono text-workspace-terracotta font-semibold shrink-0 select-none">
                          0{i + 1}.
                        </span>
                        <p className="text-xs text-workspace-charcoal/85 font-sans leading-relaxed">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Official professional follow up message */}
              {intel.follow_up_message && (
                <div className="space-y-3 pt-4 border-t border-workspace-sand/50">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-workspace-sage font-mono uppercase tracking-wider">
                      Official Executive Correspondence Draft
                    </h4>
                    <button
                      onClick={copyToClipboard}
                      className="text-xxs font-mono flex items-center gap-1.5 px-2 py-1 rounded bg-workspace-cream border border-workspace-sand/70 text-workspace-charcoal hover:text-workspace-brown hover:bg-workspace-sand/30 transition-all cursor-pointer select-none"
                      title="Copy message to clipboard"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-workspace-sage" />
                          <span className="text-workspace-sage">Copied Message!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#A88C80]" />
                          <span>Copy Correspondence</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 bg-[rgba(138,155,128,0.04)] border border-workspace-sage/20 rounded-xl relative">
                    <p className="serif-font italic text-xs leading-relaxed text-[#2F3A2C] font-medium whitespace-pre-line">
                      "{intel.follow_up_message}"
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-workspace-charcoal/50 block text-right font-light italic select-none">
                    * Ideal for immediate distribution via Email, MS Teams, Slack, or secure legal briefs.
                  </span>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: DECISIONS & QUESTIONS */}
          {activeTab === "Decisions" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="border-b border-workspace-sand pb-4">
                <h3 className="serif-font text-lg font-bold text-workspace-brown mb-1 flex items-center gap-2">
                  <CheckCircle className="w-5.5 h-5.5 text-workspace-terracotta" />
                  <span>Strategic Decisions & Open Inquiries</span>
                </h3>
                <p className="text-xs text-workspace-charcoal/65 font-mono">
                  Review finalized committee decisions with assigned owners and unresolved questions under consideration
                </p>
              </div>

              {/* Confirmed Decisions Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#8F7466] font-mono uppercase tracking-wider block">
                  Confirmed Executive Decisions
                </h4>
                
                {intel.decisions && intel.decisions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {intel.decisions.map((item, idx) => (
                      <div key={idx} className="border border-workspace-sand/80 bg-workspace-cream/40 p-4 rounded-xl space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex gap-2 items-start text-workspace-brown leading-normal">
                            <CheckCircle2 className="w-4 h-4 text-workspace-sage shrink-0 mt-0.5" />
                            <p className="text-xs font-semibold text-workspace-charcoal/90">
                              {item.decision}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-workspace-sand/30 text-xxs font-mono text-workspace-charcoal/60">
                          {item.owner && item.owner !== "Not specified" && (
                            <span className="px-1.5 py-0.5 bg-workspace-cream rounded border border-workspace-sand/40 font-medium">
                              Scope Owner: {item.owner}
                            </span>
                          )}
                          {item.deadline && item.deadline !== "Not specified" && (
                            <span className="px-1.5 py-0.5 bg-workspace-cream rounded border border-workspace-sand/40">
                              Target: {item.deadline}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-workspace-cream/50 rounded-xl text-center border border-workspace-sand/30">
                    <p className="text-xs text-workspace-charcoal/50">No confirmed decisions were explicitly recorded in the meeting context.</p>
                  </div>
                )}
              </div>

              {/* Unresolved Open Questions */}
              {intel.open_questions && intel.open_questions.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-workspace-sand/50">
                  <h4 className="text-xs font-bold text-workspace-terracotta font-mono uppercase tracking-wider block">
                    Unresolved Critical Questions
                  </h4>
                  <div className="p-4 bg-[rgba(200,122,83,0.03)] border border-workspace-terracotta/20 rounded-xl space-y-2.5">
                    {intel.open_questions.map((question, i) => (
                      <div key={i} className="flex gap-2.5 text-xs text-workspace-brown leading-relaxed items-start">
                        <HelpCircle className="w-4.5 h-4.5 text-workspace-terracotta shrink-0 mt-0.5" />
                        <span className="font-medium text-[#4E382E]">{question}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-workspace-charcoal/50 block select-none">
                    * Retaining operational list of answers to target ahead of the next committee session.
                  </span>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: RISK IDENTIFICATION */}
          {activeTab === "Risks" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="border-b border-workspace-sand pb-4">
                <h3 className="serif-font text-lg font-bold text-workspace-brown mb-1.5 flex items-center gap-2">
                  <AlertTriangle className="w-5.5 h-5.5 text-workspace-terracotta" />
                  <span>Operational Risks & Blockers</span>
                </h3>
                <p className="text-xs text-workspace-charcoal/65 font-mono">
                  Identified operational hurdles, down-stream impacts, and immediate mitigations
                </p>
              </div>

              {intel.risks_concerns && intel.risks_concerns.length > 0 ? (
                <div className="space-y-5">
                  {intel.risks_concerns.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="border border-workspace-sand bg-workspace-card p-5 rounded-xl space-y-3 hover:shadow-2xs transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-workspace-cream pb-2">
                        <div className="flex items-center gap-2.5">
                          <AlertCircle className={`w-4 h-4 ${item.severity === "High" ? "text-red-500" : item.severity === "Medium" ? "text-amber-500" : "text-emerald-500"}`} />
                          <h4 className="serif-font font-bold text-[14px] text-workspace-brown leading-none">
                            {item.risk}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2 py-0.5 text-[10px] font-mono rounded border ${getSeverityBadge(item.severity)}`}>
                            {item.severity} Risk
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1 bg-[#FDFCF9] p-3 rounded border border-workspace-sand/40">
                          <span className="text-[9px] font-mono text-workspace-charcoal/50 font-bold uppercase tracking-wider block">Downstream Impact</span>
                          <p className="text-workspace-charcoal/85 leading-relaxed">{item.impact || "Functional delays if left unchecked."}</p>
                        </div>

                        <div className="space-y-1 bg-[rgba(138,155,128,0.04)] p-3 rounded border border-workspace-sage/20">
                          <span className="text-[9px] font-mono text-workspace-sage/80 font-bold uppercase tracking-wider block">Structured Mitigation Tactic</span>
                          <p className="text-[#3D473A] font-medium leading-relaxed">{item.mitigation}</p>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="w-8 h-8 text-workspace-charcoal/20 mx-auto mb-2" />
                  <p className="text-xs text-workspace-charcoal/50">No structural operational threats were identified during document processing.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: KEY TALKING POINTS */}
          {activeTab === "TalkingPoints" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="border-b border-workspace-sand pb-4">
                <h3 className="serif-font text-lg font-bold text-workspace-brown mb-1.5 flex items-center gap-2">
                  <Award className="w-5.5 h-5.5 text-workspace-terracotta" />
                  <span>Key Talking Points & Alignment</span>
                </h3>
                <p className="text-xs text-workspace-charcoal/65 font-mono">
                  Guiding narrative anchors split by organizational audience vectors
                </p>
              </div>

              <div className="space-y-6">
                
                {/* 1. Internal alignment */}
                {intel.talking_points?.internal && intel.talking_points.internal.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-[#8F7466] font-mono uppercase tracking-wider block">
                      Internal Coordination Points (Team-facing)
                    </span>
                    <div className="bg-workspace-cream border border-workspace-sand rounded-xl p-4 space-y-3">
                      {intel.talking_points.internal.map((pt, i) => (
                        <div key={i} className="flex gap-2.5 text-xs text-workspace-charcoal leading-relaxed bg-workspace-card p-2.5 rounded border border-workspace-sand/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#8F7C73] mt-2 shrink-0" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Client / Stakeholder facing narrative */}
                {intel.talking_points?.stakeholder_client && intel.talking_points.stakeholder_client.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-workspace-sage font-mono uppercase tracking-wider block">
                      Client & Public Narrative Guarantees
                    </span>
                    <div className="bg-[rgba(138,155,128,0.03)] border border-workspace-sage/20 rounded-xl p-4 space-y-3">
                      {intel.talking_points.stakeholder_client.map((pt, i) => (
                        <div key={i} className="flex gap-2.5 text-xs text-[#2F3A2C] leading-relaxed bg-workspace-card p-2.5 rounded border border-workspace-sage/10">
                          <div className="w-2 h-2 rounded bg-workspace-sage mt-1.5 shrink-0" />
                          <span className="font-medium">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Board / Leadership level anchor focus */}
                {intel.talking_points?.leadership && intel.talking_points.leadership.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-workspace-terracotta font-mono uppercase tracking-wider block">
                      Leadership & Board Level Briefs
                    </span>
                    <div className="bg-[rgba(200,122,83,0.03)] border border-workspace-terracotta/20 rounded-xl p-4 space-y-3">
                      {intel.talking_points.leadership.map((pt, i) => (
                        <div key={i} className="flex gap-2.5 text-xs text-workspace-brown leading-relaxed bg-workspace-card p-2.5 rounded border border-workspace-terracotta/10">
                          <Sparkles className="w-4 h-4 text-workspace-terracotta shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 5: NEXT STEPS CHECKLIST */}
          {activeTab === "NextSteps" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="border-b border-workspace-sand pb-4">
                <h3 className="serif-font text-lg font-bold text-workspace-brown mb-1.5 flex items-center gap-2">
                  <ListChecks className="w-5.5 h-5.5 text-workspace-terracotta" />
                  <span>Interlinked Action Items Tracker</span>
                </h3>
                <p className="text-xs text-workspace-charcoal/65 font-mono">
                  Interactive checklist of strategic next steps synchronized across active teams
                </p>
              </div>

              <div className="bg-workspace-cream border border-workspace-sand rounded-xl p-3 sm:p-5">
                <span className="text-xxs font-mono uppercase text-[#8F7466] font-bold block mb-4 px-1 select-none">
                  Check items to toggle completions live:
                </span>

                {intel.next_steps && intel.next_steps.length > 0 ? (
                  <div className="space-y-3 shadow-2xs">
                    {intel.next_steps.map((step, i) => (
                      <div 
                        key={i} 
                        onClick={() => onToggleTask(batch.id, step.action_item)}
                        className={`flex items-start gap-4 p-4 rounded-lg bg-workspace-card border transition-all cursor-pointer select-none ${
                        step.completed 
                          ? 'border-workspace-sage/20 bg-workspace-sage/5 opacity-80' 
                          : 'border-workspace-sand hover:border-workspace-terracotta/30'
                        }`}
                        id={`action-item-row-${i}`}
                      >
                        <div className="pt-0.5 shrink-0">
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            step.completed 
                              ? 'bg-workspace-sage border-workspace-sage text-workspace-cream' 
                              : 'border-workspace-sand hover:border-workspace-terracotta bg-workspace-cream'
                          }`}>
                            {step.completed && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                        </div>

                        <div className="flex-1 space-y-1.5 overflow-hidden">
                          <p className={`text-xs font-semibold leading-snug ${step.completed ? 'line-through text-workspace-charcoal/50' : 'text-[#3E2D27]'}`}>
                            {step.action_item}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 text-xxs font-mono text-workspace-charcoal/55">
                            {step.priority && (
                              <span className={`px-1.5 py-0.5 rounded border text-[9px] ${getPriorityBadge(step.priority)}`}>
                                {step.priority} priority
                              </span>
                            )}
                            
                            {step.deadline && step.deadline !== "Not specified" && (
                              <span className="bg-workspace-cream px-1.5 py-0.5 rounded border border-workspace-sand/35">
                                Due {step.deadline}
                              </span>
                            )}

                            {step.owner && step.owner !== "Not specified" && (
                              <span className="bg-workspace-cream px-1.5 py-0.5 rounded border border-workspace-sand/35 font-semibold">
                                Owns: {step.owner}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-workspace-charcoal/50">
                    <p className="text-xs">No structured action items defined for this briefing.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: ORIGINAL FILES LIST */}
          {activeTab === "Files" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="border-b border-workspace-sand pb-4">
                <h3 className="serif-font text-lg font-bold text-workspace-brown mb-1.5 flex items-center gap-2">
                  <Files className="w-5.5 h-5.5 text-workspace-terracotta" />
                  <span>Supporting Documents Archive</span>
                </h3>
                <p className="text-xs text-workspace-charcoal/65 font-mono">
                  Review original raw file uploads parsed inside secure extraction slots
                </p>
              </div>

              {batch.uploadedFiles && batch.uploadedFiles.length > 0 ? (
                <div className="space-y-3.5">
                  {batch.uploadedFiles.map((file, i) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between p-4 bg-workspace-cream border border-workspace-sand rounded-xl group hover:border-[#8F7466]/40 transition-colors"
                      id={`file-row-${i}`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-workspace-card border border-workspace-sand flex items-center justify-center text-[#8F7C73] shrink-0 font-mono text-[9px] font-bold uppercase shadow-2xs">
                          {file.type}
                        </div>

                        <div className="overflow-hidden space-y-0.5">
                          <h4 className="text-xs font-bold font-mono text-[#3E2D27] truncate group-hover:text-workspace-terracotta transition-colors">
                            {file.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-mono text-workspace-charcoal/50 pr-4 animate-fade-in">
                            <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                            <span>•</span>
                            <span>Uploaded {formatDate(file.uploadedAt)}</span>
                            {intel && intel.generationSource === "ai" && (
                              <>
                                <span>•</span>
                                <span className="text-[#55632E] text-[8.5px] font-mono font-bold uppercase tracking-wider bg-[#8A9A5B]/15 border border-[#8A9A5B]/30 px-1.5 py-0.5 rounded-sm select-none">
                                  ✓ Extracted Full-Text
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded bg-workspace-card hover:bg-workspace-sand border border-workspace-sand text-workspace-charcoal/80 hover:text-workspace-brown text-xxs font-mono font-medium transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download SHA-256</span>
                        </button>
                      </div>

                    </div>
                  ))}

                  {batch.notesSnippet && (
                    <div className="space-y-2.5 pt-4 border-t border-workspace-sand/50">
                      <span className="text-xs font-bold text-[#8F7466] font-mono uppercase tracking-wider block">
                        Included Raw text transcript snippets
                      </span>
                      <div className="p-4 bg-workspace-cream border border-workspace-sand rounded-xl text-xs text-workspace-charcoal/80 leading-relaxed font-sans max-h-52 overflow-y-auto whitespace-pre-wrap">
                        {batch.notesSnippet}
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="text-center py-12 font-mono text-xs text-workspace-charcoal/50">
                  <p>No raw documentation files were uploaded during initial dossier setup.</p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
