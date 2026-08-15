'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950 p-6 font-sans">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Application Error</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {error?.message || 'An unhandled application error occurred.'}
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-xl hover:opacity-90 transition shadow-xs cursor-pointer"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
