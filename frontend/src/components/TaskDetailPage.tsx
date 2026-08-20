'use client';

import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import {
  Lock,
  Eye,
  Share2,
  MoreHorizontal,
  PanelRight,
  ChevronDown,
  ChevronUp,
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
import { updateTaskApi, addSubtaskApi, addCommentApi } from '../lib/api';
import { SubtaskItem, CommentItem } from '../types/task';

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
  if (p === 'low') {
    return (
      <div className="flex items-center gap-1 text-xs font-medium text-slate-400 dark:text-zinc-400">
        <SignalLow className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400 shrink-0" />
        <span className="capitalize">Low</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-xs font-medium text-slate-400 dark:text-zinc-400">
      <SignalLow className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400 shrink-0" />
      <span>No Priority</span>
    </div>
  );
};

interface ActivityItem {
  id: string;
  authorName: string;
  type: 'priority' | 'status' | 'subtask' | 'comment' | 'date' | 'general';
  text: string;
  createdAt: string;
}

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
  const [selectedDay, setSelectedDay] = useState(12);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(true);

  const [isSubtasksOpen, setIsSubtasksOpen] = useState(true);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [showAddSubtaskModal, setShowAddSubtaskModal] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskPriority, setNewSubtaskPriority] = useState<TaskPriority>('medium');
  const [newSubtaskAssignee, setNewSubtaskAssignee] = useState('Dexter');
  const [newSubtaskDueDate, setNewSubtaskDueDate] = useState('2026-09-12');
  const [subtaskList, setSubtaskList] = useState<SubtaskItem[]>([]);

  const [replyText, setReplyText] = useState('');
  const [mainCommentText, setMainCommentText] = useState('');
  const [comments, setComments] = useState<CommentItem[]>(task.comments || []);
  const [activityLogs, setActivityLogs] = useState<ActivityItem[]>([]);

  useEffect(() => {
    if (task) {
      if (task.priority) setCurrentPriority(task.priority);
      if (task.status) setCurrentStatus(task.status);
      if (task.dueDate) {
        const d = new Date(task.dueDate);
        if (!isNaN(d.getTime())) {
          setSelectedDay(d.getDate());
        }
      }
      if (task.comments && task.comments.length > 0) {
        setComments(task.comments);
      }
      if (task.subtasks) {
        setSubtaskList(task.subtasks);
      }

      // Populate dynamic updates directly from Backend MongoDB task.updates & task.comments
      const initialLogs: ActivityItem[] = [];

      if ((task as any).updates && (task as any).updates.length > 0) {
        const dbUpdates = [...(task as any).updates].reverse();
        dbUpdates.forEach((upd: any, idx: number) => {
          const txt = upd.text || '';
          const isPriority = txt.toLowerCase().includes('priority');
          const isStatus = txt.toLowerCase().includes('status');
          const isSubtask = txt.toLowerCase().includes('subtask');
          const isDate = txt.toLowerCase().includes('date') || txt.toLowerCase().includes('due');

          initialLogs.push({
            id: upd.id || `upd_db_${idx}`,
            authorName: 'You',
            type: isPriority ? 'priority' : isStatus ? 'status' : isSubtask ? 'subtask' : isDate ? 'date' : 'general',
            text: txt,
            createdAt: upd.createdAt ? new Date(upd.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Aug 2026',
          });
        });
      }

      if (task.comments && task.comments.length > 0) {
        task.comments.forEach((c, idx) => {
          const exists = initialLogs.some((l) => l.text.includes(c.text));
          if (!exists) {
            initialLogs.push({
              id: `act_c_${idx}`,
              authorName: c.authorName || 'You',
              type: 'comment',
              text: `posted an update: "${c.text}"`,
              createdAt: c.createdAt || 'Aug 2026',
            });
          }
        });
      }

      if (initialLogs.length === 0) {
        initialLogs.push({
          id: 'act_init',
          authorName: 'You',
          type: 'general',
          text: 'posted an update · Aug 2026',
          createdAt: 'Aug 2026',
        });
      }
      setActivityLogs(initialLogs);
    }
  }, [task]);

  const taskId = task._id || (task as any).id;

  const handlePriorityChange = async (p: TaskPriority) => {
    setCurrentPriority(p);
    setShowPriorityMenu(false);
    setActivityLogs((prev) => [
      {
        id: `act_${Date.now()}`,
        authorName: 'You',
        type: 'priority',
        text: `changed priority to ${p.charAt(0).toUpperCase() + p.slice(1)}`,
        createdAt: 'Just now',
      },
      ...prev,
    ]);
    if (!taskId) return;
    try {
      const res = await updateTaskApi(taskId, { priority: p });
      if (res && res.priority) {
        setCurrentPriority(res.priority);
      }
      onRefresh();
    } catch (err) {
      console.error('Failed to update priority:', err);
    }
  };

  const handleStatusChange = async (s: TaskStatus) => {
    setCurrentStatus(s);
    setShowStatusMenu(false);
    setActivityLogs((prev) => [
      {
        id: `act_${Date.now()}`,
        authorName: 'You',
        type: 'status',
        text: `changed status to ${s}`,
        createdAt: 'Just now',
      },
      ...prev,
    ]);
    if (!taskId) return;
    try {
      await updateTaskApi(taskId, { status: s });
      onRefresh();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDateChange = async (day: number) => {
    setSelectedDay(day);
    setShowDatePicker(false);
    setActivityLogs((prev) => [
      {
        id: `act_${Date.now()}`,
        authorName: 'You',
        type: 'date',
        text: `updated due date to Jan ${day}`,
        createdAt: 'Just now',
      },
      ...prev,
    ]);
    if (!taskId) return;
    const updatedDate = new Date(2026, 0, day).toISOString();
    try {
      const res = await updateTaskApi(taskId, { dueDate: updatedDate });
      if (res && res.dueDate) {
        const d = new Date(res.dueDate);
        if (!isNaN(d.getTime())) {
          setSelectedDay(d.getDate());
        }
      }
      onRefresh();
    } catch (err) {
      console.error('Failed to update due date:', err);
    }
  };

  const handleCreateSubtaskModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const titleToAdd = newSubtaskTitle.trim();
    const priorityToAdd = newSubtaskPriority;
    const assigneeToAdd = newSubtaskAssignee.trim() || 'Dexter';
    const dateToAdd = newSubtaskDueDate || '2026-09-12';

    setNewSubtaskTitle('');
    setShowAddSubtaskModal(false);

    const newSubItem: SubtaskItem = {
      id: `sub_${Date.now()}`,
      title: titleToAdd,
      priority: priorityToAdd,
      dueDate: dateToAdd,
      assigneeName: assigneeToAdd,
    };

    setSubtaskList((prev) => [...prev, newSubItem]);

    setActivityLogs((prev) => [
      {
        id: `act_${Date.now()}`,
        authorName: 'You',
        type: 'subtask',
        text: `added subtask "${titleToAdd}" assigned to ${assigneeToAdd}`,
        createdAt: 'Just now',
      },
      ...prev,
    ]);

    if (!taskId) return;
    try {
      const updatedTask = await addSubtaskApi(taskId, {
        title: titleToAdd,
        priority: priorityToAdd,
        dueDate: dateToAdd,
        assigneeName: assigneeToAdd,
      });
      if (updatedTask && updatedTask.subtasks && updatedTask.subtasks.length > 0) {
        setSubtaskList(updatedTask.subtasks);
      }
      onRefresh();
    } catch (err) {
      console.error('Subtask API call error:', err);
    }
  };

  const handleAddSubtaskSubmit = async () => {
    if (!newSubtaskTitle.trim()) return;
    const titleToAdd = newSubtaskTitle.trim();
    setNewSubtaskTitle('');
    setIsAddingSubtask(false);

    setActivityLogs((prev) => [
      {
        id: `act_${Date.now()}`,
        authorName: 'You',
        type: 'subtask',
        text: `added subtask "${titleToAdd}"`,
        createdAt: 'Just now',
      },
      ...prev,
    ]);

    const newSubItem: SubtaskItem = {
      id: `sub_${Date.now()}`,
      title: titleToAdd,
      priority: 'medium',
      dueDate: '12 Sep 2026',
      assigneeName: 'Dexter',
    };

    setSubtaskList((prev) => [...prev, newSubItem]);

    if (!taskId) return;
    try {
      const updatedTask = await addSubtaskApi(taskId, { title: titleToAdd });
      if (updatedTask && updatedTask.subtasks && updatedTask.subtasks.length > 0) {
        setSubtaskList(updatedTask.subtasks);
      }
      onRefresh();
    } catch (err) {
      console.error('Subtask API call error:', err);
    }
  };

  const submitComment = async (text: string, isMain: boolean = false) => {
    if (!text.trim()) return;
    const content = text.trim();
    if (isMain) setMainCommentText('');
    else setReplyText('');

    setActivityLogs((prev) => [
      {
        id: `act_${Date.now()}`,
        authorName: 'You',
        type: 'comment',
        text: `posted an update: "${content}"`,
        createdAt: 'Just now',
      },
      ...prev,
    ]);

    const newCommentObj = {
      id: `c_${Date.now()}`,
      authorName: 'You',
      text: content,
      createdAt: 'just now',
    };

    setComments((prev) => [...prev, newCommentObj]);

    if (!taskId) return;
    try {
      const updatedTask = await addCommentApi(taskId, { text: content, authorName: 'You' });
      if (updatedTask && updatedTask.comments && updatedTask.comments.length > 0) {
        setComments(updatedTask.comments);
      }
      onRefresh();
    } catch (err) {
      console.error('Comment API error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans selection:bg-zinc-200">
      {/* Top Header Action Bar matching Figma screenshot */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800 px-3 sm:px-6 py-3 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md z-30">
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
          <button
            onClick={() => setShowRightPanel(!showRightPanel)}
            className={`p-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${showRightPanel
              ? 'border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
              : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
              }`}
            title="Side Panel (Details & Updates)"
          >
            <PanelRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Task Detail Content: 2 Columns (70% Left, 30% Right) matching Figma screenshot */}
      <div className="max-w-7xl mx-auto p-3 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column (Main Content & Subtasks Table) */}
        <div className={`${showRightPanel ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-8 transition-all duration-300`}>

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
                  <div className="w-[24px] h-[24px] rounded-full bg-[#F4F4F5] dark:bg-zinc-800 text-[#171717] dark:text-zinc-200 font-sans font-medium text-xs flex items-center justify-center shrink-0">
                    {(task.assigneeName || 'Dexter').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[13px] font-medium font-sans text-[#171717] dark:text-zinc-100 leading-none">
                    {task.assigneeName || 'Dexter'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="px-3 py-1 rounded-full bg-[#FEE2E2]/60 dark:bg-rose-950/40 text-[#DC2626] dark:text-rose-400 font-medium text-xs flex items-center gap-1.5 hover:opacity-80 transition cursor-pointer"
                  title="Click to change due date"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span>Jan {selectedDay}</span>
                </button>
              </div>
            </div>

            {/* Labels */}
            <div className="flex items-center gap-4">
              <span className="w-24 text-sm font-medium font-sans text-[#171717] dark:text-zinc-200 shrink-0">Labels</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {(task.labels && task.labels.length > 0
                  ? task.labels
                  : ['Research', 'Design', 'Development', 'Testing', 'Deployment']
                ).map((lbl) => (
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
            <button
              type="button"
              onClick={() => setIsSubtasksOpen(!isSubtasksOpen)}
              className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-white hover:opacity-80 transition cursor-pointer select-none"
            >
              {isSubtasksOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              )}
              <span>Subtasks</span>
            </button>

            {/* Subtasks Table Container */}
            {isSubtasksOpen && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs overflow-hidden transition-all duration-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
                    <thead className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold border-b border-zinc-100 dark:border-zinc-800">
                      <tr>
                        <th className="py-3.5 px-6 font-medium text-xs text-zinc-900 dark:text-zinc-100">Task</th>
                        <th className="py-3.5 px-4 font-medium text-xs text-zinc-900 dark:text-zinc-100">Priority</th>
                        <th className="py-3.5 px-4 font-medium text-xs text-zinc-900 dark:text-zinc-100">Members</th>
                        <th className="py-3.5 px-4 font-medium text-xs text-zinc-900 dark:text-zinc-100">Due Date</th>
                        <th className="py-3.5 px-4 text-right font-medium text-xs text-zinc-900 dark:text-zinc-100">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                      {subtaskList.map((sub, idx) => (
                        <tr key={sub.id || idx} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition">
                          <td className="py-3.5 px-6 font-medium text-zinc-900 dark:text-white text-xs">
                            {sub.title}
                          </td>
                          <td className="py-3.5 px-4">
                            <PriorityBadge priority={(sub.priority as TaskPriority) || 'medium'} />
                          </td>
                          <td className="py-3.5 px-4">
                            {sub.assigneeName === 'CN' ? (
                              <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 font-bold text-[10px] text-zinc-600 dark:text-zinc-300 flex items-center justify-center">
                                CN
                              </span>
                            ) : sub.assigneeName === 'Dexter' || idx === 0 ? (
                              <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700">
                                <img src="/avatar.png" alt="Avatar" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <span className="w-5 h-5 rounded-full border border-dashed border-zinc-300 text-zinc-400 flex items-center justify-center font-bold text-xs">
                                +
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 font-normal">
                            {sub.dueDate ? (typeof sub.dueDate === 'string' ? sub.dueDate.split('T')[0] : '12 Sep 2026') : '12 Sep 2026'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button type="button" className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {/* Add Subtasks Row */}
                      <tr className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition">
                        <td colSpan={5} className="py-2.5 px-6">
                          {isAddingSubtask ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={newSubtaskTitle}
                                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSubtaskSubmit()}
                                placeholder="Enter subtask title..."
                                autoFocus
                                className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 flex-1"
                              />
                              <button
                                type="button"
                                onClick={handleAddSubtaskSubmit}
                                className="px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-lg hover:opacity-90 transition cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => { setIsAddingSubtask(false); setNewSubtaskTitle(''); }}
                                className="px-2 py-1 text-zinc-500 hover:text-zinc-800 text-xs transition cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setShowAddSubtaskModal(true)}
                              className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Subtasks</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Comments Feed */}
          <div className="space-y-4 pt-2">
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
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitComment(replyText, false)}
                  placeholder="Leave a reply..."
                  className="w-full text-xs bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1.5 shrink-0 text-zinc-400">
                <button type="button" className="p-1 hover:text-zinc-600 dark:hover:text-zinc-200"><Paperclip className="w-4 h-4" /></button>
                <button type="button" onClick={() => submitComment(replyText, false)} className="p-1 text-zinc-800 dark:text-white hover:opacity-80 transition cursor-pointer"><Send className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Add a Comment Input Box */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-4 flex items-center justify-between gap-3 shadow-2xs">
              <input
                type="text"
                value={mainCommentText}
                onChange={(e) => setMainCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitComment(mainCommentText, true)}
                placeholder="Add a comment..."
                className="w-full text-xs bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
              />
              <div className="flex items-center gap-1.5 shrink-0 text-zinc-400">
                <button type="button" className="p-1 hover:text-zinc-600 dark:hover:text-zinc-200"><Paperclip className="w-4 h-4" /></button>
                <button type="button" onClick={() => submitComment(mainCommentText, true)} className="p-1 text-zinc-800 dark:text-white hover:opacity-80 transition cursor-pointer"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar Panel (Details & Updates Cards matching Figma screenshot) */}
        {showRightPanel && (
          <div className="lg:col-span-4 space-y-5 animate-in fade-in zoom-in-95 duration-200">

            {/* Details Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-5 space-y-4 shadow-2xs font-sans">
              <div className="flex items-center justify-between pb-1 border-b border-zinc-100 dark:border-zinc-800 select-none">
                <button
                  type="button"
                  onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                  className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white hover:opacity-80 transition cursor-pointer"
                >
                  {isDetailsOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
                  )}
                  <span>Details</span>
                </button>
                <div className="flex items-center gap-1 text-zinc-900 dark:text-white">
                  <button className="p-1 hover:opacity-80 text-zinc-900 dark:text-white"><Plus className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:opacity-80 text-zinc-900 dark:text-white"><Settings className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              {/* Field Grid Rows */}
              {isDetailsOpen && (
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
                      type="button"
                      onClick={() => setShowPriorityMenu(!showPriorityMenu)}
                      className="flex items-center gap-1 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-2 py-1 rounded-md transition cursor-pointer"
                    >
                      <PriorityBadge priority={currentPriority} />
                      {showPriorityMenu ? (
                        <ChevronUp className="w-3 h-3 text-zinc-400" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-zinc-400" />
                      )}
                    </button>

                    {/* Priority Selection Dropdown Menu matching Figma screenshot */}
                    {showPriorityMenu && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowPriorityMenu(false)} />
                        <div className="absolute right-0 top-7 w-44 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200/90 dark:border-zinc-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 font-sans select-none">
                          <div className="text-[11px] font-medium text-zinc-400 px-2.5 py-1 mb-1">
                            Priority
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePriorityChange('none');
                            }}
                            className="w-full px-2.5 py-1.5 text-xs text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-xl flex items-center justify-between transition cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <SignalLow className="w-3.5 h-3.5 text-zinc-300" />
                              <span className="text-zinc-600 dark:text-zinc-400 font-medium">No Priority</span>
                            </div>
                            {currentPriority === 'none' && <Check className="w-3.5 h-3.5 text-zinc-800 dark:text-white" />}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePriorityChange('urgent');
                            }}
                            className="w-full px-2.5 py-1.5 text-xs text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-xl flex items-center justify-between transition cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <SignalHigh className="w-3.5 h-3.5 text-rose-500" />
                              <span className="text-rose-500 font-medium">Urgent</span>
                            </div>
                            {currentPriority === 'urgent' && <Check className="w-3.5 h-3.5 text-zinc-800 dark:text-white" />}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePriorityChange('high');
                            }}
                            className="w-full px-2.5 py-1.5 text-xs text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-xl flex items-center justify-between transition cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <SignalHigh className="w-3.5 h-3.5 text-rose-500" />
                              <span className="text-rose-500 font-medium">High</span>
                            </div>
                            {currentPriority === 'high' && <Check className="w-3.5 h-3.5 text-zinc-800 dark:text-white" />}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePriorityChange('medium');
                            }}
                            className="w-full px-2.5 py-1.5 text-xs text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-xl flex items-center justify-between transition cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <SignalMedium className="w-3.5 h-3.5 text-amber-500" />
                              <span className="text-amber-500 font-medium">Medium</span>
                            </div>
                            {currentPriority === 'medium' && <Check className="w-3.5 h-3.5 text-zinc-800 dark:text-white" />}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePriorityChange('low');
                            }}
                            className="w-full px-2.5 py-1.5 text-xs text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-xl flex items-center justify-between transition cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <SignalLow className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-slate-400 font-medium">Low</span>
                            </div>
                            {currentPriority === 'low' && <Check className="w-3.5 h-3.5 text-zinc-800 dark:text-white" />}
                          </button>
                        </div>
                      </>
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

                            {/* Current Month Days 1-31 Dynamic Highlight */}
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                              const isSelected = d === selectedDay;
                              const isToday = d === 24;

                              if (isSelected) {
                                return (
                                  <div key={d} className="flex items-center justify-center">
                                    <button
                                      type="button"
                                      onClick={() => handleDateChange(d)}
                                      className="w-7 h-7 rounded-full bg-[#171717] dark:bg-white text-white dark:text-zinc-900 font-bold flex items-center justify-center text-xs shadow-xs cursor-pointer"
                                    >
                                      {d}
                                    </button>
                                  </div>
                                );
                              }

                              if (isToday) {
                                return (
                                  <div key={d} className="flex items-center justify-center">
                                    <button
                                      type="button"
                                      onClick={() => handleDateChange(d)}
                                      className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium flex items-center justify-center text-xs cursor-pointer"
                                    >
                                      {d}
                                    </button>
                                  </div>
                                );
                              }

                              return (
                                <button
                                  key={d}
                                  type="button"
                                  onClick={() => handleDateChange(d)}
                                  className="py-1 flex items-center justify-center text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full cursor-pointer"
                                >
                                  {d}
                                </button>
                              );
                            })}

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
              )}
            </div>

            {/* Updates Card matching Figma screenshot */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-5 space-y-3.5 shadow-2xs font-sans">
              <button
                type="button"
                onClick={() => setIsUpdatesOpen(!isUpdatesOpen)}
                className="w-full flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white pb-1 border-b border-zinc-100 dark:border-zinc-800 hover:opacity-80 transition cursor-pointer select-none"
              >
                {isUpdatesOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                )}
                <span>Updates</span>
              </button>

              {isUpdatesOpen && (
                <div className="space-y-3 text-xs">
                  {activityLogs.length === 0 ? (
                    <div className="text-zinc-400 text-xs italic">No updates for this task yet.</div>
                  ) : (
                    activityLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400 animate-in fade-in duration-200">
                        {log.type === 'priority' ? (
                          <div className="w-5 h-5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                            <SignalHigh className="w-3 h-3" />
                          </div>
                        ) : log.type === 'status' ? (
                          <div className="w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        ) : log.type === 'subtask' ? (
                          <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                            <Plus className="w-3 h-3" />
                          </div>
                        ) : log.type === 'date' ? (
                          <div className="w-5 h-5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                            <Calendar className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 mt-0.5 border border-zinc-200 dark:border-zinc-700">
                            <img src="/avatar.png" alt="Avatar" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">{log.authorName}</span>
                          <span className="text-zinc-500 dark:text-zinc-400"> {log.text}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Add Subtask Popup Modal */}
      {showAddSubtaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-2xl w-full max-w-md p-6 space-y-5 select-none font-sans">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
                <Plus className="w-4 h-4 text-zinc-500" />
                <span>Add New Subtask</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSubtaskModal(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-lg font-bold p-1 rounded-lg transition cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSubtaskModalSubmit} className="space-y-4 text-xs font-sans">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Subtask Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="e.g. Design Navbar & Footer components"
                  autoFocus
                  className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition"
                />
              </div>

              {/* Priority & Assignee Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Priority */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Priority
                  </label>
                  <select
                    value={newSubtaskPriority}
                    onChange={(e) => setNewSubtaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                    <option value="none">No Priority</option>
                  </select>
                </div>

                {/* Member / Assignee */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Assign Member
                  </label>
                  <input
                    type="text"
                    value={newSubtaskAssignee}
                    onChange={(e) => setNewSubtaskAssignee(e.target.value)}
                    placeholder="e.g. Dexter, Ankit, CN"
                    className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition"
                  />
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newSubtaskDueDate}
                  onChange={(e) => setNewSubtaskDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddSubtaskModal(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-xl hover:opacity-90 transition shadow-xs cursor-pointer"
                >
                  Add Subtask
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
