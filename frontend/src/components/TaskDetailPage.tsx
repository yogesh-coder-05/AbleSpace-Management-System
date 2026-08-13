'use client';

import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import {
  Lock,
  Eye,
  Share2,
  MoreHorizontal,
  PanelRight,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Plus,
  Settings,
  Paperclip,
  Send,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Check,
  Calendar,
  Tag,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react';
import { updateTaskApi } from '../lib/api';

interface TaskDetailPageProps {
  task: Task;
  onBack: () => void;
  onRefresh: () => void;
}

const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const p = priority?.toLowerCase();
  if (p === 'urgent' || p === 'high') {
    return (
      <div className="flex items-center gap-1 text-xs font-medium text-rose-500">
        <SignalHigh className="w-3.5 h-3.5 text-rose-500 shrink-0" />
        <span className="capitalize">{priority}</span>
      </div>
    );
  }
  if (p === 'medium') {
    return (
      <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
        <SignalMedium className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span className="capitalize">{priority}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-xs font-medium text-slate-400 dark:text-zinc-500">
      <SignalLow className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 shrink-0" />
      <span className="capitalize">{priority || 'Low'}</span>
    </div>
  );
};

export const TaskDetailPage: React.FC<TaskDetailPageProps> = ({
  task,
  onBack,
  onRefresh,
}) => {
  const [currentPriority, setCurrentPriority] = useState<TaskPriority>(task.priority || 'high');
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(task.status || 'todo');
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState(10);

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(task.comments || [
    {
      id: 'c_1',
      authorName: 'Ankit Dutta',
      text: 'dsds',
      createdAt: 'just now',
    },
  ]);

  const handlePriorityChange = async (p: TaskPriority) => {
    setCurrentPriority(p);
    setShowPriorityMenu(false);
    try {
      await updateTaskApi(task._id, { priority: p });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (s: TaskStatus) => {
    setCurrentStatus(s);
    setShowStatusMenu(false);
    try {
      await updateTaskApi(task._id, { status: s });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: `c_${Date.now()}`,
      authorName: 'You',
      text: commentText,
      createdAt: 'just now',
    };
    setComments((prev) => [...prev, newComment]);
    setCommentText('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans selection:bg-zinc-200">
      {/* Top Header Action Bar matching Figma screenshot */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800 px-6 py-3 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md z-30">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tasks</span>
        </button>

        {/* Top Right Action Icons */}
        <div className="flex items-center gap-1.5">
          <button className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition" title="Lock">
            <Lock className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 transition">
            <Eye className="w-3.5 h-3.5 text-blue-500" />
            <span>1</span>
          </button>
          <button className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition" title="Share">
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition" title="More Options">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition" title="Side Panel">
            <PanelRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Task Detail Content: 2 Columns (70% Left, 30% Right) matching Figma screenshot */}
      <div className="max-w-7xl mx-auto p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Main Content & Subtasks Table) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Title & Description */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
              {task.title}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {task.description ||
                'Create clear and detailed API documentation to guide developers in using the inventory and sales metrics APIs effectively.'}
            </p>
          </div>

          {/* Properties & Meta Rows matching exact Figma specs */}
          <div className="space-y-4 text-xs border-t border-b border-zinc-100 dark:border-zinc-800/80 py-4 font-sans">
            
            {/* Properties */}
            <div className="flex items-center gap-4">
              <span className="w-24 text-sm font-medium font-sans text-[#171717] dark:text-zinc-200 shrink-0">Properties</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-[24px] h-[24px] rounded-full bg-[#F4F4F5] dark:bg-zinc-800 text-[#171717] dark:text-zinc-200 font-sans font-normal text-xs flex items-center justify-center shrink-0">
                    A
                  </div>
                  <span className="text-[13px] font-medium font-sans text-[#171717] dark:text-zinc-100 leading-none">
                    Designer
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FEE2E2]/60 dark:bg-rose-950/40 text-[#DC2626] dark:text-rose-400 font-medium text-xs flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span>31 Jul</span>
                </span>
              </div>
            </div>

            {/* Labels */}
            <div className="flex items-center gap-4">
              <span className="w-24 text-sm font-medium font-sans text-[#171717] dark:text-zinc-200 shrink-0">Labels</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {['Research', 'Design', 'Development', 'Testing', 'Deployment'].map((lbl) => (
                  <span
                    key={lbl}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F4F4F5] dark:bg-zinc-800 text-[#171717] dark:text-zinc-200 font-medium text-[11px] border border-zinc-200/60 dark:border-zinc-700/60"
                  >
                    <Tag className="w-3 h-3 text-zinc-400" />
                    <span>{lbl}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="flex items-center gap-4">
              <span className="w-24 text-sm font-medium font-sans text-[#171717] dark:text-zinc-200 shrink-0">Resources</span>
              <button className="text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1.5 transition">
                <Paperclip className="w-3.5 h-3.5" />
                <span>Add document or link...</span>
              </button>
            </div>
          </div>

          {/* Subtasks Section Header & Table matching Figma screenshot */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-white">
              <ChevronDown className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>Subtasks</span>
            </div>

            {/* Subtasks Table Container */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
                  <thead className="bg-[#FAFAFA] dark:bg-zinc-800/60 text-zinc-400 font-semibold border-b border-zinc-200/60 dark:border-zinc-800">
                    <tr>
                      <th className="py-3 px-6 font-medium text-xs text-zinc-500 dark:text-zinc-400">Task</th>
                      <th className="py-3 px-4 font-medium text-xs text-zinc-500 dark:text-zinc-400">Priority</th>
                      <th className="py-3 px-4 font-medium text-xs text-zinc-500 dark:text-zinc-400">Members</th>
                      <th className="py-3 px-4 font-medium text-xs text-zinc-500 dark:text-zinc-400">Due Date</th>
                      <th className="py-3 px-4 text-right font-medium text-xs text-zinc-500 dark:text-zinc-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                    {/* Subtask 1 */}
                    <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition">
                      <td className="py-3.5 px-6 font-medium text-zinc-900 dark:text-white text-xs">Subtask 1</td>
                      <td className="py-3.5 px-4"><PriorityBadge priority="high" /></td>
                      <td className="py-3.5 px-4">
                        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700">
                          <img src="/avatar.png" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400">12 Sep 2026</td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="p-1 text-zinc-400 hover:text-zinc-600"><MoreHorizontal className="w-4 h-4" /></button>
                      </td>
                    </tr>

                    {/* Subtask 2 */}
                    <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition">
                      <td className="py-3.5 px-6 font-medium text-zinc-900 dark:text-white text-xs">Subtask 2</td>
                      <td className="py-3.5 px-4"><PriorityBadge priority="low" /></td>
                      <td className="py-3.5 px-4">
                        <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 font-bold text-[10px] text-zinc-600 dark:text-zinc-300 flex items-center justify-center">CN</span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400">15 Sep 2026</td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="p-1 text-zinc-400 hover:text-zinc-600"><MoreHorizontal className="w-4 h-4" /></button>
                      </td>
                    </tr>

                    {/* Subtask 3 */}
                    <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition">
                      <td className="py-3.5 px-6 font-medium text-zinc-900 dark:text-white text-xs">Subtask 3</td>
                      <td className="py-3.5 px-4"><PriorityBadge priority="medium" /></td>
                      <td className="py-3.5 px-4">
                        <span className="w-5 h-5 rounded-full border border-dashed border-zinc-300 text-zinc-400 flex items-center justify-center font-bold text-xs">+</span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400">18 Sep 2026</td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="p-1 text-zinc-400 hover:text-zinc-600"><MoreHorizontal className="w-4 h-4" /></button>
                      </td>
                    </tr>

                    {/* Add Subtasks Row */}
                    <tr className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition">
                      <td colSpan={5} className="py-2.5 px-6">
                        <button className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Subtasks</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Subtasks / Comments Feed matching Figma screenshot */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Subtasks</h3>

            {/* Existing Comment Feed */}
            {comments.map((c) => (
              <div key={c.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-4 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
                      <img src="/avatar.png" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-900 dark:text-white">{c.authorName}</span>
                    <span className="text-[11px] text-zinc-400">{c.createdAt}</span>
                  </div>
                  <button className="text-zinc-400 hover:text-zinc-600"><MoreHorizontal className="w-4 h-4" /></button>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 pl-8">{c.text}</p>
              </div>
            ))}

            {/* Leave a Reply Input Box */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-3 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 flex-1">
                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700">
                  <img src="/avatar.png" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Leave a reply..."
                  className="w-full text-xs bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1.5 shrink-0 text-zinc-400">
                <button className="p-1 hover:text-zinc-600 dark:hover:text-zinc-200"><Paperclip className="w-4 h-4" /></button>
                <button onClick={handleAddComment} className="p-1 text-zinc-800 dark:text-white hover:opacity-80"><Send className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Add a Comment Input Box */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-4 flex items-center justify-between gap-3 shadow-2xs">
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full text-xs bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
              />
              <div className="flex items-center gap-1.5 shrink-0 text-zinc-400">
                <button className="p-1 hover:text-zinc-600 dark:hover:text-zinc-200"><Paperclip className="w-4 h-4" /></button>
                <button className="p-1 text-zinc-800 dark:text-white hover:opacity-80"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar Panel (Details & Updates Cards matching Figma screenshot) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Details Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-5 space-y-4 shadow-2xs font-sans">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white">
                <ChevronDown className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
                <span>Details</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-900 dark:text-white">
                <button className="p-1 hover:opacity-80 text-zinc-900 dark:text-white"><Plus className="w-3.5 h-3.5" /></button>
                <button className="p-1 hover:opacity-80 text-zinc-900 dark:text-white"><Settings className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            {/* Field Grid Rows */}
            <div className="space-y-3 text-xs">
              
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="capitalize">{currentStatus}</span>
                </span>
              </div>

              {/* Priority with Interactive Popover Dropdown matching Figma */}
              <div className="flex items-center justify-between relative">
                <span className="text-zinc-400 font-medium">Priority</span>
                
                <button
                  onClick={() => setShowPriorityMenu(!showPriorityMenu)}
                  className="flex items-center gap-1 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-2 py-1 rounded-md transition"
                >
                  <PriorityBadge priority={currentPriority} />
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {/* Priority Selection Dropdown Menu matching Figma screenshot */}
                {showPriorityMenu && (
                  <div className="absolute right-0 top-7 w-40 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => handlePriorityChange('none')}
                      className="w-full px-3 py-1.5 text-xs text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-between text-zinc-500 font-medium"
                    >
                      <div className="flex items-center gap-1.5">
                        <SignalLow className="w-3 h-3 text-zinc-300" />
                        <span>No Priority</span>
                      </div>
                      {currentPriority === 'none' && <Check className="w-3 h-3 text-zinc-800" />}
                    </button>
                    
                    <button
                      onClick={() => handlePriorityChange('urgent')}
                      className="w-full px-3 py-1.5 text-xs text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-between text-rose-500 font-medium"
                    >
                      <div className="flex items-center gap-1.5">
                        <SignalHigh className="w-3 h-3 text-rose-500" />
                        <span>Urgent</span>
                      </div>
                      {currentPriority === 'urgent' && <Check className="w-3 h-3 text-zinc-800" />}
                    </button>

                    <button
                      onClick={() => handlePriorityChange('high')}
                      className="w-full px-3 py-1.5 text-xs text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-between text-rose-500 font-medium"
                    >
                      <div className="flex items-center gap-1.5">
                        <SignalHigh className="w-3 h-3 text-rose-500" />
                        <span>High</span>
                      </div>
                      {currentPriority === 'high' && <Check className="w-3 h-3 text-zinc-800" />}
                    </button>

                    <button
                      onClick={() => handlePriorityChange('medium')}
                      className="w-full px-3 py-1.5 text-xs text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-between text-amber-500 font-medium"
                    >
                      <div className="flex items-center gap-1.5">
                        <SignalMedium className="w-3 h-3 text-amber-500" />
                        <span>Medium</span>
                      </div>
                      {currentPriority === 'medium' && <Check className="w-3 h-3 text-zinc-800" />}
                    </button>

                    <button
                      onClick={() => handlePriorityChange('low')}
                      className="w-full px-3 py-1.5 text-xs text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-between text-slate-400 font-medium"
                    >
                      <div className="flex items-center gap-1.5">
                        <SignalLow className="w-3 h-3 text-slate-400" />
                        <span>Low</span>
                      </div>
                      {currentPriority === 'low' && <Check className="w-3 h-3 text-zinc-800" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Members */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Members</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
                    <img src="/avatar.png" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium">{task.assigneeName || 'Dexter'}</span>
                </div>
              </div>

              {/* Dates Row with Interactive Calendar Popover matching Figma screenshot */}
              <div className="flex items-center justify-between relative">
                <span className="text-zinc-400 font-medium">Dates</span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[11px] font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition"
                  >
                    <Calendar className="w-3 h-3 text-zinc-500" />
                    <span>Jan {selectedDay}</span>
                  </button>

                  <ArrowRight className="w-3 h-3 text-zinc-400 shrink-0" />

                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition"
                  >
                    <Calendar className="w-3 h-3 text-zinc-400" />
                    <span>End</span>
                  </button>
                </div>

                {/* Calendar Picker Popup Card matching exact Figma screenshot */}
                {showDatePicker && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDatePicker(false)} />
                    <div className="absolute right-0 top-7 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_12px_30px_-6px_rgba(0,0,0,0.15)] border border-zinc-200/90 dark:border-zinc-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150 font-sans select-none">
                      
                      {/* Header Month Selector */}
                      <div className="flex items-center justify-between mb-3 px-1 text-xs font-semibold text-zinc-900 dark:text-white">
                        <button className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span>January 2026</span>
                        <button className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Day of Week Labels */}
                      <div className="grid grid-cols-7 text-center text-[11px] font-medium text-zinc-400 mb-2">
                        <span>Su</span>
                        <span>Mo</span>
                        <span>Tu</span>
                        <span>We</span>
                        <span>Th</span>
                        <span>Fr</span>
                        <span>Sa</span>
                      </div>

                      {/* Days Grid matching Figma screenshot */}
                      <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
                        {/* Prev Month Day */}
                        <span className="py-1 text-zinc-300 dark:text-zinc-600">30</span>
                        
                        {/* Current Month Days 1-9 */}
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                          <button
                            key={d}
                            onClick={() => { setSelectedDay(d); setShowDatePicker(false); }}
                            className="py-1 flex items-center justify-center text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                          >
                            {d}
                          </button>
                        ))}

                        {/* Selected Date Day (10) - Dark Circle matching image */}
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => { setSelectedDay(10); setShowDatePicker(false); }}
                            className="w-7 h-7 rounded-full bg-[#171717] dark:bg-white text-white dark:text-zinc-900 font-bold flex items-center justify-center text-xs shadow-xs"
                          >
                            10
                          </button>
                        </div>

                        {[11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((d) => (
                          <button
                            key={d}
                            onClick={() => { setSelectedDay(d); setShowDatePicker(false); }}
                            className="py-1 flex items-center justify-center text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                          >
                            {d}
                          </button>
                        ))}

                        {/* Highlighted Today Circle (24) matching image */}
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => { setSelectedDay(24); setShowDatePicker(false); }}
                            className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium flex items-center justify-center text-xs"
                          >
                            24
                          </button>
                        </div>

                        {[25, 26, 27, 28, 29, 30, 31].map((d) => (
                          <button
                            key={d}
                            onClick={() => { setSelectedDay(d); setShowDatePicker(false); }}
                            className="py-1 flex items-center justify-center text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                          >
                            {d}
                          </button>
                        ))}

                        {/* Next Month Days */}
                        <span className="py-1 text-zinc-300 dark:text-zinc-600">1</span>
                        <span className="py-1 text-zinc-300 dark:text-zinc-600">2</span>
                        <span className="py-1 text-zinc-300 dark:text-zinc-600">3</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Labels */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Labels</span>
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">Design</span>
              </div>

              {/* Teams */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Teams</span>
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">Engineering</span>
              </div>

              {/* Reporter */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Reporter</span>
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">Dexter</span>
              </div>

            </div>
          </div>

          {/* Updates Card matching Figma screenshot */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-5 space-y-3.5 shadow-2xs font-sans">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white pb-1 border-b border-zinc-100 dark:border-zinc-800">
              <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />
              <span>Updates</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                  <SignalHigh className="w-3 h-3" />
                </div>
                <div>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">You</span>
                  <span className="text-zinc-500"> changed priority from No priority to Urgent</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 mt-0.5">
                  <img src="/avatar.png" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">You</span>
                  <span className="text-zinc-500"> posted an update · Aug 2026</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
