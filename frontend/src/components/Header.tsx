'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  SlidersHorizontal,
  Filter,
  Columns,
  PanelLeft,
  Moon,
  Sun,
  Palette,
  List,
  Grid2x2,
  Check,
  SignalHigh,
  SignalMedium,
  ChevronRight,
  Square,
  Settings as SettingsIcon,
  Circle,
  Users,
  Calendar,
  Building2,
  Tag,
  User,
  LogOut,
  ChevronsUpDown,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useColorMode } from '../context/ColorModeContext';
import { useGuest } from '../context/GuestContext';
import { ColorMode, TaskPriority, VisibleFields } from '../types/task';
import Link from 'next/link';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  viewMode: 'board' | 'list';
  setViewMode: (mode: 'board' | 'list') => void;
  selectedPriority: TaskPriority | 'all';
  setSelectedPriority: (p: TaskPriority | 'all') => void;
  onAddTaskClick: () => void;
  onAddProjectClick?: () => void;
  isProjectsView?: boolean;
  selectedProjectName?: string | null;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  visibleFields: VisibleFields;
  setVisibleFields: React.Dispatch<React.SetStateAction<VisibleFields>>;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  selectedPriority,
  setSelectedPriority,
  onAddTaskClick,
  onAddProjectClick,
  isProjectsView = false,
  selectedProjectName,
  onToggleSidebar,
  isSidebarCollapsed = false,
  visibleFields,
  setVisibleFields,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { colorMode, setColorMode } = useColorMode();
  const { user, logoutGuest } = useGuest();

  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showFieldsMenu, setShowFieldsMenu] = useState(false);
  const [showThemeSubmenu, setShowThemeSubmenu] = useState(false);
  const [showColorSubmenu, setShowColorSubmenu] = useState(false);
  const [showPrioritySubmenu, setShowPrioritySubmenu] = useState(false);

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setShowSearchInput(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const colorOptions: { mode: ColorMode; label: string; colorClass: string }[] = [
    { mode: 'amber', label: 'Amber', colorClass: 'bg-[#D97706]' },
    { mode: 'blue', label: 'Blue', colorClass: 'bg-[#7C3AED]' },
    { mode: 'pink', label: 'Pink', colorClass: 'bg-[#DB2777]' },
    { mode: 'rose', label: 'Rose', colorClass: 'bg-[#E11D48]' },
    { mode: 'emerald', label: 'Emerald', colorClass: 'bg-[#059669]' },
    { mode: 'black', label: 'Black', colorClass: 'bg-zinc-900 dark:bg-zinc-100' },
  ];

  return (
    <header className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800 sticky top-0 z-30 font-sans selection:bg-zinc-200">
      {/* Top Sidebar Toggle Bar with Guest Profile (when sidebar is collapsed) and Vertical Line Divider */}
      <div className="px-3 sm:px-6 py-2 border-b border-zinc-200/60 dark:border-zinc-800/80 flex items-center gap-2 sm:gap-3 overflow-x-auto selection:bg-none">
        
        {/* Guest Profile Button - Only visible when Sidebar is Collapsed / Hidden */}
        {isSidebarCollapsed && (
          <>
            <div className="relative shrink-0">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowThemeSubmenu(false);
                  setShowColorSubmenu(false);
                }}
                className="flex items-center gap-1.5 p-1 px-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition select-none text-left"
                title="Profile & Settings"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-[10px] shadow-xs ring-1 ring-purple-200 dark:ring-purple-900 overflow-hidden shrink-0">
                  <img src="/avatar.png" alt="User Avatar" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-semibold text-zinc-900 dark:text-white tracking-tight shrink-0">
                  {user?.name || 'Guest'}
                </span>
                <ChevronsUpDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              </button>
            </div>

            <div className="h-3.5 w-[1px] bg-zinc-200 dark:bg-zinc-700 shrink-0" />
          </>
        )}

        {/* Sidebar Toggle PanelLeft Icon Button */}
        <button
          onClick={onToggleSidebar}
          className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition shrink-0"
          title="Toggle Sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="h-3.5 w-[1px] bg-zinc-200 dark:bg-zinc-700 shrink-0" />
        
        {/* Breadcrumbs: Projects > Design Homepage */}
        {selectedProjectName && selectedProjectName !== 'Projects' ? (
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium select-none whitespace-nowrap">
            <span className="hover:text-zinc-800 dark:hover:text-white transition">Projects</span>
            <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
            <span className="font-semibold text-zinc-900 dark:text-white">{selectedProjectName}</span>
          </div>
        ) : null}
      </div>

      {/* Main Header Action Bar matching exact Figma screenshot */}
      <div className="px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Title: Tasks */}
        <h1 className="text-base sm:text-xl font-bold text-zinc-900 dark:text-white tracking-tight shrink-0">
          {selectedProjectName && selectedProjectName !== 'Projects' ? 'Tasks' : selectedProjectName ? selectedProjectName : 'Tasks'}
        </h1>

        {/* Right Controls matching Figma screenshot */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Expandable Search Button & Input Box matching exact Figma spec */}
          <div className="relative">
            {showSearchInput ? (
              <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2 py-1.5 w-36 sm:w-64 transition-all focus-within:border-zinc-400 dark:focus-within:border-zinc-600 shadow-2xs">
                <Search className="w-4 h-4 text-zinc-400 shrink-0 mr-2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setShowSearchInput(false)}
                  placeholder="Design Homepage"
                  className="w-full bg-transparent text-xs font-sans text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
                />
                <kbd className="w-[31px] h-[22px] bg-[#F4F4F5] dark:bg-zinc-800 rounded-md border border-zinc-200/80 dark:border-zinc-700/80 flex items-center justify-center shrink-0 select-none ml-2">
                  <span className="w-[19px] h-[16px] flex items-center justify-center font-sans font-medium text-xs text-[#171717] dark:text-zinc-200 leading-none">
                    ⌘F
                  </span>
                </kbd>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowSearchInput(true);
                  setTimeout(() => searchInputRef.current?.focus(), 50);
                }}
                className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition"
                title="Search (⌘F)"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

        {/* Fields Button & Popover matching exact Figma screenshot */}
        <div className="relative">
          <button
            onClick={() => {
              setShowFieldsMenu(!showFieldsMenu);
              setShowFilterMenu(false);
              setShowProfileMenu(false);
            }}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-900 text-xs font-medium rounded-xl border transition ${
              showFieldsMenu
                ? 'border-zinc-400 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Fields</span>
          </button>

          {showFieldsMenu && (
            <>
              {/* Click outside backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowFieldsMenu(false)}
              />

              {/* Popover Dropdown Card matching exact Figma design 100% same to same */}
              <div className="absolute left-0 sm:left-auto right-0 mt-2 w-72 bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_12px_30px_-6px_rgba(0,0,0,0.12)] border border-zinc-200/90 dark:border-zinc-800 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 font-sans">
                
                {/* Segmented View Mode Toggle: List vs Board */}
                <div className="bg-[#F3F4F6] dark:bg-zinc-800/90 p-1 rounded-xl flex items-center gap-1 mb-3">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-zinc-700 text-[#171717] dark:text-white shadow-xs border border-zinc-200/80 dark:border-zinc-600'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4 text-[#171717] dark:text-zinc-200" />
                    <span>List</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('board')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                      viewMode === 'board'
                        ? 'bg-white dark:bg-zinc-700 text-[#171717] dark:text-white shadow-xs border border-zinc-200/80 dark:border-zinc-600'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    <Grid2x2 className="w-4 h-4 text-[#171717] dark:text-zinc-200" />
                    <span>Board</span>
                  </button>
                </div>

                {/* Field Toggles List matching Figma specs */}
                <div className="space-y-0.5 px-0.5">
                  {[
                    { id: 'priority', label: 'Priority', checked: visibleFields.priority },
                    { id: 'members', label: 'Members', checked: visibleFields.members },
                    { id: 'dueDate', label: 'Due Date', checked: visibleFields.dueDate },
                    { id: 'membersAlt', label: 'Members', checked: visibleFields.membersAlt },
                    { id: 'labels', label: 'Labels', checked: visibleFields.labels },
                    { id: 'status', label: 'Status', checked: visibleFields.status },
                    { id: 'reporter', label: 'Reporter', checked: visibleFields.reporter },
                  ].map((field) => (
                    <div
                      key={field.id}
                      onClick={() =>
                        setVisibleFields((prev) => ({
                          ...prev,
                          [field.id]: !prev[field.id as keyof typeof visibleFields],
                        }))
                      }
                      className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40 cursor-pointer transition select-none"
                    >
                      <span className="text-xs font-medium font-sans text-[#171717] dark:text-zinc-200 tracking-normal">
                        {field.label}
                      </span>

                      {/* Rounded Square Checkbox matching Figma base-primary #171717 */}
                      <div
                        className={`w-5 h-5 rounded-[6px] flex items-center justify-center transition-all ${
                          field.checked
                            ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717] shadow-xs'
                            : 'bg-[#E5E7EB] dark:bg-zinc-800'
                        }`}
                      >
                        {field.checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Filter Button & Popover Menu matching exact Figma screenshot */}
        <div className="relative">
          <button
            onClick={() => {
              setShowFilterMenu(!showFilterMenu);
              setShowPrioritySubmenu(false);
            }}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition select-none active:scale-95"
            title="Filter Priority"
          >
            <Filter className="w-3.5 h-3.5 text-[#171717] dark:text-zinc-200 stroke-[1.5]" />
          </button>

          {showFilterMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => {
                  setShowFilterMenu(false);
                  setShowPrioritySubmenu(false);
                }}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_12px_30px_-6px_rgba(0,0,0,0.15)] border border-zinc-200/90 dark:border-zinc-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 font-sans text-xs font-medium text-zinc-700 dark:text-zinc-300">
                <div className="space-y-0.5">

                  {/* Status Item */}
                  <div className="relative">
                    <button className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                      <div className="flex items-center gap-2.5">
                        <Circle className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                        <span>Status</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                  </div>

                  {/* Priority Item with Submenu matching exact Figma screenshot */}
                  <div className="relative">
                    <button
                      onClick={() => setShowPrioritySubmenu(!showPrioritySubmenu)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition ${
                        showPrioritySubmenu ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <SignalMedium className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                        <span>Priority</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    </button>

                    {/* Priority Submenu Card matching exact Figma screenshot */}
                    {showPrioritySubmenu && (
                      <div className="relative sm:absolute sm:right-full sm:top-0 sm:mr-2 mt-1 sm:mt-0 w-full sm:w-44 bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_12px_30px_-6px_rgba(0,0,0,0.18)] border border-zinc-200/90 dark:border-zinc-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 font-sans">
                        <p className="text-xs text-zinc-400 font-normal px-1 pb-2">
                          Priority
                        </p>
                        <div className="space-y-1 text-xs">
                          {/* No Priority */}
                          <button
                            onClick={() => {
                              setSelectedPriority('all');
                              setShowFilterMenu(false);
                            }}
                            className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-3.5 h-3.5 flex items-center justify-center font-bold text-xs">-</span>
                              <span>No Priority</span>
                            </div>
                            {selectedPriority === 'all' && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />}
                          </button>

                          {/* Urgent */}
                          <button
                            onClick={() => {
                              setSelectedPriority('urgent');
                              setShowFilterMenu(false);
                            }}
                            className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-rose-500 font-medium transition"
                          >
                            <div className="flex items-center gap-2">
                              <SignalHigh className="w-3.5 h-3.5 text-rose-500" />
                              <span>Urgent</span>
                            </div>
                            {selectedPriority === 'urgent' && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />}
                          </button>

                          {/* High */}
                          <button
                            onClick={() => {
                              setSelectedPriority('high');
                              setShowFilterMenu(false);
                            }}
                            className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-amber-600 dark:text-amber-500 font-medium transition"
                          >
                            <div className="flex items-center gap-2">
                              <SignalHigh className="w-3.5 h-3.5 text-amber-500" />
                              <span>High</span>
                            </div>
                            {selectedPriority === 'high' && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />}
                          </button>

                          {/* Medium */}
                          <button
                            onClick={() => {
                              setSelectedPriority('medium');
                              setShowFilterMenu(false);
                            }}
                            className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-amber-500 font-medium transition"
                          >
                            <div className="flex items-center gap-2">
                              <SignalMedium className="w-3.5 h-3.5 text-amber-400" />
                              <span>Medium</span>
                            </div>
                            {selectedPriority === 'medium' && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />}
                          </button>

                          {/* Low */}
                          <button
                            onClick={() => {
                              setSelectedPriority('low');
                              setShowFilterMenu(false);
                            }}
                            className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 font-medium transition"
                          >
                            <div className="flex items-center gap-2">
                              <SignalMedium className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Low</span>
                            </div>
                            {selectedPriority === 'low' && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Members Item */}
                  <div className="relative">
                    <button className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                      <div className="flex items-center gap-2.5">
                        <Users className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                        <span>Members</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                  </div>

                  {/* Due Date Item */}
                  <div className="relative">
                    <button className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                        <span>Due Date</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                  </div>

                  {/* Teams Item */}
                  <div className="relative">
                    <button className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                      <div className="flex items-center gap-2.5">
                        <Building2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                        <span>Teams</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                  </div>

                  {/* Labels Item */}
                  <div className="relative">
                    <button className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                      <div className="flex items-center gap-2.5">
                        <Tag className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                        <span>Labels</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                  </div>

                  {/* Reporter Item */}
                  <div className="relative">
                    <button className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                      <div className="flex items-center gap-2.5">
                        <User className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                        <span>Reporter</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                  </div>

                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile / Theme Selector Toggle matching exact Figma screenshot */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowThemeSubmenu(false);
              setShowColorSubmenu(false);
            }}
            className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-purple-500/20 shadow-sm hover:opacity-90 transition shrink-0 select-none"
          >
            <img src="/avatar.png" alt="User Avatar" className="w-full h-full object-cover" />
          </button>

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
              <div className="absolute right-0 mt-2 w-[220px] sm:w-[240px] max-w-[calc(100vw-24px)] min-h-[266px] bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-200/90 dark:border-zinc-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150 font-sans flex flex-col justify-between">
                
                {/* Centered Avatar Image & Email matching Figma screenshot */}
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

                {/* Menu Options matching Figma screenshot */}
                <div className="pt-2 space-y-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  
                  {/* Change Theme Item with Responsive Submenu */}
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

                    {/* Theme Submenu Card - 100% Responsive */}
                    {showThemeSubmenu && (
                      <div className="relative sm:absolute sm:right-full sm:top-0 sm:mr-2 mt-1 sm:mt-0 w-full sm:w-44 bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_12px_30px_-6px_rgba(0,0,0,0.18)] border border-zinc-200/90 dark:border-zinc-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 font-sans">
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

                  {/* Color Mode Item with Responsive Submenu */}
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

                    {/* Color Mode Submenu Card - 100% Responsive */}
                    {showColorSubmenu && (
                      <div className="relative sm:absolute sm:right-full sm:top-0 sm:mr-2 mt-1 sm:mt-0 w-full sm:w-44 bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_12px_30px_-6px_rgba(0,0,0,0.18)] border border-zinc-200/90 dark:border-zinc-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 font-sans">
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

        {/* Action Button (Add Project in Projects View, Add Task in Tasks View) */}
        {isProjectsView ? (
          <button
            onClick={onAddProjectClick}
            className="py-1.5 px-3.5 accent-btn text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        ) : (
          <button
            onClick={onAddTaskClick}
            className="py-1.5 px-3.5 accent-btn text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        )}
      </div>
    </div>
  </header>
);
};

