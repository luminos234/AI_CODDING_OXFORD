/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Briefcase, 
  FolderOpen, 
  Settings, 
  User, 
  LifeBuoy, 
  Sparkles, 
  RefreshCw,
  FileText
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onReset: () => void;
  onNewBatchClick: () => void;
}

export default function Sidebar({ currentTab, setCurrentTab, onReset, onNewBatchClick }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Briefcase },
    { id: 'library', label: 'Library Archive', icon: FolderOpen },
  ];

  const secondaryItems = [
    { id: 'templates', label: 'Briefing Templates', icon: FileText, disabled: true },
    { id: 'settings', label: 'Workspace Setup', icon: Settings, disabled: true },
  ];

  return (
    <aside className="w-68 bg-workspace-cream border-r border-workspace-sand flex flex-col h-screen sticky top-0 shrink-0 text-workspace-charcoal z-10">
      
      {/* Brand Suite Logotype */}
      <div className="p-6 border-b border-workspace-sand/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-workspace-brown flex items-center justify-center text-workspace-cream shadow-xs">
            <Sparkles className="w-5.5 h-5.5 text-workspace-beige" />
          </div>
          <div>
            <h1 className="serif-font text-lg font-bold tracking-tight text-workspace-brown leading-tight">
              Meeting Intelligence
            </h1>
            <span className="text-xxs font-mono uppercase tracking-widest text-[#8F7466] select-none block mt-0.5">
              Executive Suite v3.5
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={onNewBatchClick}
          id="btn-sidebar-quick-batch"
          className="w-full py-2.5 px-4 rounded-lg bg-workspace-brown hover:bg-[#32231C] active:bg-[#4E382E] text-workspace-cream text-xs font-semibold tracking-wide transition-all shadow-xs flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-workspace-beige" />
          <span>New Meeting Batch</span>
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <span className="px-3 text-xxs font-mono uppercase tracking-wider text-workspace-terracotta/80 font-semibold block mb-2 select-none">
            Core Workspace
          </span>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? 'bg-workspace-sand text-workspace-brown font-semibold'
                    : 'text-workspace-charcoal/80 hover:bg-workspace-sand/40 hover:text-workspace-brown'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-workspace-terracotta' : 'text-[#8F7C73]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-1">
          <span className="px-3 text-xxs font-mono uppercase tracking-wider text-[#8F7466] font-semibold block mb-2 select-none">
            Configurations
          </span>
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                disabled={item.disabled}
                id={`nav-${item.id}`}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all ${
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed text-workspace-charcoal/50'
                    : 'text-workspace-charcoal/80 hover:bg-workspace-sand/40'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className="w-4.5 h-4.5 text-[#8F7C73]/70" />
                  <span>{item.label}</span>
                </div>
                {item.disabled && (
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-sm bg-workspace-sand text-workspace-charcoal/30 scale-90">
                    SaaS
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Database Control utility */}
        <div className="pt-2">
          <button
            onClick={onReset}
            id="btn-sidebar-reset-db"
            className="w-full flex items-center gap-3.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-[#8F6E60] hover:bg-workspace-terracotta/10 hover:text-workspace-terracotta transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Factory Templates</span>
          </button>
        </div>
      </nav>

      {/* Profile & Support indicators footer */}
      <div className="p-4 border-t border-workspace-sand/80 bg-workspace-sand/15 space-y-3.5">
        <div className="flex items-center gap-3">
          <img 
            className="w-8.5 h-8.5 rounded-full object-cover border border-workspace-sand ring-1 ring-workspace-beige ring-offset-1 ring-offset-workspace-cream" 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
            alt="User profile" 
            referrerPolicy="no-referrer"
          />
          <div className="overflow-hidden">
            <h4 id="user-profile-title" className="text-xs font-semibold uppercase tracking-tight text-workspace-charcoal truncate">
              Jan Zaluska
            </h4>
            <span id="user-profile-sub" className="text-xxs font-mono tracking-tight text-workspace-charcoal/60 truncate block">
              jan.zaluska@gmail.com
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xxs text-[#8F7466] font-mono border-t border-workspace-sand/65 pt-2.5">
          <div className="flex items-center gap-1">
            <LifeBuoy className="w-3.5 h-3.5 text-workspace-sage" />
            <span>HQ Secure Gateway</span>
          </div>
          <span className="text-workspace-sage font-bold">● ONLINE</span>
        </div>
      </div>

    </aside>
  );
}
