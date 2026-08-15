import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

  async findAll(guestUserId: string): Promise<Project[]> {
    const filter: any = {};
    if (guestUserId) {
      filter.guestUserId = guestUserId;
    }
    const projects = await this.projectModel.find(filter).sort({ createdAt: -1 }).exec();
    if (projects.length === 0 && guestUserId) {
      return this.seedDefaultProjects(guestUserId);
    }
    return projects;
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    let parsedDueDate = new Date('2026-09-30');
    if (createProjectDto.dueDate) {
      const parsed = new Date(createProjectDto.dueDate);
      if (!isNaN(parsed.getTime())) {
        parsedDueDate = parsed;
      }
    }

    const createdProject = new this.projectModel({
      ...createProjectDto,
      dueDate: parsedDueDate,
    });
    return createdProject.save();
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.projectModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return { message: 'Project deleted successfully' };
  }

  async seedDefaultProjects(guestUserId: string): Promise<any> {
    await this.projectModel.deleteMany({ guestUserId }).exec();

    const sampleProjects = [
      {
        name: 'Design Homepage',
        priority: 'high',
        leadName: 'Dexter',
        dueDate: new Date('2026-09-12'),
        guestUserId,
      },
      {
        name: 'Develop Login Feature',
        priority: 'low',
        leadName: 'Dexter',
        dueDate: new Date('2026-09-15'),
        guestUserId,
      },
      {
        name: 'Test Payment Gateway',
        priority: 'medium',
        leadName: 'Dexter',
        dueDate: new Date('2026-09-18'),
        guestUserId,
      },
    ];

    return this.projectModel.insertMany(sampleProjects);
  }
}
