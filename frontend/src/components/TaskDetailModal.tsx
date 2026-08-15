'use client';

import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import {
  X,
  Calendar,
  CheckSquare,
  MessageSquare,
  History,
  Plus,
  Send,
  Trash2,
  Tag,
} from 'lucide-react';
import { updateTaskApi, addSubtaskApi, addCommentApi, deleteTaskApi } from '../lib/api';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onRefresh: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onRefresh }) => {
  const [currentTask, setCurrentTask] = useState<Task>(task);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskPriority, setNewSubtaskPriority] = useState<TaskPriority>('medium');
  const [showAddSubtask, setShowAddSubtask] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handlePriorityChange = async (priority: TaskPriority) => {
    try {
      const updated = await updateTaskApi(currentTask._id, { priority });
      setCurrentTask(updated);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (status: TaskStatus) => {
    try {
      const updated = await updateTaskApi(currentTask._id, { status });
      setCurrentTask(updated);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    try {
      const updated = await addSubtaskApi(currentTask._id, {
        title: newSubtaskTitle,
        priority: newSubtaskPriority,
      });
      setCurrentTask(updated);
      setNewSubtaskTitle('');
      setShowAddSubtask(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const updated = await addCommentApi(currentTask._id, {
        text: commentText,
        authorName: 'Dexter',
      });
      setCurrentTask(updated);
      setCommentText('');
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTaskApi(currentTask._id);
      onRefresh();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Modal Top Action Bar */}
        <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              Task Details
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteTask}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">

          {/* Left Column (Title, Description, Subtasks, Comments) */}
          <div className="lg:col-span-2 p-8 space-y-6">

            {/* Title & Description */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                {currentTask.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentTask.description || 'No description provided.'}
              </p>
            </div>

            {/* Labels Tags */}
            {currentTask.labels && currentTask.labels.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Labels
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentTask.labels.map((lbl, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      🏷️ {lbl}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Subtasks Section (Figma Screen 6) */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-blue-500" />
                  <span>Subtasks</span>
                </h3>
                <button
                  onClick={() => setShowAddSubtask(!showAddSubtask)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Subtask
                </button>
              </div>

              {/* Add Subtask Form */}
              {showAddSubtask && (
                <form onSubmit={handleAddSubtask} className="flex gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Subtask title..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <select
                    value={newSubtaskPriority}
                    onChange={(e) => setNewSubtaskPriority(e.target.value as TaskPriority)}
                    className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg">
                    Add
                  </button>
                </form>
              )}

              {/* Subtasks List */}
              <div className="space-y-2">
                {currentTask.subtasks && currentTask.subtasks.length > 0 ? (
                  currentTask.subtasks.map((st, idx) => (
                    <div
                      key={st.id || idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200">{st.title}</span>
                      <span className="capitalize font-bold text-slate-500">⚡ {st.priority}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No subtasks added yet.</p>
                )}
              </div>
            </div>

            {/* Discussion Comments Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <span>Comments</span>
              </h3>

              {/* Comments History */}
              <div className="space-y-3">
                {currentTask.comments && currentTask.comments.length > 0 ? (
                  currentTask.comments.map((cm, idx) => (
                    <div key={cm.id || idx} className="flex gap-3 text-xs">
                      <div className="w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        {cm.authorName ? cm.authorName.substring(0, 2).toUpperCase() : 'DX'}
                      </div>
                      <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">{cm.authorName}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(cm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{cm.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No comments yet.</p>
                )}
              </div>

              {/* Add Comment Input Form */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
                <button type="submit" className="p-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:opacity-90 transition">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Sidebar Column (Details, Priority Selector, Activity Log Timeline) */}
          <div className="p-8 space-y-6 bg-slate-50/40 dark:bg-slate-900/40">

            {/* Details Panel */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Details</h3>

              {/* Status Select */}
              <div className="space-y-1">
                <label className="block text-xs text-slate-500">Status</label>
                <select
                  value={currentTask.status}
                  onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white capitalize focus:outline-none"
                >
                  <option value="todo">To Do</option>
                  <option value="doing">Doing</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                </select>
              </div>

              {/* Priority Select */}
              <div className="space-y-1">
                <label className="block text-xs text-slate-500">Priority</label>
                <select
                  value={currentTask.priority}
                  onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white capitalize focus:outline-none"
                >
                  <option value="none">No Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Assignee */}
              <div className="space-y-1">
                <label className="block text-xs text-slate-500">Assignee</label>
                <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-[9px]">
                    DX
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {currentTask.assigneeName || 'Dexter'}
                  </span>
                </div>
              </div>
            </div>

            {/* Activity Audit Timeline Log */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" /> Updates Log
              </h3>
              <div className="space-y-2">
                {currentTask.updates && currentTask.updates.length > 0 ? (
                  currentTask.updates.map((upd, idx) => (
                    <div key={upd.id || idx} className="text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{upd.text}</p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(upd.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-400 italic">No activity updates logged.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
