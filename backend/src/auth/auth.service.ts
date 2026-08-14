import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { TasksService } from '../tasks/tasks.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private tasksService: TasksService,
    private projectsService: ProjectsService,
  ) {}

  async guestLogin(customName?: string): Promise<{ guestUserId: string; user: User; message: string }> {
    const guestUserId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const userName = customName || 'Dexter';

    const newUser = new this.userModel({
      guestUserId,
      name: userName,
      email: 'dexter@gmail.com',
      title: 'Designer',
      username: 'Dexuser',
      theme: 'light',
      colorMode: 'blue',
    });

    const savedUser = await newUser.save();

    // Auto-seed initial demo tasks and projects for the guest user
    await this.tasksService.seedDefaultTasks(guestUserId);
    await this.projectsService.seedDefaultProjects(guestUserId);

    return {
      guestUserId,
      user: savedUser,
      message: 'Guest session created successfully',
    };
  }

  async logout(guestUserId?: string): Promise<{ message: string }> {
    return { message: 'Logged out successfully' };
  }
}
