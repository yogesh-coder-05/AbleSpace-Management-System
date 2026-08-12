'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskListView } from '../components/TaskListView';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { GuestLoginModal } from '../components/GuestLoginModal';
import { useGuest } from '../context/GuestContext';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import { fetchTasksApi } from '../lib/api';

export default function DashboardPage() {
  const { guestUserId, user, isLoading: isGuestLoading } = useGuest();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'all'>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalStatus, setCreateModalStatus] = useState<TaskStatus>('todo');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  const loadTasks = async () => {
    try {
      const data = await fetchTasksApi({
        guestUserId: guestUserId || undefined,
        search: searchQuery || undefined,
        priority: selectedPriority !== 'all' ? selectedPriority : undefined,
        projectId: selectedProjectId || undefined,
      });
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isGuestLoading) {
      loadTasks();
    }
  }, [guestUserId, searchQuery, selectedPriority, selectedProjectId, isGuestLoading]);

  const handleOpenCreateModal = (status: TaskStatus = 'todo') => {
    setCreateModalStatus(status);
    setShowCreateModal(true);
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-950 font-sans selection:bg-zinc-200">
      
      {/* Show Guest Login Modal if no guest session active */}
      {!isGuestLoading && !guestUserId && <GuestLoginModal />}

      {/* Main Sidebar (Responsive Collapsible Drawer on Mobile) */}
      <Sidebar
        selectedProjectId={selectedProjectId}
        onSelectProject={(id) => setSelectedProjectId(id)}
        isOpenMobile={isSidebarOpenMobile}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
      />

      {/* Main Body Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Header Bar */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedPriority={selectedPriority}
          setSelectedPriority={setSelectedPriority}
          onAddTaskClick={() => handleOpenCreateModal('todo')}
          selectedProjectName={selectedProjectId ? 'Design Homepage' : null}
          onToggleSidebar={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
        />

        {/* View Content (Kanban Board vs Table List) */}
        <main className="flex-1 overflow-x-auto overflow-y-auto">
          {viewMode === 'board' ? (
            <KanbanBoard
              tasks={tasks}
              onCardClick={(task) => setSelectedTask(task)}
              onAddTaskClick={(status) => handleOpenCreateModal(status || 'todo')}
            />
          ) : (
            <TaskListView
              tasks={tasks}
              onCardClick={(task) => setSelectedTask(task)}
              onAddTaskClick={(status) => handleOpenCreateModal(status || 'todo')}
            />
          )}
        </main>
      </div>

      {/* Task Detail Popup Dialog */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onRefresh={loadTasks}
        />
      )}

      {/* Create Task Popup Dialog */}
      {showCreateModal && (
        <CreateTaskModal
          initialStatus={createModalStatus}
          onClose={() => setShowCreateModal(false)}
          onRefresh={loadTasks}
        />
      )}
    </div>
  );
}

