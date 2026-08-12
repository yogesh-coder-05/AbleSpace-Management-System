'use client';

import React, { useState } from 'react';
import { Task, TaskStatus } from '../types/task';
import { ChevronDown, ChevronRight, Plus, Calendar, MoreHorizontal } from 'lucide-react';

interface TaskListViewProps {
  tasks: Task[];
  onCardClick: (task: Task) => void;
  onAddTaskClick: (status?: TaskStatus) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  onCardClick,
  onAddTaskClick,
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

  return (
    <div className="p-6 space-y-6">
      {groups.map((group) => {
        const groupTasks = tasks.filter((t) => t.status === group.status);
        const isCollapsed = collapsed[group.status];

        return (
          <div
            key={group.status}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
          >
            {/* Collapsible Header */}
            <button
              onClick={() => toggleGroup(group.status)}
              className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition border-b border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
                <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  {group.title}
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {groupTasks.length}
                </span>
              </div>
            </button>

            {/* Table */}
            {!isCollapsed && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-6">Task</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Members</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {groupTasks.length > 0 ? (
                      groupTasks.map((task) => (
                        <tr
                          key={task._id}
                          onClick={() => onCardClick(task)}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition cursor-pointer"
                        >
                          <td className="py-3.5 px-6 font-semibold text-slate-900 dark:text-white">
                            {task.title}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="capitalize font-bold text-slate-700 dark:text-slate-300">
                              ⚡ {task.priority}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-[10px]">
                              {task.assigneeName ? task.assigneeName.substring(0, 2).toUpperCase() : 'DX'}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            {task.dueDate ? (
                              <span className="flex items-center gap-1.5 text-slate-500">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(task.dueDate).toLocaleDateString('en-US', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition">
                              <MoreHorizontal className="w-4 h-4 text-slate-400" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400">
                          No tasks in this status
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Add Task Row Button */}
                <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/30">
                  <button
                    onClick={() => onAddTaskClick(group.status)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
