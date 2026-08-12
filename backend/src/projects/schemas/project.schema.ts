import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: 'high', enum: ['urgent', 'high', 'medium', 'low', 'none'] })
  priority: string;

  @Prop({ default: 'Dexter' })
  leadName: string;

  @Prop({ type: Date, default: null })
  dueDate: Date;

  @Prop({ required: true, index: true })
  guestUserId: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
