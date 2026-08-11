import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdatePreferencesDto {
  @IsEnum(['light', 'dark'])
  @IsOptional()
  theme?: string;

  @IsEnum(['blue', 'amber', 'pink', 'rose', 'emerald', 'black'])
  @IsOptional()
  colorMode?: string;
}
