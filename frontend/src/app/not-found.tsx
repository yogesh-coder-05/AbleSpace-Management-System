'use client';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950 font-sans p-4">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-6xl font-extrabold text-zinc-900 dark:text-white">404</h1>
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">Page Not Found</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          The page you are looking for does not exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-xl hover:opacity-90 transition shadow-xs"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
