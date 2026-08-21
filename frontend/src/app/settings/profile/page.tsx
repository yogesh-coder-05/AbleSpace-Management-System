'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Palette,
  Edit2,
  Search,
  Check,
  Sun,
  Moon,
  Square,
  Camera,
} from 'lucide-react';
import { useGuest } from '../../../context/GuestContext';
import { useTheme } from '../../../context/ThemeContext';
import { useColorMode } from '../../../context/ColorModeContext';
import { ColorMode } from '../../../types/task';
import { updateUserProfileApi } from '../../../lib/api';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, setUser, guestUserId, isLoading, logoutGuest } = useGuest();
  const { theme, toggleTheme } = useTheme();
  const { colorMode, setColorMode } = useColorMode();

  const [activeTab, setActiveTab] = useState<'profile' | 'theme' | 'color'>('profile');
  const [sidebarSearch, setSidebarSearch] = useState('');

  const [name, setName] = useState(user?.name || 'Dexter');
  const [email, setEmail] = useState(user?.email || 'dexter@gmail.com');
  const [title, setTitle] = useState(user?.title || 'Designer');
  const [username, setUsername] = useState(user?.username || 'Dexuser');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Protected route check - Redirect unauthenticated guests to '/'
  useEffect(() => {
    if (!isLoading && !guestUserId) {
      router.replace('/');
    }
  }, [isLoading, guestUserId, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || 'Dexter');
      setEmail(user.email || 'dexter@gmail.com');
      setTitle(user.title || 'Designer');
      setUsername(user.username || 'Dexuser');
    }
  }, [user]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!guestUserId) return;
    try {
      const updated = await updateUserProfileApi(guestUserId, {
        name,
        email,
        title,
        username,
      });
      setUser(updated);
      setIsEditingEmail(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const [isLeavingWorkspace, setIsLeavingWorkspace] = useState(false);

  const handleLeaveWorkspace = async () => {
    setIsLeavingWorkspace(true);
    try {
      await logoutGuest();
      router.push('/');
    } catch (err) {
      console.error('Leave workspace failed:', err);
    } finally {
      setIsLeavingWorkspace(false);
    }
  };

  const colorOptions: { mode: ColorMode; label: string; colorClass: string }[] = [
    { mode: 'amber', label: 'Amber', colorClass: 'bg-[#D97706]' },
    { mode: 'blue', label: 'Blue', colorClass: 'bg-[#7C3AED]' },
    { mode: 'pink', label: 'Pink', colorClass: 'bg-[#DB2777]' },
    { mode: 'rose', label: 'Rose', colorClass: 'bg-[#E11D48]' },
    { mode: 'emerald', label: 'Emerald', colorClass: 'bg-[#059669]' },
    { mode: 'black', label: 'Black', colorClass: 'bg-slate-900 dark:bg-slate-100' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-700 border-t-slate-900 dark:border-t-white rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading settings...</span>
        </div>
      </div>
    );
  }

  if (!guestUserId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 flex font-sans selection:bg-slate-200">
      
      {/* Settings Navigation Sidebar */}
      <aside className="w-64 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-5 shrink-0 flex flex-col justify-between">
        <div className="space-y-4">
          
          {/* Back to app link */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition px-1 py-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to app</span>
          </Link>

          {/* Sidebar Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-700 transition"
            />
          </div>

          {/* Sidebar Navigation Items */}
          <div className="space-y-1 pt-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'profile'
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <User className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('theme')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeTab === 'theme'
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white font-semibold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Sun className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span>Theme</span>
            </button>

            <button
              onClick={() => setActiveTab('color')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeTab === 'color'
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white font-semibold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Palette className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span>Color</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium px-1">
            AbleSpace Management System
          </p>
        </div>
      </aside>

      {/* Main Settings Body Container */}
      <main className="flex-1 p-8 md:p-12 max-w-4xl overflow-y-auto">
        
        {savedSuccess && (
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Check className="w-4 h-4" /> Profile updated successfully!
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            
            {/* Page Header matching exact layout in screenshot */}
            <div className="flex items-center gap-3.5 pb-2">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0">
                <img
                  src="/avatar.png"
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Profile
              </h1>
            </div>

            {/* Profile Settings Container Card */}
            <form
              onSubmit={handleSave}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden"
            >
              {/* Row 1: Profile picture */}
              <div className="p-5 flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Profile picture
                </span>
                <div className="relative group cursor-pointer">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xs">
                    <img
                      src="/avatar.png"
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Row 2: Email */}
              <div className="p-5 flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Email
                </span>
                <div className="flex items-center gap-2">
                  {isEditingEmail ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => handleSave()}
                      autoFocus
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-700"
                    />
                  ) : (
                    <>
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {email}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEditingEmail(true)}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Row 3: Full name */}
              <div className="p-5 flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Full name
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dexter"
                  className="w-56 md:w-64 px-4 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border-none text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-800 transition"
                />
              </div>

              {/* Row 4: Title */}
              <div className="p-5 flex items-center justify-between gap-4">
                <div>
                  <span className="block text-xs font-semibold text-slate-900 dark:text-white">
                    Title
                  </span>
                  <span className="block text-[11px] text-slate-400 dark:text-slate-500 font-normal mt-0.5">
                    Your job title or role
                  </span>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Designer"
                  className="w-56 md:w-64 px-4 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border-none text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-800 transition"
                />
              </div>

              {/* Row 5: Username */}
              <div className="p-5 flex items-center justify-between gap-4">
                <div>
                  <span className="block text-xs font-semibold text-slate-900 dark:text-white">
                    Username
                  </span>
                  <span className="block text-[11px] text-slate-400 dark:text-slate-500 font-normal mt-0.5">
                    One word, like a nickname or first name
                  </span>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Dexuser"
                  className="w-56 md:w-64 px-4 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border-none text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-800 transition"
                />
              </div>

              {/* Form Footer Action */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-xl shadow-2xs hover:opacity-90 transition cursor-pointer"
                >
                  Save changes
                </button>
              </div>
            </form>

            {/* Workspace Access Section */}
            <div className="pt-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                Workspace access
              </h2>
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-2xs">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Remove yourself from the workspace
                </span>
                <button
                  type="button"
                  onClick={handleLeaveWorkspace}
                  disabled={isLeavingWorkspace}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/60 transition cursor-pointer disabled:opacity-50"
                >
                  {isLeavingWorkspace ? 'Leaving...' : 'Leave Workspace'}
                </button>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Theme Settings
            </h1>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Choose light or dark appearance for your workspace layout.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => theme !== 'light' && toggleTheme()}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition ${
                    theme === 'light'
                      ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 ring-1 ring-slate-900 dark:ring-white'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <Sun className="w-6 h-6 text-slate-900 dark:text-white" />
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    Light Theme
                  </span>
                </button>

                <button
                  onClick={() => theme !== 'dark' && toggleTheme()}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition ${
                    theme === 'dark'
                      ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 ring-1 ring-slate-900 dark:ring-white'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <Moon className="w-6 h-6 text-slate-900 dark:text-white" />
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    Dark Theme
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'color' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Color Accent Settings
            </h1>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Select your preferred accent color theme for buttons and badges.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.mode}
                    onClick={() => setColorMode(opt.mode)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                      colorMode === opt.mode
                        ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-[4px] shrink-0 ${opt.colorClass}`} />
                    <span className="text-xs text-slate-900 dark:text-white">{opt.label}</span>
                    {colorMode === opt.mode && (
                      <Check className="w-3.5 h-3.5 ml-auto text-slate-900 dark:text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

