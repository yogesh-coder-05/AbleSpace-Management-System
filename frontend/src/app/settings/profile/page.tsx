'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Palette, Database, Edit2, ShieldAlert, Check } from 'lucide-react';
import { useGuest } from '../../../context/GuestContext';
import { updateUserProfileApi } from '../../../lib/api';

export default function ProfileSettingsPage() {
  const { user, setUser, guestUserId } = useGuest();

  const [name, setName] = useState(user?.name || 'Dexter');
  const [email, setEmail] = useState(user?.email || 'dexter@gmail.com');
  const [title, setTitle] = useState(user?.title || 'Designer');
  const [username, setUsername] = useState(user?.username || 'Dexuser');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setTitle(user.title);
      setUsername(user.username);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestUserId) return;
    try {
      const updated = await updateUserProfileApi(guestUserId, {
        name,
        email,
        title,
        username,
      });
      setUser(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Settings Navigation Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to App</span>
        </Link>

        <div className="space-y-1">
          <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Settings
          </div>

          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Palette className="w-4 h-4" />
            <span>Theme</span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Database className="w-4 h-4" />
            <span>Data</span>
          </a>
        </div>
      </aside>

      {/* Main Settings Body */}
      <main className="flex-1 p-10 max-w-3xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Profile Settings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage your personal information and workspace credentials
            </p>
          </div>

          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" /> Profile updated successfully!
            </div>
          )}

          {/* User Card */}
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            {/* Avatar Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                {name ? name.substring(0, 2).toUpperCase() : 'DX'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{name}</h3>
                <p className="text-xs text-slate-400">{email}</p>
              </div>
            </div>

            {/* Profile Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                  />
                  <Edit2 className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                  />
                  <Edit2 className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-xl shadow-md hover:opacity-90 transition"
              >
                Save Changes
              </button>
            </div>
          </form>

          {/* Danger Zone: Workspace Access */}
          <div className="bg-rose-50 dark:bg-rose-950/20 rounded-3xl p-6 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <div>
                <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                  Workspace Access
                </h4>
                <p className="text-[11px] text-rose-700 dark:text-rose-400">
                  Need to leave workspace? Touch the button below.
                </p>
              </div>
            </div>

            <button
              onClick={() => alert('Leaving workspace session.')}
              className="px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/40 transition"
            >
              Leave Workspace
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
