'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckSquare, FolderKanban, Settings, ChevronDown, ChevronsUpDown, X } from 'lucide-react';
import { useGuest } from '../context/GuestContext';

interface SidebarProps {
  onSelectProject?: (projId: string | null) => void;
  selectedProjectId?: string | null;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onSelectProject,
  selectedProjectId,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const pathname = usePathname();
  const { user } = useGuest();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 md:w-60 h-screen border-r border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between p-4 shrink-0 font-sans selection:bg-zinc-200 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          
          {/* User Profile Selector Header matching Figma screenshot */}
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-purple-100 dark:ring-purple-950">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'DX'}
              </div>
              <span className="text-sm font-semibold text-zinc-900 dark:text-white tracking-tight">
                {user?.name || 'Dexter'}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <ChevronsUpDown className="w-4 h-4 text-zinc-400" />
              {/* Close Button on Mobile */}
              {onCloseMobile && (
                <button
                  onClick={onCloseMobile}
                  className="p-1 md:hidden text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Workspace Navigation Section matching Figma screenshot */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <span>Workspace</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>

            <Link
              href="/"
              onClick={() => {
                if (onSelectProject) onSelectProject(null);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                pathname === '/' && !selectedProjectId
                  ? 'bg-[#F4F4F6] text-zinc-900 dark:bg-zinc-800 dark:text-white font-semibold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <span>Tasks</span>
            </Link>

            <button
              onClick={() => {
                if (onSelectProject) onSelectProject('proj_1');
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                selectedProjectId
                  ? 'bg-[#F4F4F6] text-zinc-900 dark:bg-zinc-800 dark:text-white font-semibold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <FolderKanban className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <span>Projects</span>
            </button>
          </div>
        </div>

        {/* Footer Settings Link */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
          <Link
            href="/settings/profile"
            onClick={() => onCloseMobile && onCloseMobile()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <Settings className="w-4 h-4 text-zinc-500" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
};
