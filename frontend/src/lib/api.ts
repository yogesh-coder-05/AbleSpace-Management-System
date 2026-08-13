import axios from 'axios';
import { Task, Project, UserProfile, TaskStatus, TaskPriority } from '../types/task';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

export const guestLoginApi = async (name?: string): Promise<{ guestUserId: string; user: UserProfile }> => {
  try {
    const res = await api.post('/auth/guest-login', { name: name || 'Dexter' });
    return res.data;
  } catch (err) {
    const guestUserId = `guest_${Date.now()}`;
    return {
      guestUserId,
      user: {
        guestUserId,
        name: name || 'Dexter',
        email: 'dexter@gmail.com',
        title: 'Designer',
        username: 'Dexuser',
        theme: 'light',
        colorMode: 'blue',
      },
    };
  }
};

export const fetchTasksApi = async (params: {
  guestUserId?: string;
  search?: string;
  status?: string;
  priority?: string;
  projectId?: string;
}): Promise<Task[]> => {
  try {
    const res = await api.get('/tasks', { params });
    let list: Task[] = res.data;
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter((t) => {
        const titleMatch = t.title ? t.title.toLowerCase().includes(q) : false;
        const descMatch = t.description ? t.description.toLowerCase().includes(q) : false;
        const labelMatch = t.labels ? t.labels.some((l) => l.toLowerCase().includes(q)) : false;
        const assigneeMatch = t.assigneeName ? t.assigneeName.toLowerCase().includes(q) : false;
        const priorityMatch = t.priority ? t.priority.toLowerCase().includes(q) : false;
        const statusMatch = t.status ? t.status.toLowerCase().includes(q) : false;
        return titleMatch || descMatch || labelMatch || assigneeMatch || priorityMatch || statusMatch;
      });
    }
    if (params.priority && params.priority !== 'all') {
      list = list.filter((t) => t.priority?.toLowerCase() === params.priority?.toLowerCase());
    }
    return list;
  } catch (err) {
    let fallback = getFallbackTasks();
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      fallback = fallback.filter((t) => {
        const titleMatch = t.title ? t.title.toLowerCase().includes(q) : false;
        const descMatch = t.description ? t.description.toLowerCase().includes(q) : false;
        const labelMatch = t.labels ? t.labels.some((l) => l.toLowerCase().includes(q)) : false;
        const assigneeMatch = t.assigneeName ? t.assigneeName.toLowerCase().includes(q) : false;
        const priorityMatch = t.priority ? t.priority.toLowerCase().includes(q) : false;
        const statusMatch = t.status ? t.status.toLowerCase().includes(q) : false;
        return titleMatch || descMatch || labelMatch || assigneeMatch || priorityMatch || statusMatch;
      });
    }
    if (params.priority && params.priority !== 'all') {
      fallback = fallback.filter((t) => t.priority?.toLowerCase() === params.priority?.toLowerCase());
    }
    return fallback;
  }
};

export const createTaskApi = async (taskData: Partial<Task>): Promise<Task> => {
  try {
    const res = await api.post('/tasks', taskData);
    return res.data;
  } catch (err) {
    return {
      _id: `task_${Date.now()}`,
      title: taskData.title || 'New Task',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      labels: taskData.labels || ['Development'],
      dueDate: taskData.dueDate || new Date().toISOString(),
      assigneeName: 'Dexter',
      subtasks: [],
      updates: [{ id: `upd_${Date.now()}`, text: 'Task created', createdAt: new Date().toISOString() }],
      comments: [],
      guestUserId: taskData.guestUserId || 'guest_demo',
    };
  }
};

