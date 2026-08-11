import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { UserModule } from './user/user.module';

dotenv.config();

const logger = new Logger('DatabaseSetup');
let mongodInstance: any = null;

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

        if (uri && !uri.includes('localhost') && !uri.includes('127.0.0.1')) {
          logger.log(`Connecting to Cloud MongoDB database...`);
          return {
            uri,
            serverSelectionTimeoutMS: 5000,
          };
        }

        try {
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          if (!mongodInstance) {
            mongodInstance = await MongoMemoryServer.create();
          }
          const memoryUri = mongodInstance.getUri();
          logger.log(`⚡ In-Memory MongoDB Server ready at: ${memoryUri}`);
          return { uri: memoryUri };
        } catch (err) {
          logger.warn(`In-memory MongoDB startup failed: ${err.message}`);
          return { uri: 'mongodb://127.0.0.1:27017/ablespace_tasks' };
        }
      },
    }),
    AuthModule,
    TasksModule,
    ProjectsModule,
    UserModule,
  ],
})
export class AppModule {}
