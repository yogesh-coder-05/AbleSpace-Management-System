import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

export enum TaskStatus {
  TODO = 'todo',
  DOING = 'doing',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
}

export enum TaskPriority {
  URGENT = 'urgent',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  NONE = 'none',
}

export interface SubtaskItem {
  id: string;
  title: string;
  priority: string;
  dueDate?: Date;
  assigneeName?: string;
}

export interface UpdateItem {
  id: string;
  text: string;
  createdAt: Date;
}

export interface CommentItem {
  id: string;
  text: string;
  authorName: string;
  createdAt: Date;
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true, enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Prop({ required: true, enum: TaskPriority, default: TaskPriority.NONE })
  priority: TaskPriority;

  @Prop({ type: [String], default: [] })
  labels: string[];

  @Prop({ type: Date, default: null })
  dueDate: Date;

  @Prop({ default: 'Dexter' })
  assigneeName: string;

  @Prop({ default: '' })
  projectId: string;

  @Prop({ type: Array, default: [] })
  subtasks: SubtaskItem[];

  @Prop({ type: Array, default: [] })
  updates: UpdateItem[];

  @Prop({ type: Array, default: [] })
  comments: CommentItem[];

  @Prop({ required: true, index: true })
  guestUserId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
