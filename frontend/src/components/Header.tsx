'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  SlidersHorizontal,
  Columns,
  PanelLeft,
  Moon,
  Sun,
  Palette,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useColorMode } from '../context/ColorModeContext';
import { useGuest } from '../context/GuestContext';
import { ColorMode, TaskPriority } from '../types/task';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  viewMode: 'board' | 'list';
  setViewMode: (mode: 'board' | 'list') => void;
  selectedPriority: TaskPriority | 'all';
  setSelectedPriority: (p: TaskPriority | 'all') => void;
  onAddTaskClick: () => void;
  selectedProjectName?: string | null;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  selectedPriority,
  setSelectedPriority,
  onAddTaskClick,
  selectedProjectName,
  onToggleSidebar,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { colorMode, setColorMode } = useColorMode();
  const { user } = useGuest();

  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const colorOptions: { mode: ColorMode; label: string; colorClass: string }[] = [
    { mode: 'amber', label: 'Amber', colorClass: 'bg-amber-500' },
    { mode: 'blue', label: 'Blue', colorClass: 'bg-blue-500' },
    { mode: 'pink', label: 'Pink', colorClass: 'bg-pink-500' },
    { mode: 'rose', label: 'Rose', colorClass: 'bg-rose-500' },
    { mode: 'emerald', label: 'Emerald', colorClass: 'bg-emerald-500' },
    { mode: 'black', label: 'Black', colorClass: 'bg-zinc-900 dark:bg-zinc-100' },
  ];

  return (
    <header className="w-full border-b border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sticky top-0 z-30 font-sans selection:bg-zinc-200">
      
      {/* Sidebar Toggle & Title & Active Team Avatars Badge matching Figma screenshot */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          title="Toggle Sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>


        <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
          {selectedProjectName ? selectedProjectName : 'Tasks'}
        </h1>

        {/* Active Team Members Pill Badge matching Figma screenshot */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm ml-1">
          <div className="flex -space-x-2 overflow-hidden">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 via-rose-500 to-pink-500 text-white flex items-center justify-center font-bold text-[9px] ring-2 ring-white dark:ring-zinc-800">
              M
            </div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-[9px] ring-2 ring-white dark:ring-zinc-800">
              D
            </div>
          </div>
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 pr-1">2</span>
        </div>
      </div>

      {/* Right Controls matching Figma screenshot */}
      <div className="flex items-center gap-2.5">
        
        {/* Team Avatars Top Right matching Figma screenshot */}
        <div className="hidden md:flex -space-x-2 overflow-hidden mr-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-[10px] ring-2 ring-white dark:ring-zinc-900 shadow-sm">
            DX
          </div>
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-[10px] ring-2 ring-white dark:ring-zinc-900 shadow-sm">
            QA
          </div>
        </div>

        {/* Expandable Search Button / Input */}
        <div className="relative">
          {showSearchInput ? (
            <div className="relative w-48 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => !searchQuery && setShowSearchInput(false)}
                placeholder="Search tasks..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs border border-zinc-300 dark:border-zinc-700 focus:outline-none transition"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowSearchInput(true)}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Fields Button matching Figma screenshot */}
        <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 transition">
          <Columns className="w-3.5 h-3.5" />
          <span>Fields</span>
        </button>

        {/* Filter Button matching Figma screenshot */}
        <div className="relative">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition"
            title="Filter Priority"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {showFilterMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 py-2 z-40 animate-in fade-in duration-150">
              <div className="px-3 py-1 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Filter By Priority
              </div>
              <button
                onClick={() => {
                  setSelectedPriority('all');
                  setShowFilterMenu(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs transition ${
                  selectedPriority === 'all'
                    ? 'font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                All Priorities
              </button>
              <button
                onClick={() => {
                  setSelectedPriority('high');
                  setShowFilterMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-amber-600 font-medium hover:bg-amber-50 dark:hover:bg-amber-950/30"
              >
                ⚡ High
              </button>
              <button
                onClick={() => {
                  setSelectedPriority('medium');
                  setShowFilterMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-blue-600 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/30"
              >
                ⚡ Medium
              </button>
            </div>
          )}
        </div>

        {/* Profile / Theme Selector Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs shadow-sm hover:opacity-90 transition"
          >
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'DX'}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-3 z-50 animate-in fade-in duration-150">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition mb-2"
              >
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
                  <span>Change Theme</span>
                </div>
                <span className="text-[10px] font-semibold uppercase text-zinc-400">
                  {theme}
                </span>
              </button>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-2">
                <div className="px-2 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Palette className="w-3 h-3" />
                  <span>Color Mode</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 p-1">
                  {colorOptions.map((opt) => (
                    <button
                      key={opt.mode}
                      onClick={() => setColorMode(opt.mode)}
                      className={`flex items-center gap-1.5 p-1.5 rounded-lg text-[11px] font-medium border transition ${
                        colorMode === opt.mode
                          ? 'border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-800'
                          : 'border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${opt.colorClass}`} />
                      <span className="truncate">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Black Pill + Add Task Button matching Figma screenshot */}
        <button
          onClick={onAddTaskClick}
          className="py-1.5 px-3.5 bg-[#09090B] hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>
    </header>
  );
};

