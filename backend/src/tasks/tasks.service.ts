import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument, TaskStatus, TaskPriority } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

  async findAll(query: any): Promise<Task[]> {
    const filter: any = {};

    if (query.guestUserId) {
      filter.guestUserId = query.guestUserId;
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.priority) {
      filter.priority = query.priority;
    }

    if (query.projectId) {
      filter.projectId = query.projectId;
    }

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { labels: { $regex: query.search, $options: 'i' } },
      ];
    }

    return this.taskModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel({
      ...createTaskDto,
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
      updates: [
        {
          id: `upd_${Date.now()}`,
          text: 'Task created',
          createdAt: new Date(),
        },
      ],
    });
    return createdTask.save();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const existingTask = await this.taskModel.findById(id).exec();
    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const updatesAudit: any[] = [...(existingTask.updates || [])];

    if (updateTaskDto.priority && updateTaskDto.priority !== existingTask.priority) {
      updatesAudit.push({
        id: `upd_${Date.now()}`,
        text: `You changed priority to ${updateTaskDto.priority.toUpperCase()}`,
        createdAt: new Date(),
      });
    }

    if (updateTaskDto.status && updateTaskDto.status !== existingTask.status) {
      updatesAudit.push({
        id: `upd_${Date.now()}`,
        text: `You moved task status to ${updateTaskDto.status.replace('_', ' ').toUpperCase()}`,
        createdAt: new Date(),
      });
    }

    const updatedData: any = {
      ...updateTaskDto,
      updates: updatesAudit,
    };

    if (updateTaskDto.dueDate) {
      updatedData.dueDate = new Date(updateTaskDto.dueDate);
    }

    return this.taskModel.findByIdAndUpdate(id, updatedData, { new: true }).exec();
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return { message: 'Task deleted successfully' };
  }

  async addSubtask(id: string, createSubtaskDto: CreateSubtaskDto): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const newSubtask = {
      id: `sub_${Date.now()}`,
      title: createSubtaskDto.title,
      priority: createSubtaskDto.priority || TaskPriority.MEDIUM,
      dueDate: createSubtaskDto.dueDate ? new Date(createSubtaskDto.dueDate) : new Date('2026-09-12'),
      assigneeName: createSubtaskDto.assigneeName || 'Dexter',
    };

    task.subtasks.push(newSubtask);
    task.updates.push({
      id: `upd_${Date.now()}`,
      text: `Added subtask "${createSubtaskDto.title}"`,
      createdAt: new Date(),
    });

    return task.save();
  }

  async addComment(id: string, createCommentDto: CreateCommentDto): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const newComment = {
      id: `comm_${Date.now()}`,
      text: createCommentDto.text,
      authorName: createCommentDto.authorName || 'Dexter',
      createdAt: new Date(),
    };

    task.comments.push(newComment);
    return task.save();
  }

  async seedDefaultTasks(guestUserId: string): Promise<any> {
    await this.taskModel.deleteMany({ guestUserId }).exec();

    const sampleTasks = [
      {
        title: 'Write API Documentation',
        description: 'Create clear and detailed API documentation for public developers in Node/Express/NestJS ecosystem.',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        labels: ['Research', 'Design', 'Development', 'Testing', 'Deployment'],
        dueDate: new Date('2026-09-12'),
        assigneeName: 'Dexter',
        guestUserId,
        subtasks: [
          { id: 'sub_1', title: 'Subtask 1', priority: TaskPriority.HIGH, dueDate: new Date('2026-09-12'), assigneeName: 'Dexter' },
          { id: 'sub_2', title: 'Subtask 2', priority: TaskPriority.LOW, dueDate: new Date('2026-09-15'), assigneeName: 'Dexter' },
          { id: 'sub_3', title: 'Subtask 3', priority: TaskPriority.MEDIUM, dueDate: new Date('2026-09-18'), assigneeName: 'Dexter' },
        ],
        updates: [
          { id: 'upd_1', text: 'You changed priority from No Priority to High', createdAt: new Date() },
          { id: 'upd_2', text: 'You added an update - Aug 10th', createdAt: new Date() },
        ],
        comments: [
          { id: 'comm_1', text: 'Draft documentation structure reviewed by lead.', authorName: 'Sarah', createdAt: new Date() },
        ],
      },
      {
        title: 'Implement Search Function',
        description: 'Add real-time filter search bar across Kanban board and table list views.',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        labels: ['Development', 'Deployment'],
        dueDate: new Date('2026-09-15'),
        assigneeName: 'Dexter',
        guestUserId,
      },
      {
        title: 'Deploy to Production',
        description: 'Setup Vercel frontend & Render backend deployment pipelines.',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        labels: ['Deployment'],
        dueDate: new Date('2026-09-18'),
        assigneeName: 'Dexter',
        guestUserId,
      },
      {
        title: 'Code Review: Completed',
        description: 'Audit pull request code quality and DTO validations.',
        status: TaskStatus.DOING,
        priority: TaskPriority.HIGH,
        labels: ['Testing'],
        dueDate: new Date('2026-09-12'),
        assigneeName: 'Dexter',
        guestUserId,
      },
      {
        title: 'Design Mockups Finalised',
        description: 'Figma screen designs verified against desktop and mobile breakpoints.',
        status: TaskStatus.DOING,
        priority: TaskPriority.HIGH,
        labels: ['Design'],
        dueDate: new Date('2026-09-15'),
        assigneeName: 'Dexter',
        guestUserId,
      },
      {
        title: 'Product Testing Passed',
        description: 'Verify end-to-end task creation, status drag-and-drop, and theme switching.',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.MEDIUM,
        labels: ['Testing'],
        dueDate: new Date('2026-09-10'),
        assigneeName: 'Dexter',
        guestUserId,
      },
      {
        title: 'UI Design Updates',
        description: 'Apply glassmorphism cards and smooth theme transition styles.',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.LOW,
        labels: ['Design'],
        dueDate: new Date('2026-09-11'),
        assigneeName: 'Dexter',
        guestUserId,
      },
      {
        title: 'Security Audit Settlement',
        description: 'Enforce strict CORS and input validation pipes.',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        labels: ['Development'],
        dueDate: new Date('2026-09-08'),
        assigneeName: 'Dexter',
        guestUserId,
      },
    ];

    return this.taskModel.insertMany(sampleTasks);
  }
}
