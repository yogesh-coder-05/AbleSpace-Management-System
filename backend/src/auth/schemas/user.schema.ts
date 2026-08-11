import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  guestUserId: string;

  @Prop({ default: 'Dexter' })
  name: string;

  @Prop({ default: 'dexter@gmail.com' })
  email: string;

  @Prop({ default: 'Designer' })
  title: string;

  @Prop({ default: 'Dexuser' })
  username: string;

  @Prop({ default: 'light', enum: ['light', 'dark'] })
  theme: string;

  @Prop({ default: 'blue', enum: ['blue', 'amber', 'pink', 'rose', 'emerald', 'black'] })
  colorMode: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
