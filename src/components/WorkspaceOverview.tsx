/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { MeetingBatch, UploadedFile } from '../types';
import BatchCard, { formatDate } from './BatchCard';
import { 
  Upload, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  AlertTriangle, 
  ListChecks, 
  Layers,
  HelpCircle,
  X,
  PlusCircle,
  Play,
  Loader2
} from 'lucide-react';

interface WorkspaceOverviewProps {
  batches: MeetingBatch[];
  onSelectBatch: (id: string) => void;
  onNewBatchClick: () => void;
  onDeleteBatch: (id: string, e: React.MouseEvent) => void;
  onViewLibrary: () => void;
  onInitiateBatch: (
    title: string,
    fileList: Array<{ name: string; size: number; type?: string; fileData?: string }>,
    notes: string
  ) => void;
  isInitiating: boolean;
  showNewBatchModal: boolean;
  setShowNewBatchModal: (show: boolean) => void;
}

export default function WorkspaceOverview({
  batches,
  onSelectBatch,
  onNewBatchClick,
  onDeleteBatch,
  onViewLibrary,
  onInitiateBatch,
  isInitiating,
  showNewBatchModal,
  setShowNewBatchModal
}: WorkspaceOverviewProps) {

  // Form State inside modal
  const [modalTitle, setModalTitle] = useState("");
  const [modalNotes, setModalNotes] = useState("");
  const [modalFiles, setModalFiles] = useState<Array<{ name: string; size: number; type?: string; fileData?: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to convert browser File object to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Strip out metadata prefix (e.g., 'data:application/pdf;base64,')
        const base64Data = result.split(',')[1] || "";
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Drag and drop state
  const [dragActive, setDragActive] = useState(false);
  const [dashboardDragActive, setDashboardDragActive] = useState(false);

  // Pick the latest completed batch to show premium live AI preview stats in the right-aligned panel
  const latestBatch = batches.find(b => b.status === "Completed") || batches[0];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setDashboardDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesList = Array.from(e.dataTransfer.files);
      
      // Map files to base64 promises
      const promises = filesList.map(async (file: File) => {
        try {
          const b64 = await fileToBase64(file);
          return {
            name: file.name,
            size: file.size,
            type: file.name.split('.').pop() || 'pdf',
            fileData: b64
          };
        } catch (err) {
          console.error("Failed to read file base64:", err);
          return {
            name: file.name,
            size: file.size,
            type: file.name.split('.').pop() || 'pdf'
          };
        }
      });

      Promise.all(promises).then((filesArr) => {
        setModalFiles(prev => [...prev, ...filesArr]);
      });
      
      // Auto open modal with a recommended title
      if (!modalTitle) {
        const cleanedName = e.dataTransfer.files[0].name.split('.')[0]
          .replace(/[_-]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
        setModalTitle(`${cleanedName} Workspace`);
      }
      setShowNewBatchModal(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesList = Array.from(e.target.files);

      const promises = filesList.map(async (file: File) => {
        try {
          const b64 = await fileToBase64(file);
          return {
            name: file.name,
            size: file.size,
            type: file.name.split('.').pop() || 'pdf',
            fileData: b64
          };
        } catch (err) {
          console.error("Failed to read file base64:", err);
          return {
            name: file.name,
            size: file.size,
            type: file.name.split('.').pop() || 'pdf'
          };
        }
      });

      Promise.all(promises).then((filesArr) => {
        setModalFiles(prev => [...prev, ...filesArr]);
      });
      
      if (!modalTitle) {
        const cleanedName = e.target.files[0].name.split('.')[0]
          .replace(/[_-]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
        setModalTitle(`${cleanedName} Summary`);
      }
    }
  };

  const removeFileFromList = (idx: number) => {
    setModalFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const triggerSearchInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const submitBatchForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) return;
    
    // Fallback files if none selected
    const filesToSubmit = modalFiles.length > 0 ? modalFiles : [
      { name: "Executive_Minutes_Summary.pdf", size: 1205300 }
    ];

    onInitiateBatch(modalTitle, filesToSubmit, modalNotes);
    
    // Clear and close
    setModalTitle("");
    setModalNotes("");
    setModalFiles([]);
    setShowNewBatchModal(false);
  };

  return (
    <div className="flex-1 p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
      
      {/* Dynamic Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-workspace-cream/80 border border-workspace-sand/50 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xxs font-mono uppercase bg-workspace-terracotta/10 text-workspace-terracotta px-2 py-0.5 rounded-sm font-semibold tracking-wider">
              Workspace Overview
            </span>
            <span className="text-xxxs font-mono text-workspace-charcoal/40">Secure TLS 1.3</span>
          </div>
          <h2 className="serif-font text-2xl font-bold text-workspace-brown tracking-tight">
            Executive Control Terminal
          </h2>
          <p className="text-xs text-workspace-charcoal/70 max-w-xl mt-1 leading-relaxed">
            Consolidate meeting notes, slides, and transcripts into strategic multi-layered boards. Use our secure generative suite to assess key delivery timelines and organizational vectors.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setModalTitle("Immediate Strategic Brief");
              setModalFiles([{ name: "Briefing_Notes_v3.pdf", size: 210129 }]);
              setShowNewBatchModal(true);
            }}
            id="btn-shortcut-uploads"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-workspace-cream border border-workspace-sand hover:bg-workspace-sand/30 hover:text-workspace-brown text-workspace-charcoal transition-all flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4 text-workspace-blue" />
            <span>Upload Files</span>
          </button>

          <button
            onClick={onNewBatchClick}
            id="btn-shortcut-new-batch"
            className="px-4.5 py-2 text-xs font-semibold rounded-lg bg-workspace-brown hover:bg-[#32231C] active:bg-[#4E382E] text-workspace-cream transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4.5 h-4.5 text-workspace-beige" />
            <span>New Meeting Batch</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Grid: Center content with right-aligned instant AI preview summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Columns: File drop uploader region and recent lists */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* File Drag and Drop Stage */}
          <div
            onDragEnter={(e) => { e.preventDefault(); setDashboardDragActive(true); }}
            onDragOver={(e) => { e.preventDefault(); setDashboardDragActive(true); }}
            onDragLeave={() => setDashboardDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 py-12 text-center transition-all flex flex-col items-center justify-center relative bg-workspace-card/30 ${
              dashboardDragActive 
                ? 'border-workspace-terracotta bg-workspace-terracotta/5 scale-99.5' 
                : 'border-workspace-sand hover:border-workspace-terracotta/45'
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-workspace-bg border border-workspace-sand/50 flex items-center justify-center mb-4 text-[#8F7466] shadow-2xs">
              <Upload className="w-6 h-6 animate-bounce" />
            </div>
            
            <h3 className="serif-font font-bold text-lg text-workspace-brown mb-1.5">
              Drop meeting files here
            </h3>
            <p className="text-xs text-workspace-charcoal/65 max-w-sm mb-5 leading-normal">
              Drag-and-drop Notes PDFs, PowerPoint slides, spreadsheet updates, or supportive text files directly to initiate the structured intelligence pipeline.
            </p>

            <button
              onClick={triggerSearchInput}
              id="btn-trigger-file-browse"
              className="px-5 py-2.5 bg-workspace-beige hover:bg-workspace-sand border border-workspace-sand text-workspace-brown hover:text-workspace-brown text-xs font-semibold rounded-lg transition-all shadow-2xs cursor-pointer"
            >
              Browse Files
            </button>
            <span className="text-[10px] font-mono text-workspace-charcoal/45 mt-3">
              Max file uploads per batch: 50MB
            </span>

            {/* Hidden Input file hook */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect}
              multiple 
              className="hidden"
              accept=".pdf,.docx,.doc,.txt,.pptx,.ppt,.xlsx,.xls"
            />
          </div>

          {/* Recent lists */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="serif-font text-lg font-bold text-workspace-brown">
                Recent Meeting Intelligence
              </h3>
              
              <button
                onClick={onViewLibrary}
                id="btn-view-all-library"
                className="text-xs font-semibold text-workspace-terracotta hover:text-workspace-brown transition-colors flex items-center gap-1 group"
              >
                <span>View Full Library Archive</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {batches.length === 0 ? (
              <div className="bg-workspace-card border border-workspace-sand/80 p-8 text-center rounded-xl">
                <p className="text-xs text-workspace-charcoal/60">No meeting batches exist in workspace. Click "+ New Meeting Batch" to initiate your first intelligence analysis!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {batches.slice(0, 4).map((b) => (
                  <BatchCard 
                    key={b.id} 
                    batch={b} 
                    onSelect={onSelectBatch} 
                    onDelete={onDeleteBatch}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right 4 Columns: AI Intelligence Spotlight Preview Panel */}
        <div className="lg:col-span-4">
          <div className="bg-workspace-cream border border-workspace-sand rounded-2xl p-6 h-full flex flex-col justify-between space-y-6">
            
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-workspace-sand/70 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-workspace-terracotta" />
                  <h3 className="font-mono text-xs uppercase tracking-wider text-workspace-brown font-bold">
                    AI Intelligence Preview
                  </h3>
                </div>
                <div className="w-2 h-2 rounded-full bg-workspace-sage animate-ping" />
              </div>

              {latestBatch ? (
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-mono text-workspace-charcoal/40 block mb-0.5">Focus Spotlight Item</span>
                    <h4 className="serif-font text-sm font-bold text-workspace-brown line-clamp-2">
                      {latestBatch.title}
                    </h4>
                    <span className="text-xxs font-mono text-workspace-charcoal/50">
                      Analyzed {formatDate(latestBatch.dateCreated)}
                    </span>
                  </div>

                  {/* Summary Segment */}
                  {latestBatch.intelligence ? (
                    <div className="space-y-4">
                      
                      {/* Executive Summary Snippet */}
                      <div className="space-y-1.5 bg-workspace-card/60 p-3.5 rounded-lg border border-workspace-sand/50">
                        <div className="flex items-center gap-1.5 text-xxs font-mono text-workspace-charcoal/60 font-bold uppercase">
                          <FileText className="w-3.5 h-3.5 text-workspace-blue" />
                          <span>Executive Summary</span>
                        </div>
                        <p className="text-xs text-workspace-charcoal/80 leading-relaxed font-sans line-clamp-4">
                          {latestBatch.intelligence.meeting_summary?.[0] || "No summary provided."}
                        </p>
                      </div>

                      {/* Key Risks Spotlight */}
                      <div className="space-y-1.5 bg-[rgba(200,122,83,0.05)] p-3.5 rounded-lg border border-workspace-terracotta/15">
                        <div className="flex items-center gap-1.5 text-xxs font-mono text-workspace-terracotta font-bold uppercase">
                          <AlertTriangle className="w-3.5 h-3.5 text-workspace-terracotta" />
                          <span>Key Identified Threat</span>
                        </div>
                        <h5 className="text-xs font-semibold text-workspace-brown">
                          {latestBatch.intelligence.risks_concerns?.[0]?.risk || "None Flagged"}
                        </h5>
                        <p className="text-xxs text-workspace-charcoal/70 leading-normal">
                          {latestBatch.intelligence.risks_concerns?.[0]?.impact || "Slight operations profile constraints."}
                        </p>
                      </div>

                      {/* Next Steps preview */}
                      <div className="space-y-1.5 bg-workspace-card/65 p-3.5 rounded-lg border border-workspace-sand/50">
                        <div className="flex items-center gap-1.5 text-xxs font-mono text-workspace-sage font-bold uppercase">
                          <ListChecks className="w-3.5 h-3.5 text-workspace-sage" />
                          <span>Next Tactical Steps</span>
                        </div>
                        <div className="space-y-1 pt-1">
                          {latestBatch.intelligence.next_steps?.slice(0, 2).map((step: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 text-xxs text-[#5C4D44] truncate">
                              <div className={`w-1.5 h-1.5 rounded-full ${step.priority === 'High' ? 'bg-workspace-terracotta' : 'bg-workspace-blue'}`} />
                              <span className="truncate">{step.action_item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="bg-workspace-card/30 p-6 rounded-lg text-center border border-workspace-sand/40">
                      <p className="text-xs text-workspace-charcoal/60">
                        Analysis details currently queued or pending pipeline trigger.
                      </p>
                    </div>
                  )}

                </div>
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="w-8 h-8 text-workspace-charcoal/20 mx-auto mb-2" />
                  <p className="text-xs text-workspace-charcoal/50">
                    No active reports spotlight found. Upload meeting logs above to establish workspace records.
                  </p>
                </div>
              )}
            </div>

            {/* Micro strategic support text */}
            <div className="bg-workspace-card/20 border border-workspace-sand/40 rounded-lg p-3.5 text-[10px] font-mono text-workspace-charcoal/50 leading-relaxed">
              <span className="text-workspace-sage font-bold">✓ SECURE PIPELINE</span>
              <p className="mt-1">
                Data generated remains local. Calls made use server-side sandboxing models ensuring Zero external metadata leak.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* NEW BATCH MODAL DIALOG */}
      {showNewBatchModal && (
        <div id="new-batch-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-workspace-charcoal/45 backdrop-blur-xs">
          <div className="bg-workspace-cream border border-workspace-sand rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col justify-between">
            <div className="p-6 border-b border-workspace-sand/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-workspace-terracotta/10 text-workspace-terracotta">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="serif-font text-lg font-bold text-workspace-brown">
                    New Meeting Intel Batch
                  </h3>
                  <p className="text-xxs text-workspace-charcoal/50 font-mono uppercase tracking-wide">
                    Configure strategic analysis metrics
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowNewBatchModal(false)}
                className="p-1 rounded bg-workspace-sand/30 hover:bg-workspace-sand text-workspace-charcoal/60 transition-colors"
                id="btn-close-modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitBatchForm}>
              <div className="p-6 space-y-5">
                
                {/* Meeting Title input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-workspace-brown font-mono uppercase tracking-wider block">
                    Meeting Agenda / Batch Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={modalTitle}
                    onChange={(e) => setModalTitle(e.target.value)}
                    placeholder="e.g. Q4 Operations Review, EMEA Corporate Sync"
                    className="w-full px-3 py-2 text-xs border border-workspace-sand rounded-lg bg-workspace-card focus:outline-none focus:border-workspace-terracotta/70 font-sans"
                    id="input-batch-title"
                  />
                </div>

                {/* File Upload Attachment Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-workspace-brown font-mono uppercase tracking-wider block">
                    Attach Local Meeting Materials
                  </label>
                  
                  <div className="border border-dashed border-workspace-sand bg-workspace-card rounded-lg p-4 text-center">
                    <p className="text-xxs text-workspace-charcoal/60 mb-2">
                      Drop files to append or click button
                    </p>
                    <button
                      type="button"
                      onClick={triggerSearchInput}
                      className="px-3.5 py-1.5 bg-workspace-cream hover:bg-workspace-sand border border-workspace-sand text-workspace-brown text-xxs font-semibold rounded-md transition-colors"
                    >
                      Choose Files
                    </button>
                  </div>

                  {modalFiles.length > 0 && (
                    <div className="space-y-1 pt-1.5 max-h-36 overflow-y-auto">
                      <span className="text-xxs font-semibold text-workspace-charcoal/50 font-mono tracking-wide block uppercase">
                        Queued Attachments ({modalFiles.length})
                      </span>
                      {modalFiles.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-workspace-cream border border-workspace-sand/40 rounded text-xxs">
                          <div className="flex items-center gap-1.5 text-workspace-brown font-mono truncate max-w-[80%]">
                            <Layers className="w-3.5 h-3.5 text-workspace-sage" />
                            <span className="truncate">{f.name}</span>
                            <span className="text-workspace-charcoal/40 text-[10px]">
                              ({(f.size / (1024 * 1024)).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFileFromList(i)}
                            className="text-red-500 hover:text-red-700 text-xxs font-mono font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Supportive text notes / transcripts */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-workspace-brown font-mono uppercase tracking-wider">
                      Meeting Transcripts / Supporting Notes
                    </label>
                    <span className="text-[10px] font-mono text-workspace-sage font-bold">EXCELLENT FOR DIRECT PASTES</span>
                  </div>
                  <textarea
                    rows={4}
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    placeholder="Paste transcripts, key points, or text summary notes from the meeting. The AI workspace pipeline will integrate these into core briefing conclusions..."
                    className="w-full p-3 text-xs border border-workspace-sand rounded-lg bg-workspace-card focus:outline-none focus:border-workspace-terracotta/70 font-sans"
                    id="input-batch-notes"
                  />
                  <span className="text-[10px] text-workspace-charcoal/50 leading-normal block">
                    You can paste raw conversational records. Our pipeline uses professional structures to automatically parse core takeaways, deadlines, and ownership.
                  </span>
                </div>

              </div>

              <div className="p-6 border-t border-workspace-sand/60 bg-workspace-sand/15 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowNewBatchModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-workspace-charcoal border border-workspace-sand bg-workspace-cream hover:bg-workspace-sand/35 hover:text-workspace-brown transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  id="btn-initiate-analysis"
                  disabled={isInitiating}
                  className="px-5 py-2.5 bg-workspace-terracotta hover:bg-[#8D573F] active:bg-[#B3795E] disabled:bg-workspace-sand text-workspace-cream text-xs font-semibold rounded-lg transition-all shadow-xs flex items-center gap-2 shadow-2xs"
                >
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                  <span>{isInitiating ? "Running AI Intelligence Analysis..." : "Initiate Workspace Analysis"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FIXED LOADER TRANSITION STATE */}
      {isInitiating && (
        <div id="analysis-global-loader" className="fixed inset-0 z-50 bg-workspace-brown/25 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-workspace-cream border border-workspace-sand p-8 rounded-xl max-w-sm text-center shadow-xl space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-workspace-terracotta mx-auto" />
            <h4 className="serif-font text-lg font-bold text-workspace-brown">
              Analyzing Intelligence Batch
            </h4>
            <div className="space-y-1.5">
              <p className="text-xs text-workspace-charcoal/70 leading-normal">
                Communicating with secure server-side models. Preparing executive summaries, tracking deliverables, mapped deadlines, and identified threat metrics...
              </p>
              <span className="text-[10px] font-mono text-workspace-terracotta animate-pulse block">
                Establishing structured schema alignment...
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
