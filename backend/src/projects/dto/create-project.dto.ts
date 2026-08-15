import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['urgent', 'high', 'medium', 'low', 'none'])
  @IsOptional()
  priority?: string;

  @IsString()
  @IsOptional()
  leadName?: string;

  @IsString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsNotEmpty()
  guestUserId: string;
}
