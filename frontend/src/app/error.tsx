'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950 p-6 font-sans">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Something went wrong!</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {error?.message || 'An unexpected error occurred while loading this page.'}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-xl hover:opacity-90 transition shadow-xs cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
