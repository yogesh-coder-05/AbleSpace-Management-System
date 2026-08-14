'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import { useColorMode } from '../context/ColorModeContext';
import { ColorMode } from '../types/task';
import {
  CheckSquare,
  FolderKanban,
  Settings as SettingsIcon,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  X,
  Sun,
  Moon,
  Square,
  Check,
  LogOut,
} from 'lucide-react';
import { useGuest } from '../context/GuestContext';

interface SidebarProps {
  onSelectProject?: (projId: string | null, name?: string | null) => void;
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
  const { user, logoutGuest } = useGuest();
  const { theme, toggleTheme } = useTheme();
  const { colorMode, setColorMode } = useColorMode();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeSubmenu, setShowThemeSubmenu] = useState(false);
  const [showColorSubmenu, setShowColorSubmenu] = useState(false);

  const colorOptions: { mode: ColorMode; label: string; colorClass: string }[] = [
    { mode: 'amber', label: 'Amber', colorClass: 'bg-[#D97706]' },
    { mode: 'blue', label: 'Blue', colorClass: 'bg-[#7C3AED]' },
    { mode: 'pink', label: 'Pink', colorClass: 'bg-[#DB2777]' },
    { mode: 'rose', label: 'Rose', colorClass: 'bg-[#E11D48]' },
    { mode: 'emerald', label: 'Emerald', colorClass: 'bg-[#059669]' },
    { mode: 'black', label: 'Black', colorClass: 'bg-zinc-900 dark:bg-zinc-100' },
  ];

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
          <div className="relative">
            <div
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowThemeSubmenu(false);
                setShowColorSubmenu(false);
              }}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-purple-100 dark:ring-purple-950 overflow-hidden shrink-0">
                  <img src="/avatar.png" alt="User Avatar" className="w-full h-full object-cover" />
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
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseMobile();
                    }}
                    className="p-1 md:hidden text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Profile Popover Menu Card */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowThemeSubmenu(false);
                    setShowColorSubmenu(false);
                  }}
                />
                <div className="absolute top-full left-0 mt-1.5 w-full min-w-[220px] bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-950/10 dark:shadow-black/50 border border-zinc-200/90 dark:border-zinc-800 p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-sans space-y-3">
                  
                  {/* Centered Avatar Image & Email */}
                  <div className="flex flex-col items-center justify-center pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-xs border border-zinc-200 dark:border-zinc-700 mb-2">
                      <img src="/avatar.png" alt="Dexter Avatar" className="w-full h-full object-cover" />
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-white">
                      {user?.name || 'Dexter'}
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-normal mt-0.5">
                      {user?.email || 'Dexter@gmail.com'}
                    </p>
                  </div>

                  {/* Menu Options */}
                  <div className="space-y-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    
                    {/* Change Theme Item with Submenu */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setShowThemeSubmenu(!showThemeSubmenu);
                          setShowColorSubmenu(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <Sun className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                          <span>Change Theme</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                      </button>

                      {/* Theme Submenu Card */}
                      {showThemeSubmenu && (
                        <div className="absolute left-full top-0 ml-2 w-44 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-950/10 dark:shadow-black/50 border border-zinc-200/90 dark:border-zinc-800 p-3 z-50 animate-in fade-in slide-in-from-left-2 duration-150 font-sans">
                          <p className="text-xs text-zinc-400 font-normal px-1 pb-2">
                            Theme
                          </p>
                          <div className="space-y-1">
                            <button
                              onClick={() => {
                                if (theme !== 'light') toggleTheme();
                                setShowThemeSubmenu(false);
                              }}
                              className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-900 dark:text-white transition"
                            >
                              <div className="flex items-center gap-2.5">
                                <Sun className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                                <span>Light</span>
                              </div>
                              {theme === 'light' && <Check className="w-4 h-4 text-zinc-900 dark:text-white" />}
                            </button>

                            <button
                              onClick={() => {
                                if (theme !== 'dark') toggleTheme();
                                setShowThemeSubmenu(false);
                              }}
                              className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-900 dark:text-white transition"
                            >
                              <div className="flex items-center gap-2.5">
                                <Moon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                                <span>Dark</span>
                              </div>
                              {theme === 'dark' && <Check className="w-4 h-4 text-zinc-900 dark:text-white" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Color Mode Item with Submenu */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setShowColorSubmenu(!showColorSubmenu);
                          setShowThemeSubmenu(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <Square className="w-4 h-4 text-zinc-900 dark:text-white fill-current" />
                          <span>Color Mode</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                      </button>

                      {/* Color Mode Submenu Card */}
                      {showColorSubmenu && (
                        <div className="absolute left-full top-0 ml-2 w-44 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-950/10 dark:shadow-black/50 border border-zinc-200/90 dark:border-zinc-800 p-3 z-50 animate-in fade-in slide-in-from-left-2 duration-150 font-sans">
                          <p className="text-xs text-zinc-400 font-normal px-1 pb-2">
                            Color Mode
                          </p>
                          <div className="space-y-1">
                            {colorOptions.map((opt) => (
                              <button
                                key={opt.mode}
                                onClick={() => {
                                  setColorMode(opt.mode);
                                  setShowColorSubmenu(false);
                                }}
                                className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-900 dark:text-white transition"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className={`w-4 h-4 rounded-[4px] shrink-0 ${opt.colorClass}`} />
                                  <span>{opt.label}</span>
                                </div>
                                {colorMode === opt.mode && <Check className="w-4 h-4 text-zinc-900 dark:text-white" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Settings Item */}
                    <Link
                      href="/settings/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-zinc-700 dark:text-zinc-300"
                    >
                      <SettingsIcon className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                      <span>Settings</span>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Workspace Navigation Section */}
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${!selectedProjectId || selectedProjectId !== 'projects_view'
                  ? 'bg-[#F4F4F6] text-zinc-900 dark:bg-zinc-800 dark:text-white font-semibold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
            >
              <CheckSquare className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <span>Tasks</span>
            </Link>

            <button
              onClick={() => {
                if (onSelectProject) onSelectProject('projects_view');
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${selectedProjectId === 'projects_view'
                  ? 'bg-[#F4F4F6] text-zinc-900 dark:bg-zinc-800 dark:text-white font-semibold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
            >
              <FolderKanban className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <span>Projects</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
