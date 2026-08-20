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

@Schema({ _id: false })
export class SubtaskItem {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({
    type: String,
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Prop({ type: Date, default: null })
  dueDate?: Date;

  @Prop({ default: 'Dexter' })
  assigneeName?: string;
}

export const SubtaskSchema = SchemaFactory.createForClass(SubtaskItem);

@Schema({ _id: false })
export class UpdateItem {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  text: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const UpdateSchema = SchemaFactory.createForClass(UpdateItem);

@Schema({ _id: false })
export class CommentItem {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  text: string;

  @Prop({ default: 'Dexter' })
  authorName: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(CommentItem);

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

  @Prop({ type: [SubtaskSchema], default: [] })
  subtasks: SubtaskItem[];

  @Prop({ type: [UpdateSchema], default: [] })
  updates: UpdateItem[];

  @Prop({ type: [CommentSchema], default: [] })
  comments: CommentItem[];

  @Prop({ required: true, index: true })
  guestUserId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
