'use client';

import React from 'react';

export const KanbanSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 items-start animate-pulse">
      {[1, 2, 3, 4].map((col) => (
        <div
          key={col}
          className="flex flex-col w-full max-w-[289px] mx-auto shrink-0 bg-zinc-100/80 dark:bg-zinc-900/40 rounded-xl p-3 space-y-3 border border-zinc-200/60 dark:border-zinc-800"
        >
          {/* Header Skeleton */}
          <div className="flex items-center justify-between h-5">
            <div className="w-20 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
            <div className="w-4 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          </div>

          {/* Cards Skeletons */}
          <div className="space-y-2.5">
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="bg-white dark:bg-zinc-900 rounded-xl p-3 border border-zinc-200/80 dark:border-zinc-800 space-y-3"
              >
                <div className="w-3/4 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    <div className="w-12 h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                  </div>
                  <div className="w-14 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const ListSkeleton: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-pulse font-sans">
      {[1, 2, 3].map((group) => (
        <div key={group} className="space-y-2">
          <div className="w-24 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-4 space-y-3">
            {[1, 2].map((row) => (
              <div key={row} className="flex items-center justify-between py-1">
                <div className="w-44 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                <div className="w-16 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="w-20 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const ProjectsSkeleton: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-pulse font-sans">
      <div className="w-32 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
        {[1, 2, 3].map((row) => (
          <div key={row} className="grid grid-cols-12 gap-4 items-center py-2">
            <div className="col-span-5 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
            <div className="col-span-2 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
            <div className="col-span-2 w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="col-span-2 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};
