'use client';

import React from 'react';
import { Task, TaskStatus } from '../types/task';
import { TaskCard } from './TaskCard';
import { Plus, GripVertical, MoreHorizontal } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onCardClick: (task: Task) => void;
  onAddTaskClick: (status?: TaskStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onCardClick, onAddTaskClick }) => {
  const columns: { status: TaskStatus; title: string }[] = [
    { status: 'todo', title: 'To Do' },
    { status: 'doing', title: 'Doing' },
    { status: 'completed', title: 'Completed' },
    { status: 'on_hold', title: 'On Hold' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 items-start font-sans selection:bg-zinc-200">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);

        return (
          <div
            key={col.status}
            className="flex flex-col w-full max-w-[289px] mx-auto shrink-0 bg-[#F5F5F5] dark:bg-zinc-900/60 rounded-[8px] border border-[#E5E5E5] dark:border-zinc-800 px-2 pb-2 space-y-2"
          >
            {/* Column Header: Fixed 39px height, space-between matching Figma specs */}
            <div className="h-[39px] flex items-center justify-between px-1 shrink-0">
              <div className="flex items-center gap-1.5">
                <GripVertical className="w-4 h-4 text-[#A1A1AA] cursor-grab shrink-0" />
                <h2 className="text-[14px] font-semibold text-[#09090B] dark:text-white">
                  {col.title}
                </h2>
              </div>
              <div className="flex items-center gap-1 text-[#71717A]">
                <button
                  onClick={() => onAddTaskClick(col.status)}
                  className="p-1 hover:text-black dark:hover:text-white transition rounded hover:bg-[#E5E5E5]/60 dark:hover:bg-zinc-800"
                  title="Add Task"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  className="p-1 hover:text-black dark:hover:text-white transition rounded hover:bg-[#E5E5E5]/60 dark:hover:bg-zinc-800"
                  title="Column Options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cards List: gap 8px (spacing/2) matching Figma specs */}
            <div className="space-y-2 flex-1 overflow-y-auto min-h-[400px]">
              {colTasks.length > 0 ? (
                colTasks.map((task) => (
                  <TaskCard key={task._id} task={task} onCardClick={onCardClick} />
                ))
              ) : (
                <div className="border border-dashed border-[#E5E5E5] dark:border-zinc-800 rounded-lg p-6 text-center text-xs text-[#A1A1AA]">
                  No tasks in {col.title}
                </div>
              )}
            </div>

            {/* Column Add Task Text Button */}
            <button
              onClick={() => onAddTaskClick(col.status)}
              className="w-full py-1.5 px-2 rounded-md text-[#71717A] dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-[#E5E5E5]/50 dark:hover:bg-zinc-800 text-xs font-medium transition flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Add Task</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
