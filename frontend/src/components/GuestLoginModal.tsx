'use client';

import React from 'react';
import { useGuest } from '../context/GuestContext';

export const GuestLoginModal: React.FC = () => {
  const { loginAsGuest, isLoading } = useGuest();

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#F4F4F6] dark:bg-zinc-950 font-sans selection:bg-zinc-200">
      {/* Top Gray Bar Header matching screenshot */}
      <div className="w-full h-7 bg-[#D4D4D8] dark:bg-zinc-800 shrink-0 border-b border-zinc-300/50 dark:border-zinc-700/50" />

      {/* Main Centered Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 w-full max-w-md my-auto">
        
        {/* Pyramid Logo Header */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-white dark:text-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3L2 19h20L12 3z" />
              <path d="M12 3v16" />
              <path d="M12 11l6 8" />
              <path d="M12 11l-6 8" />
            </svg>
          </div>
          <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Pyramid
          </span>
        </div>

        {/* Card Container */}
        <div className="w-full max-w-[430px] bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200/90 dark:border-zinc-800 p-8 sm:p-9 shadow-sm text-center">
          
          {/* Card Title */}
          <h2 className="text-[25px] sm:text-[27px] font-bold text-zinc-900 dark:text-white tracking-tight mb-1.5">
            Let&apos;s get back on track
          </h2>

          {/* Subtitle */}
          <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mb-8 font-normal leading-normal">
            Enter your email below to login to your account.
          </p>

          {/* Buttons Stack */}
          <div className="space-y-3.5">
            {/* Continue as Guest Button */}
            <button
              onClick={() => loginAsGuest('Guest')}
              disabled={isLoading}
              className="w-full py-3.5 px-5 bg-[#18181B] hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-medium rounded-full text-[14px] transition-all duration-150 flex items-center justify-center disabled:opacity-50 active:scale-[0.99]"
            >
              {isLoading ? 'Connecting...' : 'Continue as Guest'}
            </button>

            {/* Login with Google Button */}
            <button
              onClick={() => loginAsGuest('Google User')}
              disabled={isLoading}
              className="w-full py-3.5 px-5 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-medium rounded-full border border-zinc-200 dark:border-zinc-700 text-[14px] transition-all duration-150 flex items-center justify-center gap-2.5 active:scale-[0.99]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.28v3.15C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.28C.46 8.21 0 10.05 0 12s.46 3.79 1.28 5.42l4-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.28 6.58l4 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Login with Google</span>
            </button>
          </div>
        </div>

        {/* Footer Terms / Privacy */}
        <div className="mt-8 text-center text-[13px] text-zinc-500 dark:text-zinc-400 leading-normal max-w-xs mx-auto">
          <p>By clicking continue, you agree to</p>
          <p>
            our{' '}
            <a href="#" className="underline text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 font-medium">
              Privacy Policy
            </a>
          </p>
        </div>

      </div>

      {/* Bottom Gray Tab matching screenshot */}
      <div className="w-28 h-5 bg-[#D4D4D8] dark:bg-zinc-800 rounded-t-xl shrink-0" />
    </div>
  );
};

