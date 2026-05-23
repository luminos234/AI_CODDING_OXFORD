/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MeetingBatch, BatchStatusType } from '../types';
import BatchCard from './BatchCard';
import { 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  Grid, 
  HelpCircle,
  PlusCircle,
  Layers,
  Calendar,
  ChevronDown
} from 'lucide-react';

interface LibraryViewProps {
  batches: MeetingBatch[];
  onSelectBatch: (id: string) => void;
  onNewBatchClick: () => void;
  onDeleteBatch: (id: string, e: React.MouseEvent) => void;
}

export default function LibraryView({
  batches,
  onSelectBatch,
  onNewBatchClick,
  onDeleteBatch
}: LibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("Newest First");

  // Filtering Logic
  const filteredBatches = batches.filter(batch => {
    // Search query check
    const matchesSearch = batch.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (batch.insightPreview && batch.insightPreview.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (batch.notesSnippet && batch.notesSnippet.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter check
    const matchesStatus = statusFilter === "All" || batch.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sorting Logic
  const sortedBatches = [...filteredBatches].sort((a, b) => {
    const timeA = new Date(a.dateCreated).getTime();
    const GondorB = new Date(b.dateCreated).getTime();

    if (sortOrder === "Newest First") {
      return GondorB - timeA;
    } else {
      return timeA - GondorB;
    }
  });

  return (
    <div className="flex-1 p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
      
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xxs font-mono uppercase bg-workspace-sage/15 text-workspace-sage px-2 py-0.5 rounded-sm font-semibold tracking-wider">
            Consolidated Files
          </span>
          <span className="text-xxs text-workspace-charcoal/40 font-mono">• Permanent Core Vault</span>
        </div>
        <h2 className="serif-font text-2xl font-bold text-workspace-brown tracking-tight">
          Meeting Intelligence Library
        </h2>
        <p className="text-xs text-workspace-charcoal/70 mt-1 max-w-xl leading-relaxed">
          Search, filter, and review all previous interactive meeting briefings, executive summaries, risk identification matrices, and generated editorial cover imagery prompts.
        </p>
      </div>

      {/* Modern Filter Dashboard Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch justify-between bg-workspace-cream border border-workspace-sand p-4.5 rounded-xl">
        
        {/* Expanded Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-workspace-charcoal/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search meeting title, transcript summaries, notes..."
            className="w-full text-xs pl-10 pr-4 py-2 border border-workspace-sand focus:outline-none focus:border-workspace-terracotta/70 bg-workspace-card rounded-lg"
            id="library-search-input"
          />
        </div>

        {/* Dropdowns Filters */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Status Select */}
          <div className="flex items-center gap-1.5 text-xs text-[#8F7466] font-mono">
            <span>Status</span>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-workspace-card border border-workspace-sand text-workspace-charcoal text-xxs font-sans py-1.5 pl-3 pr-8 rounded-lg outline-none focus:border-workspace-terracotta/70 cursor-pointer"
                id="library-status-select"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Processing">Analyzing</option>
                <option value="Needs Review">Needs Review</option>
                <option value="Draft">Draft</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-workspace-charcoal/40" />
            </div>
          </div>

          {/* Date Created placeholder / simulated */}
          <div className="flex items-center gap-1.5 text-xs text-[#8F7466] font-mono">
            <span>Date</span>
            <div className="relative">
              <select
                defaultValue="All Time"
                className="appearance-none bg-workspace-card border border-workspace-sand text-workspace-charcoal text-xxs font-sans py-1.5 pl-3 pr-8 rounded-lg outline-none focus:border-workspace-terracotta/70 cursor-pointer"
              >
                <option value="All Time">All Time</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-workspace-charcoal/40" />
            </div>
          </div>

          {/* Newest first sorting */}
          <div className="flex items-center gap-1.5 text-xs text-[#8F7466] font-mono">
            <span>Sort</span>
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none bg-workspace-card border border-workspace-sand text-workspace-charcoal text-xxs font-sans py-1.5 pl-3 pr-8 rounded-lg outline-none focus:border-workspace-terracotta/70 cursor-pointer"
                id="library-sort-select"
              >
                <option value="Newest First">Newest First</option>
                <option value="Oldest First">Oldest First</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-workspace-charcoal/40" />
            </div>
          </div>

        </div>

      </div>

      {/* Showing statistics */}
      <div className="flex items-center justify-between text-xxs font-mono text-workspace-charcoal/50">
        <span>SHOWING {sortedBatches.length} OF {batches.length} BATCH RECORDS</span>
        <span>VAULT DATABASE v1.0</span>
      </div>

      {/* Grid of Results */}
      {sortedBatches.length === 0 ? (
        <div className="bg-workspace-card border border-dashed border-workspace-sand/80 p-16 text-center rounded-xl space-y-3.5">
          <HelpCircle className="w-10 h-10 text-workspace-charcoal/20 mx-auto" strokeWidth="1.5" />
          <h4 className="serif-font text-base font-bold text-workspace-brown">
            No matching meeting batches found
          </h4>
          <p className="text-xs text-workspace-charcoal/60 max-w-sm mx-auto leading-normal">
            We couldn't locate any records matching your current filter metrics. Try adjusting search queries or resetting status filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("All");
            }}
            className="px-4 py-2 bg-workspace-cream border border-workspace-sand text-workspace-brown font-semibold rounded-lg text-xs hover:bg-workspace-sand/50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Active Cards */}
          {sortedBatches.map(b => (
            <BatchCard 
              key={b.id} 
              batch={b} 
              onSelect={onSelectBatch} 
              onDelete={onDeleteBatch}
            />
          ))}

          {/* Dotted "Add New Batch Shortcut" Placeholder Card */}
          <div
            onClick={onNewBatchClick}
            id="dotted-card-add-new"
            className="border-2 border-dashed border-workspace-sand hover:border-workspace-terracotta/40 rounded-xl p-6 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center space-y-3 bg-workspace-card/30 group min-h-[220px]"
          >
            <div className="w-10 h-10 rounded-full bg-workspace-bg border border-workspace-sand/40 flex items-center justify-center text-[#8F7466] group-hover:scale-105 transition-all shadow-3xs">
              <PlusCircle className="w-5 h-5 text-workspace-terracotta" />
            </div>
            
            <div className="space-y-1">
              <h4 className="serif-font text-sm font-bold text-workspace-brown group-hover:text-workspace-terracotta transition-colors">
                Upload New Meeting
              </h4>
              <p className="text-xxs text-workspace-charcoal/60 max-w-[200px] leading-relaxed mx-auto">
                Drag files or select your next meeting recording to start processing with secure AI models.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
