'use client';

import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus, VisibleFields } from '../types/task';
import { ChevronDown, ChevronRight, Plus, MoreHorizontal, SignalHigh, SignalMedium, SignalLow } from 'lucide-react';

interface TaskListViewProps {
  tasks: Task[];
  onCardClick: (task: Task) => void;
  onAddTaskClick: (status?: TaskStatus) => void;
  visibleFields?: VisibleFields;
}

const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const p = priority?.toLowerCase();
  if (p === 'urgent' || p === 'high') {
    return (
      <div className="flex items-center gap-1 text-[13px] font-medium text-rose-500 dark:text-rose-400">
        <SignalHigh className="w-3 h-3 text-rose-500 dark:text-rose-400 shrink-0" />
        <span className="capitalize">High</span>
      </div>
    );
  }
  if (p === 'medium') {
    return (
      <div className="flex items-center gap-1 text-[13px] font-medium text-amber-500 dark:text-amber-400">
        <SignalMedium className="w-3 h-3 text-amber-500 dark:text-amber-400 shrink-0" />
        <span className="capitalize">Medium</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-[13px] font-medium text-slate-400 dark:text-zinc-500">
      <SignalLow className="w-3 h-3 text-slate-400 dark:text-zinc-500 shrink-0" />
      <span className="capitalize">{priority || 'Low'}</span>
    </div>
  );
};

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  onCardClick,
  onAddTaskClick,
  visibleFields = { priority: true, members: true, dueDate: true, labels: false, status: false, reporter: false },
}) => {
  const groups: { status: TaskStatus; title: string }[] = [
    { status: 'todo', title: 'To Do' },
    { status: 'doing', title: 'Doing' },
    { status: 'completed', title: 'Completed' },
    { status: 'on_hold', title: 'On Hold' },
  ];

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (st: string) => {
    setCollapsed((prev) => ({ ...prev, [st]: !prev[st] }));
  };

  const activeColCount =
    2 +
    (visibleFields.priority ? 1 : 0) +
    (visibleFields.members ? 1 : 0) +
    (visibleFields.dueDate ? 1 : 0) +
    (visibleFields.labels ? 1 : 0) +
    (visibleFields.status ? 1 : 0) +
    (visibleFields.reporter ? 1 : 0);

  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center text-zinc-400 dark:text-zinc-500 text-xs font-medium">
        No tasks found matching your search query.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {groups.map((group) => {
        const groupTasks = tasks.filter((t) => t.status === group.status);
        if (groupTasks.length === 0) return null;

        const isCollapsed = collapsed[group.status];

        return (
          <div key={group.status} className="space-y-2">
            {/* Collapsible Section Header (Exact Figma: caret + title, no count badge) */}
            <button
              onClick={() => toggleGroup(group.status)}
              className="flex items-center gap-2 py-1 px-1 text-zinc-900 dark:text-white hover:opacity-80 transition select-none"
            >
              {isCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-800 dark:text-zinc-200" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-800 dark:text-zinc-200" />
              )}
              <h2 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white tracking-tight">
                {group.title}
              </h2>
            </button>

            {/* Table Container */}
            {!isCollapsed && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
                    <thead className="bg-[#FAFAFA] dark:bg-zinc-800/60 text-zinc-400 font-semibold border-b border-zinc-200/60 dark:border-zinc-800">
                      <tr>
                        <th className="py-3 px-6 font-medium text-xs text-zinc-500 dark:text-zinc-400">Task</th>
                        {visibleFields.priority && (
                          <th className="py-3 px-4 font-medium text-xs text-zinc-500 dark:text-zinc-400">Priority</th>
                        )}
                        {visibleFields.members && (
                          <th className="py-3 px-4 font-medium text-xs text-zinc-500 dark:text-zinc-400">Members</th>
                        )}
                        {visibleFields.dueDate && (
                          <th className="py-3 px-4 font-medium text-xs text-zinc-500 dark:text-zinc-400">Due Date</th>
                        )}
                        {visibleFields.labels && (
                          <th className="py-3 px-4 font-medium text-xs text-zinc-500 dark:text-zinc-400">Labels</th>
                        )}
                        {visibleFields.status && (
                          <th className="py-3 px-4 font-medium text-xs text-zinc-500 dark:text-zinc-400">Status</th>
                        )}
                        {visibleFields.reporter && (
                          <th className="py-3 px-4 font-medium text-xs text-zinc-500 dark:text-zinc-400">Reporter</th>
                        )}
                        <th className="py-3 px-4 text-right font-medium text-xs text-zinc-500 dark:text-zinc-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                      {groupTasks.length > 0 ? (
                        groupTasks.map((task) => (
                          <tr
                            key={task._id}
                            onClick={() => onCardClick(task)}
                            className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition cursor-pointer"
                          >
                            <td className="py-3.5 px-6 font-medium text-zinc-900 dark:text-white text-xs">
                              {task.title}
                            </td>

                            {visibleFields.priority && (
                              <td className="py-3.5 px-4">
                                <PriorityBadge priority={task.priority} />
                              </td>
                            )}

                            {visibleFields.members && (
                              <td className="py-3.5 px-4">
                                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 shadow-xs border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center">
                                  <img src="/avatar.png" alt="Member Avatar" className="w-full h-full object-cover" />
                                </div>
                              </td>
                            )}

                            {visibleFields.dueDate && (
                              <td className="py-3.5 px-4">
                                {task.dueDate ? (
                                  <span className="text-zinc-600 dark:text-zinc-400 text-xs font-normal">
                                    {new Date(task.dueDate).toLocaleDateString('en-GB', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                    })}
                                  </span>
                                ) : (
                                  '—'
                                )}
                              </td>
                            )}

                            {visibleFields.labels && (
                              <td className="py-3.5 px-4">
                                <div className="flex flex-wrap gap-1">
                                  {task.labels && task.labels.length > 0 ? (
                                    task.labels.map((l, i) => (
                                      <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-medium border border-zinc-200/60 dark:border-zinc-700/60">
                                        {l}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-zinc-400">—</span>
                                  )}
                                </div>
                              </td>
                            )}

                            {visibleFields.status && (
                              <td className="py-3.5 px-4">
                                <span className="capitalize font-medium text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                  {task.status}
                                </span>
                              </td>
                            )}

                            {visibleFields.reporter && (
                              <td className="py-3.5 px-4">
                                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                  {task.assigneeName || 'Dexter'}
                                </span>
                              </td>
                            )}

                            <td className="py-3.5 px-4 text-right">
                              <button className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={activeColCount} className="py-5 text-center text-zinc-400 text-xs">
                            No tasks in this status
                          </td>
                        </tr>
                      )}

                      {/* Add Task Row matching Figma */}
                      <tr className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition">
                        <td colSpan={activeColCount} className="py-2.5 px-6">
                          <button
                            onClick={() => onAddTaskClick(group.status)}
                            className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Task</span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
