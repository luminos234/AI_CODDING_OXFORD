/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import WorkspaceOverview from './components/WorkspaceOverview';
import LibraryView from './components/LibraryView';
import BatchDetail from './components/BatchDetail';
import { MeetingBatch } from './types';
import { 
  Sparkles, 
  HelpCircle, 
  Clock, 
  RefreshCw,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  desc: string;
}

export default function App() {
  // Navigation coordinates
  const [currentTab, setCurrentTab] = useState<string>("dashboard"); // 'dashboard' | 'library'
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

  // Core database states
  const [batches, setBatches] = useState<MeetingBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitiating, setIsInitiating] = useState(false);
  const [errorText, setErrorText] = useState("");

  // Modals & notifications controls
  const [showNewBatchModal, setShowNewBatchModal] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast notifier helper
  const addToast = (type: 'success' | 'error' | 'info', title: string, desc: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, title, desc }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch batches database on mount
  const fetchBatches = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await fetch("/api/batches");
      if (!res.ok) throw new Error("Could not contact the database.");
      const data = await res.json();
      setBatches(data);
      setErrorText("");
    } catch (err: any) {
      console.error("Database loading failed:", err);
      setErrorText(err.message || "Failed to load workspace reports");
      addToast('error', 'Database Unreachable', 'The full-stack Express service could not serve meeting intelligence batches. Verify server is online.');
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // Submit a new batch files and initiate Gemini analyses
  const handleInitiateBatch = async (
    title: string, 
    fileList: Array<{ name: string; size: number; type?: string; fileData?: string }>, 
    notes: string
  ) => {
    setIsInitiating(true);
    setCurrentTab("dashboard");
    setSelectedBatchId(null);
    addToast('info', 'AI Analysis Started', `Initiating structured meeting intelligence pipeline for "${title}".`);

    try {
      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          files: fileList,
          notes
        })
      });

      if (!res.ok) {
        throw new Error("Analysis request failed inside the pipeline.");
      }

      const freshlyCreated = await res.json();
      
      // Reload batches list
      await fetchBatches(true);
      
      // Auto select the new batch
      setSelectedBatchId(freshlyCreated.id);
      addToast('success', 'Analysis Succeeded', `Structured intelligence compiled for "${title}".`);
    } catch (err: any) {
      console.error("Batch creation failed:", err);
      addToast('error', 'Pipeline Error', err.message || "Gemini workspace analysis could not complete.");
    } finally {
      setIsInitiating(false);
    }
  };

  // Toggle action item checklist row
  const handleToggleTask = async (batchId: string, actionItemText: string) => {
    try {
      const res = await fetch(`/api/batches/${batchId}/tasks/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionItemText })
      });

      if (!res.ok) throw new Error("Could not toggle database action completion");
      
      // Optimistic client update or direct refresh
      setBatches(prev => prev.map(b => {
        if (b.id === batchId && b.intelligence) {
          const updatedSteps = b.intelligence.next_steps.map(step => {
            if (step.action_item === actionItemText) {
              return { ...step, completed: !step.completed };
            }
            return step;
          });
          return {
            ...b,
            intelligence: {
              ...b.intelligence,
              next_steps: updatedSteps
            }
          };
        }
        return b;
      }));

      addToast('success', 'Action Item Updated', 'Database task completion state synchronized successfully.');
    } catch (err) {
      console.error(err);
      addToast('error', 'Sync Failed', 'Failed to update action checklist completed status.');
    }
  };

  // Delete a specific batch
  const handleDeleteBatch = async (id: string, e: React.MouseEvent) => {
    const target = batches.find(b => b.id === id);
    if (!target) return;

    if (!window.confirm(`Are you sure you want to permanently delete the meeting intelligence dossier for "${target.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/batches/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Could not delete the batch");
      
      setBatches(prev => prev.filter(b => b.id !== id));
      if (selectedBatchId === id) setSelectedBatchId(null);

      addToast('success', 'Batch Deleted', `Dossier for "${target.title}" was successfully deleted from the library archive.`);
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Deletion Failed', 'Failed to remove meeting batch from secure database.');
    }
  };

  // Reset database back to manufacturing template batches
  const handleResetDatabase = async () => {
    if (!window.confirm("Restore factory default templates? This will erase all newly analyzed custom batches.")) {
      return;
    }
    
    setIsLoading(true);
    addToast('info', 'Resetting Workspace', 'Cleaning vault databases and provisioning standard templates.');

    try {
      const res = await fetch("/api/reset", { method: "POST" });
      if (!res.ok) throw new Error("Database reset operation rejected by host.");
      const data = await res.json();
      setBatches(data.database);
      setSelectedBatchId(null);
      setCurrentTab("dashboard");
      addToast('success', 'Workspace Restored', 'Standard Q4 strategic briefing dossiers successfully provisioned.');
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Reset Failed', err.message || "Failed to reset intelligence archive.");
    } finally {
      setIsLoading(false);
    }
  };

  const activeBatchObj = batches.find(b => b.id === selectedBatchId);

  return (
    <div className="flex h-screen overflow-hidden selection:bg-workspace-beige selection:text-workspace-brown">
      
      {/* Sidebar navigation and profile card */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={(tab) => {
          setSelectedBatchId(null);
          setCurrentTab(tab);
        }}
        onReset={handleResetDatabase}
        onNewBatchClick={() => setShowNewBatchModal(true)}
      />

      {/* Main Content Area Container */}
      <main className="flex-1 flex flex-col h-full bg-workspace-cream overflow-hidden">
        
        {/* Top universal executive header bar */}
        <header className="h-16 border-b border-workspace-sand shrink-0 bg-white/70 backdrop-blur-xs px-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span id="current-utc-title" className="text-xxs font-mono uppercase text-workspace-charcoal/45 tracking-widest leading-none">
              Active Security Node
            </span>
            <span className="text-xxs font-mono text-workspace-sage tracking-normal pr-5 font-bold">● ONLINE</span>
          </div>

          <div className="flex items-center gap-4 text-[#8F7C73]">
            
            {/* Quick alert indicator */}
            <button className="p-1.5 rounded-full hover:bg-workspace-sand/40 hover:text-workspace-brown transition-colors relative cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-workspace-terracotta" />
            </button>

            {/* Date time readout */}
            <div className="text-xxs font-mono text-workspace-charcoal/60 border-l border-workspace-sand pl-4 flex items-center gap-1.5 select-none">
              <Clock className="w-3.5 h-3.5" />
              <span>Sat May 23, 10:17:19 UTC</span>
            </div>

          </div>
        </header>

        {/* Dynamic Display Router pane */}
        <div className="flex-1 flex overflow-hidden">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-3.5">
              <RefreshCw className="w-8 h-8 animate-spin text-workspace-terracotta" />
              <p className="text-xs font-mono text-workspace-charcoal/60 uppercase tracking-widest select-none">
                Reading Vault Databases...
              </p>
            </div>
          ) : errorText ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center px-4">
              <AlertCircle className="w-12 h-12 text-workspace-terracotta" />
              <div>
                <h3 className="serif-font font-bold text-lg text-workspace-brown">Database Connection Timeout</h3>
                <p className="text-xs text-workspace-charcoal/70 max-w-sm mt-1">{errorText}</p>
              </div>
              <button 
                onClick={() => fetchBatches()}
                className="px-4 py-2 bg-workspace-brown hover:bg-[#32231C] text-workspace-cream font-semibold text-xs rounded-lg transition-all"
              >
                Retry Direct Gateway Sync
              </button>
            </div>
          ) : selectedBatchId && activeBatchObj ? (
            /* Tabular batch dossiers page */
            <BatchDetail 
              batch={activeBatchObj} 
              onBack={() => setSelectedBatchId(null)}
              onToggleTask={handleToggleTask}
            />
          ) : currentTab === "dashboard" ? (
            /* Dashboard home view */
            <WorkspaceOverview 
              batches={batches}
              onSelectBatch={setSelectedBatchId}
              onNewBatchClick={() => setShowNewBatchModal(true)}
              onDeleteBatch={handleDeleteBatch}
              onViewLibrary={() => setCurrentTab("library")}
              onInitiateBatch={handleInitiateBatch}
              isInitiating={isInitiating}
              showNewBatchModal={showNewBatchModal}
              setShowNewBatchModal={setShowNewBatchModal}
            />
          ) : (
            /* Library archive view */
            <LibraryView 
              batches={batches}
              onSelectBatch={setSelectedBatchId}
              onNewBatchClick={() => setShowNewBatchModal(true)}
              onDeleteBatch={handleDeleteBatch}
            />
          )}
        </div>

      </main>

      {/* TOAST SYSTEM COMPONENT FLOATING ON TOP */}
      <div id="toast-hub" className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="p-4 bg-workspace-card border border-workspace-sand rounded-xl shadow-lg flex items-start gap-3.5 border-l-4 border-l-workspace-brown transition-all duration-320 animate-fade-in"
          >
            <div className="pt-0.5 shrink-0">
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-workspace-sage" />
              ) : toast.type === 'error' ? (
                <XCircle className="w-5 h-5 text-workspace-terracotta" />
              ) : (
                <Sparkles className="w-5 h-5 text-workspace-blue" />
              )}
            </div>

            <div className="flex-1 space-y-0.5">
              <h5 className="text-xs font-bold text-workspace-brown leading-snug">
                {toast.title}
              </h5>
              <p className="text-xxs text-workspace-charcoal/70 leading-relaxed font-sans">
                {toast.desc}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-workspace-charcoal/35 hover:text-workspace-charcoal transition-colors font-mono uppercase text-xxs font-semibold"
            >
              Dismiss
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
