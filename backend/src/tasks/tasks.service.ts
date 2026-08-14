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
    const existingTask = await this.taskModel.findOne({ _id: id }).exec();
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

    return this.taskModel.findOneAndUpdate({ _id: id }, updatedData, { new: true }).exec();
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.taskModel.findOneAndDelete({ _id: id }).exec();
    if (!result) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return { message: 'Task deleted successfully' };
  }

  async addSubtask(id: string, createSubtaskDto: CreateSubtaskDto): Promise<Task> {
    const task = await this.taskModel.findOne({ _id: id }).exec();
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
    const task = await this.taskModel.findOne({ _id: id }).exec();
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
      // TO DO TASKS
      {
        title: 'Design Homepage',
        description: 'Create responsive landing page mockups and Figma design components.',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        labels: ['Design', 'Research'],
        dueDate: new Date('2026-09-12'),
        assigneeName: 'Dexter',
        guestUserId,
        projectId: 'proj_1',
      },
      {
        title: 'Develop Login Feature',
        description: 'Build JWT authentication and guest user login session handler.',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        labels: ['Development'],
        dueDate: new Date('2026-09-15'),
        assigneeName: 'Dexter',
        guestUserId,
        projectId: 'proj_2',
      },
      {
        title: 'Test Payment Gateway',
        description: 'Integrate Stripe sandbox API and test checkout webhook callbacks.',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        labels: ['Testing', 'Deployment'],
        dueDate: new Date('2026-09-18'),
        assigneeName: 'Dexter',
        guestUserId,
        projectId: 'proj_3',
      },

      // DOING TASKS
      {
        title: 'Design Homepage',
        description: 'Refining hero header animations and dark theme color palette.',
        status: TaskStatus.DOING,
        priority: TaskPriority.HIGH,
        labels: ['Design'],
        dueDate: new Date('2026-09-12'),
        assigneeName: 'Dexter',
        guestUserId,
        projectId: 'proj_1',
      },
      {
        title: 'Develop Login Feature',
        description: 'Connecting frontend login modal with NestJS auth endpoints.',
        status: TaskStatus.DOING,
        priority: TaskPriority.LOW,
        labels: ['Development'],
        dueDate: new Date('2026-09-15'),
        assigneeName: 'Dexter',
        guestUserId,
        projectId: 'proj_2',
      },
      {
        title: 'Test Payment Gateway',
        description: 'Executing unit tests for payment success and failure flows.',
        status: TaskStatus.DOING,
        priority: TaskPriority.MEDIUM,
        labels: ['Testing'],
        dueDate: new Date('2026-09-18'),
        assigneeName: 'Dexter',
        guestUserId,
        projectId: 'proj_3',
      },

      // COMPLETED TASKS
      {
        title: 'Design Homepage',
        description: 'Initial design wireframes approved by product manager.',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        labels: ['Design'],
        dueDate: new Date('2026-09-12'),
        assigneeName: 'Dexter',
        guestUserId,
        projectId: 'proj_1',
      },
      {
        title: 'Develop Login Feature',
        description: 'Database user schema created with password hashing.',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.LOW,
        labels: ['Development'],
        dueDate: new Date('2026-09-15'),
        assigneeName: 'Dexter',
        guestUserId,
        projectId: 'proj_2',
      },
      {
        title: 'Test Payment Gateway',
        description: 'API key secret credentials safely configured in environment vars.',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.MEDIUM,
        labels: ['Deployment'],
        dueDate: new Date('2026-09-18'),
        assigneeName: 'Dexter',
        guestUserId,
        projectId: 'proj_3',
      },
    ];

    return this.taskModel.insertMany(sampleTasks);
  }
}
