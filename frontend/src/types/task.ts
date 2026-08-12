export type TaskStatus = 'todo' | 'doing' | 'completed' | 'on_hold';

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low' | 'none';

export type ColorMode = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';

export type ThemeMode = 'light' | 'dark';

export interface SubtaskItem {
  id: string;
  title: string;
  priority: TaskPriority;
  dueDate?: string;
  assigneeName?: string;
}

export interface UpdateItem {
  id: string;
  text: string;
  createdAt: string;
}

export interface CommentItem {
  id: string;
  text: string;
  authorName: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  labels: string[];
  dueDate?: string;
  assigneeName: string;
  projectId?: string;
  subtasks: SubtaskItem[];
  updates: UpdateItem[];
  comments: CommentItem[];
  guestUserId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  name: string;
  priority: TaskPriority;
  leadName: string;
  dueDate?: string;
  guestUserId: string;
}

export interface UserProfile {
  guestUserId: string;
  name: string;
  email: string;
  title: string;
  username: string;
  theme: ThemeMode;
  colorMode: ColorMode;
}
