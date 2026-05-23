/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MeetingBatch } from '../types';
import { 
  FileText, 
  Clock, 
  Trash2, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';

interface BatchCardProps {
  batch: MeetingBatch;
  onSelect: (id: string) => void;
  onDelete?: (id: string, e: React.MouseEvent) => void;
  key?: string;
}

// Convert ISO string to beautiful date presentation
export function formatDate(isoStr: string): string {
  try {
    const date = new Date(isoStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (err) {
    return isoStr;
  }
}

export function formatTime(isoStr: string): string {
  try {
    const date = new Date(isoStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (err) {
    return "";
  }
}

export default function BatchCard({ batch, onSelect, onDelete }: BatchCardProps) {
  // Select color & icon styling based on analysis status
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Completed":
        return {
          bg: "bg-workspace-sage/10 text-workspace-sage border-workspace-sage/20",
          icon: CheckCircle2,
          text: "Completed"
        };
      case "Processing":
        return {
          bg: "bg-workspace-blue/10 text-workspace-blue border-workspace-blue/20",
          icon: Loader2,
          text: "Analyzing"
        };
      case "Needs Review":
        return {
          bg: "bg-workspace-terracotta/10 text-workspace-terracotta border-workspace-terracotta/20",
          icon: AlertCircle,
          text: "Needs Review"
        };
      default: // Draft or others
        return {
          bg: "bg-workspace-charcoal/10 text-workspace-charcoal/70 border-workspace-charcoal/15",
          icon: Clock,
          text: "Draft"
        };
    }
  };

  const statusConfig = getStatusConfig(batch.status);
  const StatusIcon = statusConfig.icon;

  // Determine standard categories based on some text matching for beautiful visual tags
  const getTopicTags = (title: string): string[] => {
    const lower = title.toLowerCase();
    const tags = [];
    if (lower.includes("strategy") || lower.includes("annual")) tags.push("Strategic");
    if (lower.includes("product") || lower.includes("roadmap")) tags.push("Product");
    if (lower.includes("marketing") || lower.includes("sales")) tags.push("Growth");
    if (lower.includes("client") || lower.includes("renewal")) tags.push("Client");
    if (lower.includes("ethics") || lower.includes("governance") || lower.includes("legal")) tags.push("Governance");
    if (lower.includes("finance") || lower.includes("budget") || lower.includes("fiscal")) tags.push("Finance");
    
    if (tags.length === 0) tags.push("Executive");
    return tags;
  };

  const tags = getTopicTags(batch.title);

  return (
    <div
      onClick={() => onSelect(batch.id)}
      id={`batch-card-${batch.id}`}
      className="bg-workspace-card border border-workspace-sand/80 hover:border-workspace-terracotta/40 rounded-xl p-5 hover:shadow-md transition-all active:translate-y-px duration-250 cursor-pointer flex flex-col justify-between group relative"
    >
      <div>
        {/* Header containing metadata and status */}
        <div className="flex items-start justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2 text-xxs font-mono text-workspace-charcoal/50">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(batch.dateCreated)}</span>
            <span className="opacity-40">•</span>
            <span>{formatTime(batch.dateCreated)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {batch.status === "Completed" && batch.intelligence?.generationSource && (
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono tracking-wider font-bold uppercase border ${
                batch.intelligence.generationSource === "ai"
                  ? "bg-[#8A9A5B]/10 text-[#8A9A5B] border-[#8A9A5B]/20"
                  : batch.intelligence.generationSource === "fallback"
                  ? "bg-[#B97455]/10 text-[#B97455] border-[#B97455]/20"
                  : "bg-workspace-blue/10 text-workspace-blue border-workspace-blue/20"
              }`}>
                {batch.intelligence.generationSource === "ai" ? "GEMINI AI" : batch.intelligence.generationSource === "fallback" ? "DIAG FLOW" : "ARCHIVE"}
              </span>
            )}

            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border flex items-center gap-1 shrink-0 ${statusConfig.bg}`}>
              <StatusIcon className={`w-3 h-3 ${batch.status === "Processing" ? "animate-spin" : ""}`} />
              <span>{statusConfig.text}</span>
            </span>
            
            {onDelete && (
              <button
                id={`btn-delete-${batch.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(batch.id, e);
                }}
                className="p-1 rounded bg-transparent hover:bg-red-50 text-workspace-charcoal/40 hover:text-red-600 transition-colors cursor-pointer"
                title="Delete meeting batch"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title & Preview snippet */}
        <h3 className="serif-font text-base font-bold text-workspace-brown group-hover:text-workspace-terracotta transition-colors leading-snug line-clamp-2 pr-4 mb-2">
          {batch.title}
        </h3>

        {/* Materials Summary / files info */}
        <div className="flex items-center gap-3 text-xxs font-mono text-[#8F7C73] mb-3">
          <div className="flex items-center gap-1 bg-workspace-cream px-2 py-0.5 rounded border border-workspace-sand/40">
            <Layers className="w-3 h-3 text-[#A88C80]" />
            <span>{batch.filesCount} {batch.filesCount === 1 ? 'file' : 'files'}</span>
          </div>
          
          <div className="flex gap-1">
            {batch.fileTypes.map(type => (
              <span key={type} className="px-1.5 py-0.5 rounded bg-workspace-sand/30 text-workspace-charcoal/70 uppercase text-[9px] font-mono tracking-wider border border-workspace-sand/50">
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic Insight block preview */}
        <div className="relative bg-workspace-cream border-l-2 border-workspace-beige p-3 rounded-r-lg mb-4 text-xs italic text-workspace-charcoal/85 leading-relaxed bg-[#FAF8F5]">
          <span className="absolute top-1 left-2 text-[#E2D6CB] serif-font text-3xl font-extrabold select-none pointer-events-none stroke-none">“</span>
          <p className="line-clamp-3 pl-3 pt-1">
            {batch.insightPreview || "System reports analysis is queued. Complete draft will be produced instantly upon pipeline execution."}
          </p>
        </div>
      </div>

      {/* Footer tags and deep briefing indicator */}
      <div className="flex items-center justify-between pt-2 border-t border-workspace-sand/40 mt-1">
        <div className="flex gap-1.5">
          {tags.map(t => (
            <span key={t} className="text-[10px] font-sans px-2.5 py-0.5 rounded bg-[#ECE7DE] text-workspace-brown hover:bg-workspace-beige/50 transition-colors">
              {t}
            </span>
          ))}
        </div>

        <span className="text-[11px] font-semibold text-workspace-terracotta hover:text-workspace-brown transition-colors flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform duration-200">
          <span>View Report</span>
          <span>→</span>
        </span>
      </div>
    </div>
  );
}