export const updateTaskApi = async (id: string, updateData: Partial<Task>): Promise<Task> => {
  try {
    const res = await api.patch(`/tasks/${id}`, updateData);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const deleteTaskApi = async (id: string): Promise<void> => {
  try {
    await api.delete(`/tasks/${id}`);
  } catch (err) {
    console.warn('API delete task failed:', err);
  }
};

export const addSubtaskApi = async (
  taskId: string,
  subtask: { title: string; priority?: TaskPriority; dueDate?: string; assigneeName?: string }
): Promise<Task> => {
  try {
    const res = await api.post(`/tasks/${taskId}/subtasks`, subtask);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const addCommentApi = async (
  taskId: string,
  comment: { text: string; authorName?: string }
): Promise<Task> => {
  try {
    const res = await api.post(`/tasks/${taskId}/comments`, comment);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const fetchUserProfileApi = async (guestUserId: string): Promise<UserProfile> => {
  try {
    const res = await api.get('/user/profile', { params: { guestUserId } });
    return res.data;
  } catch (err) {
    return {
      guestUserId: guestUserId || 'guest_demo',
      name: 'Dexter',
      email: 'dexter@gmail.com',
      title: 'Designer',
      username: 'Dexuser',
      theme: 'light',
      colorMode: 'blue',
    };
  }
};

export const updateUserProfileApi = async (
  guestUserId: string,
  data: Partial<UserProfile>
): Promise<UserProfile> => {
  try {
    const res = await api.patch('/user/profile', data, { params: { guestUserId } });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const updateUserPreferencesApi = async (
  guestUserId: string,
  prefs: { theme?: string; colorMode?: string }
): Promise<UserProfile> => {
  try {
    const res = await api.patch('/user/preferences', prefs, { params: { guestUserId } });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const fetchProjectsApi = async (guestUserId: string): Promise<Project[]> => {
  try {
    const res = await api.get('/projects', { params: { guestUserId } });
    return res.data;
  } catch (err) {
    return [
      { _id: 'proj_1', name: 'Design Homepage', priority: 'high', leadName: 'Dexter', dueDate: '2026-09-12', guestUserId },
      { _id: 'proj_2', name: 'Develop Login Feature', priority: 'low', leadName: 'Dexter', dueDate: '2026-09-15', guestUserId },
      { _id: 'proj_3', name: 'Test Payment Gateway', priority: 'medium', leadName: 'Dexter', dueDate: '2026-09-18', guestUserId },
    ];
  }
};

function getFallbackTasks(): Task[] {
  return [
    {
      _id: 't_1',
      title: 'Write API Documentation',
      description: 'Create clear and detailed API documentation for public developers in Node/Express/NestJS ecosystem.',
      status: 'todo',
      priority: 'high',
      labels: ['Research', 'Design', 'Development', 'Testing', 'Deployment'],
      dueDate: '2026-09-12',
      assigneeName: 'Dexter',
      subtasks: [
        { id: 's1', title: 'Subtask 1', priority: 'high', dueDate: '2026-09-12', assigneeName: 'Dexter' },
        { id: 's2', title: 'Subtask 2', priority: 'low', dueDate: '2026-09-15', assigneeName: 'Dexter' },
        { id: 's3', title: 'Subtask 3', priority: 'medium', dueDate: '2026-09-18', assigneeName: 'Dexter' },
      ],
      updates: [
        { id: 'u1', text: 'You changed priority from No Priority to High', createdAt: '2026-08-10T12:00:00Z' },
        { id: 'u2', text: 'You added an update - Aug 10th', createdAt: '2026-08-10T12:10:00Z' },
      ],
      comments: [
        { id: 'c1', text: 'Draft documentation structure reviewed by lead.', authorName: 'Sarah', createdAt: '2026-08-10T12:05:00Z' },
      ],
      guestUserId: 'guest_demo',
    },
    {
      _id: 't_2',
      title: 'Implement Search Function',
      description: 'Add real-time filter search bar across Kanban board and table list views.',
      status: 'todo',
      priority: 'medium',
      labels: ['Development', 'Deployment'],
      dueDate: '2026-09-15',
      assigneeName: 'Dexter',
      subtasks: [],
      updates: [],
      comments: [],
      guestUserId: 'guest_demo',
    },
    {
      _id: 't_3',
      title: 'Deploy to Production',
      description: 'Setup Vercel frontend & Render backend deployment pipelines.',
      status: 'todo',
      priority: 'low',
      labels: ['Deployment'],
      dueDate: '2026-09-18',
      assigneeName: 'Dexter',
      subtasks: [],
      updates: [],
      comments: [],
      guestUserId: 'guest_demo',
    },
    {
      _id: 't_4',
      title: 'Code Review: Completed',
      description: 'Audit pull request code quality and DTO validations.',
      status: 'doing',
      priority: 'high',
      labels: ['Testing'],
      dueDate: '2026-09-12',
      assigneeName: 'Dexter',
      subtasks: [],
      updates: [],
      comments: [],
      guestUserId: 'guest_demo',
    },
    {
      _id: 't_5',
      title: 'Design Mockups Finalised',
      description: 'Figma screen designs verified against desktop and mobile breakpoints.',
      status: 'doing',
      priority: 'high',
      labels: ['Design'],
      dueDate: '2026-09-15',
      assigneeName: 'Dexter',
      subtasks: [],
      updates: [],
      comments: [],
      guestUserId: 'guest_demo',
    },
    {
      _id: 't_6',
      title: 'Product Testing Passed',
      description: 'Verify end-to-end task creation, status drag-and-drop, and theme switching.',
      status: 'completed',
      priority: 'medium',
      labels: ['Testing'],
      dueDate: '2026-09-10',
      assigneeName: 'Dexter',
      subtasks: [],
      updates: [],
      comments: [],
      guestUserId: 'guest_demo',
    },
    {
      _id: 't_7',
      title: 'UI Design Updates',
      description: 'Apply glassmorphic cards and smooth theme transition styles.',
      status: 'completed',
      priority: 'low',
      labels: ['Design'],
      dueDate: '2026-09-11',
      assigneeName: 'Dexter',
      subtasks: [],
      updates: [],
      comments: [],
      guestUserId: 'guest_demo',
    },
    {
      _id: 't_8',
      title: 'Security Audit Settlement',
      description: 'Enforce strict CORS and input validation pipes.',
      status: 'completed',
      priority: 'high',
      labels: ['Development'],
      dueDate: '2026-09-08',
      assigneeName: 'Dexter',
      subtasks: [],
      updates: [],
      comments: [],
      guestUserId: 'guest_demo',
    },
  ];
}
