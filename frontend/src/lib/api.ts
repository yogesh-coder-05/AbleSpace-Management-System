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

export const guestLogoutApi = async (guestUserId?: string): Promise<{ message: string }> => {
  try {
    const res = await api.post('/auth/logout', { guestUserId });
    return res.data;
  } catch (err) {
    return { message: 'Logged out successfully' };
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
    const newSub: SubtaskItem = {
      id: `sub_${Date.now()}`,
      title: subtask.title,
      priority: subtask.priority || 'medium',
      dueDate: subtask.dueDate || '2026-09-12',
      assigneeName: subtask.assigneeName || 'Dexter',
    };
    const task = fallbackTasksStore.find((t) => t._id === taskId);
    if (task) {
      if (!task.subtasks) task.subtasks = [];
      task.subtasks.push(newSub);
      return task;
    }
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

export const createProjectApi = async (projectData: {
  name: string;
  priority?: string;
  dueDate?: string;
  guestUserId?: string;
}): Promise<Project> => {
  try {
    const res = await api.post('/projects', projectData);
    return res.data;
  } catch (err) {
    return {
      _id: `proj_${Date.now()}`,
      name: projectData.name,
      priority: (projectData.priority as TaskPriority) || 'medium',
      leadName: 'Dexter',
      dueDate: projectData.dueDate || '2026-12-30',
      guestUserId: projectData.guestUserId || 'guest_demo',
    };
  }
};

export const deleteProjectApi = async (id: string): Promise<void> => {
  try {
    await api.delete(`/projects/${id}`);
  } catch (err) {
    console.warn('Delete project API error:', err);
  }
};

let fallbackTasksStore: Task[] = [
  // --- TO DO TASKS ---
  {
    _id: 't_1',
    title: 'Design Homepage',
    description: 'Create responsive landing page mockups and Figma design components.',
    status: 'todo',
    priority: 'high',
    labels: ['Design', 'Research'],
    dueDate: '2026-09-12',
    assigneeName: 'Dexter',
    projectId: 'proj_1',
    subtasks: [
      { id: 's1', title: 'Header Wireframe', priority: 'high', dueDate: '2026-09-12', assigneeName: 'Dexter' },
      { id: 's2', title: 'Footer Links', priority: 'low', dueDate: '2026-09-15', assigneeName: 'Dexter' },
    ],
    updates: [
      { id: 'u1', text: 'Task created for Design Homepage', createdAt: '2026-08-10T12:00:00Z' },
    ],
    comments: [
      { id: 'c1', text: 'Initial design direction approved.', authorName: 'Sarah', createdAt: '2026-08-10T12:05:00Z' },
    ],
    guestUserId: 'guest_demo',
  },
  {
    _id: 't_2',
    title: 'Develop Login Feature',
    description: 'Build JWT authentication and guest user login session handler.',
    status: 'todo',
    priority: 'low',
    labels: ['Development'],
    dueDate: '2026-09-15',
    assigneeName: 'Dexter',
    projectId: 'proj_2',
    subtasks: [],
    updates: [],
    comments: [],
    guestUserId: 'guest_demo',
  },
  {
    _id: 't_3',
    title: 'Test Payment Gateway',
    description: 'Integrate Stripe sandbox API and test checkout webhook callbacks.',
    status: 'todo',
    priority: 'medium',
    labels: ['Testing', 'Deployment'],
    dueDate: '2026-09-18',
    assigneeName: 'Dexter',
    projectId: 'proj_3',
    subtasks: [],
    updates: [],
    comments: [],
    guestUserId: 'guest_demo',
  },

  // --- DOING TASKS ---
  {
    _id: 't_4',
    title: 'Design Homepage',
    description: 'Refining hero header animations and dark theme color palette.',
    status: 'doing',
    priority: 'high',
    labels: ['Design'],
    dueDate: '2026-09-12',
    assigneeName: 'Dexter',
    projectId: 'proj_1',
    subtasks: [],
    updates: [],
    comments: [],
    guestUserId: 'guest_demo',
  },
  {
    _id: 't_5',
    title: 'Develop Login Feature',
    description: 'Connecting frontend login modal with NestJS auth endpoints.',
    status: 'doing',
    priority: 'low',
    labels: ['Development'],
    dueDate: '2026-09-15',
    assigneeName: 'Dexter',
    projectId: 'proj_2',
    subtasks: [],
    updates: [],
    comments: [],
    guestUserId: 'guest_demo',
  },
  {
    _id: 't_6',
    title: 'Test Payment Gateway',
    description: 'Executing unit tests for payment success and failure flows.',
    status: 'doing',
    priority: 'medium',
    labels: ['Testing'],
    dueDate: '2026-09-18',
    assigneeName: 'Dexter',
    projectId: 'proj_3',
    subtasks: [],
    updates: [],
    comments: [],
    guestUserId: 'guest_demo',
  },

  // --- COMPLETED TASKS ---
  {
    _id: 't_7',
    title: 'Design Homepage',
    description: 'Initial design wireframes approved by product manager.',
    status: 'completed',
    priority: 'high',
    labels: ['Design'],
    dueDate: '2026-09-12',
    assigneeName: 'Dexter',
    projectId: 'proj_1',
    subtasks: [],
    updates: [],
    comments: [],
    guestUserId: 'guest_demo',
  },
  {
    _id: 't_8',
    title: 'Develop Login Feature',
    description: 'Database user schema created with password hashing.',
    status: 'completed',
    priority: 'low',
    labels: ['Development'],
    dueDate: '2026-09-15',
    assigneeName: 'Dexter',
    projectId: 'proj_2',
    subtasks: [],
    updates: [],
    comments: [],
    guestUserId: 'guest_demo',
  },
  {
    _id: 't_9',
    title: 'Test Payment Gateway',
    description: 'API key secret credentials safely configured in environment vars.',
    status: 'completed',
    priority: 'medium',
    labels: ['Deployment'],
    dueDate: '2026-09-18',
    assigneeName: 'Dexter',
    projectId: 'proj_3',
    subtasks: [],
    updates: [],
    comments: [],
    guestUserId: 'guest_demo',
  },
];

function getFallbackTasks(): Task[] {
  return fallbackTasksStore;
}
