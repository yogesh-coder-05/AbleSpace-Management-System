'use client';

import React from 'react';
import { Task } from '../types/task';
import { Calendar, MoreHorizontal, Tag } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onCardClick: (task: Task) => void;
}

// Custom Avatar rendering matching the exact character avatar image in Figma card
const CustomAvatar: React.FC<{ name?: string }> = ({ name }) => {
  if (name === 'QA Team') {
    return (
      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-[9px] shrink-0 ring-1 ring-white/30">
        Q
      </div>
    );
  }
  if (name === 'Designer') {
    return (
      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 text-white flex items-center justify-center font-bold text-[9px] shrink-0 ring-1 ring-white/30">
        D
      </div>
    );
  }
  if (name === 'Security') {
    return (
      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-[9px] shrink-0 ring-1 ring-white/30">
        S
      </div>
    );
  }

  // Default Avatar image matching uploaded character
  return (
    <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 ring-1 ring-white/20 shadow-sm">
      <img src="/avatar.png" alt="Avatar" className="w-full h-full object-cover" />
    </div>
  );
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onCardClick }) => {
  // Format date cleanly e.g. "29 Jul"
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    : '29 Jul';

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task._id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onCardClick(task)}
      className="group bg-[#FFFFFF] dark:bg-zinc-900 rounded-[8px] p-3 border border-[#E5E5E5] dark:border-zinc-800 shadow-none hover:border-zinc-300 dark:hover:border-zinc-700 transition cursor-grab active:cursor-grabbing hover:shadow-sm space-y-3 font-sans w-full max-w-[273px] selection:bg-zinc-200 active:scale-[0.98] duration-150"
    >
      {/* Title Row with 3-Dots (Figma: width 247px, height 20px, justify-content space-between, text-sm, #171717) */}
      <div className="flex items-center justify-between gap-2 h-5 w-full">
        <h3 className="text-[14px] font-medium text-[#171717] dark:text-white leading-[20px] truncate">
          {task.title}
        </h3>
        <button className="text-[#71717A] hover:text-[#171717] dark:hover:text-white transition shrink-0 p-0.5">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Assignee & Date Badge Row (Figma: Admin gap 4px | Date #DC26261A bg, rounded-full, 20px height) */}
      <div className="flex items-center justify-between gap-2 h-5">
        {/* Assignee Avatar + Name */}
        <div className="flex items-center gap-1.5 h-5">
          <CustomAvatar name={task.assigneeName} />
          <span className="text-[13px] font-medium text-[#171717] dark:text-zinc-200">
            {task.assigneeName || 'Admin'}
          </span>
        </div>

        {/* Date Pill Badge: Destructive variant (#DC26261A background, red text, rounded-full) */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#DC26261A] text-[#DC2626] dark:text-red-400 text-[11px] font-medium border border-[#DC262615] shrink-0 h-5">
          <Calendar className="w-3 h-3 text-[#DC2626] dark:text-red-400 shrink-0" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Tag Pills Row (Figma: width 210px, height 20px, gap 6px, #171717/#F4F4F5) */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5 max-w-full overflow-hidden">
          {task.labels.map((label, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F4F4F6] dark:bg-zinc-800 text-[#171717] dark:text-zinc-200 text-[11px] font-medium border border-[#E4E4E7] dark:border-zinc-700/50 h-5 max-w-full shrink-0"
            >
              <Tag className="w-3 h-3 text-[#71717A] dark:text-zinc-400 shrink-0" />

              <span className="truncate max-w-[120px]">
                {label}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
