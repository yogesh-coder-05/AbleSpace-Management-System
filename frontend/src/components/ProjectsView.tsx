'use client';

import React, { useState, useEffect } from 'react';
import { SignalHigh, SignalMedium, Plus, FolderKanban, MoreHorizontal } from 'lucide-react';
import { fetchProjectsApi, createProjectApi } from '../lib/api';
import { useGuest } from '../context/GuestContext';

interface ProjectItem {
  id: string;
  name: string;
  priority: 'High' | 'Medium' | 'Low';
  leadAvatar: string;
  dueDate: string;
}

interface ProjectsViewProps {
  onSelectProject: (id: string, name: string) => void;
  showAddModal?: boolean;
  setShowAddModal?: (open: boolean) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  onSelectProject,
  showAddModal: externalShowAddModal,
  setShowAddModal: externalSetShowAddModal,
}) => {
  const { guestUserId } = useGuest();
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([
    {
      id: 'proj_1',
      name: 'Design Homepage',
      priority: 'High',
      leadAvatar: '/avatar.png',
      dueDate: '12 Sep 2026',
    },
    {
      id: 'proj_2',
      name: 'Develop Login Feature',
      priority: 'Low',
      leadAvatar: '/avatar.png',
      dueDate: '18 Oct 2026',
    },
    {
      id: 'proj_3',
      name: 'Test Payment Gateway',
      priority: 'Medium',
      leadAvatar: '/avatar.png',
      dueDate: '25 Nov 2026',
    },
  ]);

  const [internalShowAddModal, setInternalShowAddModal] = useState(false);
  const showAddModal = externalShowAddModal !== undefined ? externalShowAddModal : internalShowAddModal;
  const setShowAddModal = externalSetShowAddModal || setInternalShowAddModal;
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectPriority, setNewProjectPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newProjectDueDate, setNewProjectDueDate] = useState('30 Dec 2026');

  const loadProjects = async () => {
    try {
      const data = await fetchProjectsApi(guestUserId || 'guest_demo');
      if (Array.isArray(data) && data.length > 0) {
        const formatted: ProjectItem[] = data.map((p) => ({
          id: p._id,
          name: p.name,
          priority: (p.priority
            ? p.priority.charAt(0).toUpperCase() + p.priority.slice(1)
            : 'Medium') as 'High' | 'Medium' | 'Low',
          leadAvatar: '/avatar.png',
          dueDate: p.dueDate ? new Date(p.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '30 Dec 2026',
        }));
        setProjectsList(formatted);
      }
    } catch (err) {
      console.error('Failed to load projects from backend API:', err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [guestUserId]);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      let isoDueDate = newProjectDueDate;
      if (newProjectDueDate) {
        const parsed = new Date(newProjectDueDate);
        if (!isNaN(parsed.getTime())) {
          isoDueDate = parsed.toISOString();
        }
      }

      await createProjectApi({
        name: newProjectName.trim(),
        priority: newProjectPriority.toLowerCase(),
        dueDate: isoDueDate || '2026-12-30',
        guestUserId: guestUserId || 'guest_demo',
      });
      await loadProjects();
    } catch (err) {
      console.error('Failed to create project via API:', err);
      const newProj: ProjectItem = {
        id: `proj_${Date.now()}`,
        name: newProjectName.trim(),
        priority: newProjectPriority,
        leadAvatar: '/avatar.png',
        dueDate: newProjectDueDate || '30 Dec 2026',
      };
      setProjectsList((prev) => [...prev, newProj]);
    }
    setNewProjectName('');
    setShowAddModal(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 font-sans">
      
      {/* Title Header matching Figma screenshot */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Projects
        </h2>
      </div>

      {/* Projects Table Card matching exact Figma screenshot */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
        
        {/* 5 Column Table Header */}
        <div className="bg-zinc-50/90 dark:bg-zinc-800/60 px-6 py-3.5 border-b border-zinc-200/80 dark:border-zinc-800 grid grid-cols-12 gap-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 items-center select-none">
          <div className="col-span-5">Projects</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Lead</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Projects Rows matching exact Figma screenshot */}
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
          {projectsList.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj.id, proj.name)}
              className="px-6 py-3.5 grid grid-cols-12 gap-4 items-center hover:bg-zinc-50/70 dark:hover:bg-zinc-800/50 transition cursor-pointer group"
            >
              {/* Project Name */}
              <div className="col-span-5 text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white truncate">
                {proj.name}
              </div>

              {/* Priority */}
              <div className="col-span-2 flex items-center gap-1.5 text-xs font-medium">
                {proj.priority === 'High' && (
                  <div className="flex items-center gap-1 text-rose-500 font-medium">
                    <SignalHigh className="w-3.5 h-3.5 text-rose-500" />
                    <span>High</span>
                  </div>
                )}
                {proj.priority === 'Medium' && (
                  <div className="flex items-center gap-1 text-amber-500 font-medium">
                    <SignalMedium className="w-3.5 h-3.5 text-amber-500" />
                    <span>Medium</span>
                  </div>
                )}
                {proj.priority === 'Low' && (
                  <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500 font-medium">
                    <SignalMedium className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Low</span>
                  </div>
                )}
              </div>

              {/* Lead Avatar */}
              <div className="col-span-2 flex items-center">
                <div className="w-6 h-6 rounded-full overflow-hidden shadow-xs border border-zinc-200 dark:border-zinc-700 bg-purple-100 shrink-0">
                  <img src={proj.leadAvatar} alt="Lead Avatar" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Due Date */}
              <div className="col-span-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                {proj.dueDate}
              </div>

              {/* Actions 3-Dots Menu */}
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  title="Actions"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action: + Add Projects button matching Figma screenshot */}
        <div
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3.5 flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 cursor-pointer border-t border-zinc-100 dark:border-zinc-800 transition active:scale-[0.99]"
        >
          <Plus className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          <span>Add Projects</span>
        </div>
      </div>

      {/* Add Project Modal Popup */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-4 animate-in fade-in zoom-in-95 duration-150 font-sans">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <span>Create New Project</span>
            </h3>

            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Homepage"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Priority
                </label>
                <select
                  value={newProjectPriority}
                  onChange={(e) => setNewProjectPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-zinc-900 dark:text-white focus:outline-none"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Due Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12 Sep 2026"
                  value={newProjectDueDate}
                  onChange={(e) => setNewProjectDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-zinc-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white dark:text-zinc-900 bg-[#171717] dark:bg-white hover:bg-black rounded-xl shadow-xs transition"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
