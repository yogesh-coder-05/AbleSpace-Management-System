'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskListView } from '../components/TaskListView';
import { TaskDetailPage } from '../components/TaskDetailPage';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { ProjectsView } from '../components/ProjectsView';
import { GuestLoginModal } from '../components/GuestLoginModal';
import { useGuest } from '../context/GuestContext';
import { Task, TaskPriority, TaskStatus, VisibleFields } from '../types/task';
import { fetchTasksApi, updateTaskApi } from '../lib/api';

import { KanbanSkeleton, ListSkeleton } from '../components/SkeletonLoader';

export default function DashboardPage() {
  const { guestUserId, user, isLoading: isGuestLoading } = useGuest();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'all'>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProjectName, setSelectedProjectName] = useState<string | null>(null);

  const [visibleFields, setVisibleFields] = useState<VisibleFields>({
    priority: true,
    members: true,
    dueDate: true,
    membersAlt: true,
    labels: false,
    status: false,
    reporter: false,
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [createModalStatus, setCreateModalStatus] = useState<TaskStatus>('todo');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const loadTasks = async () => {
    setIsTasksLoading(true);
    try {
      const data = await fetchTasksApi({
        guestUserId: guestUserId || undefined,
        search: searchQuery || undefined,
        priority: selectedPriority !== 'all' ? selectedPriority : undefined,
      });
      setTasks(data);
      setSelectedTask((prevSelected) => {
        if (!prevSelected) return null;
        const freshTask = data.find((t) => t._id === prevSelected._id);
        return freshTask || prevSelected;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsTasksLoading(false);
    }
  };

  useEffect(() => {
    if (!isGuestLoading) {
      loadTasks();
    }
  }, [guestUserId, searchQuery, selectedPriority, isGuestLoading]);

  const handleSelectProject = (id: string | null, name?: string | null) => {
    setSelectedProjectId(id);
    if (name) {
      setSelectedProjectName(name);
    } else if (id === 'projects_view') {
      setSelectedProjectName('Projects');
    } else if (id === 'proj_1') {
      setSelectedProjectName('Design Homepage');
    } else if (id === 'proj_2') {
      setSelectedProjectName('Develop Login Feature');
    } else if (id === 'proj_3') {
      setSelectedProjectName('Test Payment Gateway');
    } else {
      setSelectedProjectName(null);
    }
    setSelectedTask(null);
    if (id && id !== 'projects_view') {
      setViewMode('list');
    }
  };

  const handleOpenCreateModal = (status: TaskStatus = 'todo') => {
    setCreateModalStatus(status);
    setShowCreateModal(true);
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
    try {
      await updateTaskApi(taskId, { status: newStatus });
      loadTasks();
    } catch (err) {
      console.error('Failed to update task status:', err);
      loadTasks();
    }
  };

  const displayTasks = tasks.filter((t) => {
    if (selectedProjectId && selectedProjectId !== 'projects_view') {
      const projName = selectedProjectName?.toLowerCase().trim();
      const hasExactProjId = t.projectId && t.projectId === selectedProjectId;
      const matchesTitle = projName && t.title ? t.title.toLowerCase().includes(projName) : false;
      const hasMatchingTasksInList = tasks.some(
        (task) =>
          (task.projectId && task.projectId === selectedProjectId) ||
          (projName && task.title && task.title.toLowerCase().includes(projName))
      );
      if (hasMatchingTasksInList) {
        if (!hasExactProjId && !matchesTitle) {
          return false;
        }
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = t.title ? t.title.toLowerCase().includes(q) : false;
      const descMatch = t.description ? t.description.toLowerCase().includes(q) : false;
      const labelMatch = t.labels ? t.labels.some((l) => l.toLowerCase().includes(q)) : false;
      const assigneeMatch = t.assigneeName ? t.assigneeName.toLowerCase().includes(q) : false;
      const priorityMatch = t.priority ? t.priority.toLowerCase().includes(q) : false;
      const statusMatch = t.status ? t.status.toLowerCase().includes(q) : false;

      if (!titleMatch && !descMatch && !labelMatch && !assigneeMatch && !priorityMatch && !statusMatch) {
        return false;
      }
    }
    if (selectedPriority !== 'all') {
      if (t.priority?.toLowerCase() !== selectedPriority.toLowerCase()) {
        return false;
      }
    }
    return true;
  });

  if (!isGuestLoading && !guestUserId) {
    return <GuestLoginModal />;
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-950 font-sans selection:bg-zinc-200">
      
      {/* Main Sidebar (Responsive Collapsible Drawer on Mobile) */}
      <Sidebar
        selectedProjectId={selectedProjectId}
        onSelectProject={(id, name) => handleSelectProject(id, name)}
        isOpenMobile={isSidebarOpenMobile}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
        isCollapsed={isSidebarCollapsed}
      />

      {/* Main Body Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {selectedTask ? (
          /* Task Detail Dedicated Page matching exact Figma screenshot */
          <TaskDetailPage
            task={selectedTask}
            onBack={() => setSelectedTask(null)}
            onRefresh={loadTasks}
          />
        ) : (
          <>
            {/* Header Bar */}
            <Header
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              viewMode={viewMode}
              setViewMode={setViewMode}
              selectedPriority={selectedPriority}
              setSelectedPriority={setSelectedPriority}
              onAddTaskClick={() => handleOpenCreateModal('todo')}
              onAddProjectClick={() => setShowAddProjectModal(true)}
              isProjectsView={selectedProjectId === 'projects_view'}
              selectedProjectName={selectedProjectName}
              onToggleSidebar={() => {
                setIsSidebarCollapsed((prev) => !prev);
                setIsSidebarOpenMobile((prev) => !prev);
              }}
              visibleFields={visibleFields}
              setVisibleFields={setVisibleFields}
            />

            {/* View Content (Projects View vs Kanban Board vs Table List vs Skeleton) */}
            <main className="flex-1 overflow-x-auto overflow-y-auto">
              {selectedProjectId === 'projects_view' ? (
                <ProjectsView
                  onSelectProject={(id, name) => handleSelectProject(id, name)}
                  showAddModal={showAddProjectModal}
                  setShowAddModal={setShowAddProjectModal}
                  searchQuery={searchQuery}
                />
              ) : isTasksLoading ? (
                viewMode === 'board' ? <KanbanSkeleton /> : <ListSkeleton />
              ) : viewMode === 'board' ? (
                <KanbanBoard
                  tasks={displayTasks}
                  onCardClick={(task) => setSelectedTask(task)}
                  onAddTaskClick={(status) => handleOpenCreateModal(status || 'todo')}
                  onTaskStatusChange={handleTaskStatusChange}
                />
              ) : (
                <TaskListView
                  tasks={displayTasks}
                  onCardClick={(task) => setSelectedTask(task)}
                  onAddTaskClick={(status) => handleOpenCreateModal(status || 'todo')}
                  visibleFields={visibleFields}
                />
              )}
            </main>
          </>
        )}
      </div>

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

