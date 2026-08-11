import { Controller, Get, Patch, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Query('guestUserId') guestUserId: string) {
    return this.userService.getProfile(guestUserId);
  }

  @Patch('profile')
  async updateProfile(
    @Query('guestUserId') guestUserId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(guestUserId, updateProfileDto);
  }

  @Patch('preferences')
  async updatePreferences(
    @Query('guestUserId') guestUserId: string,
    @Body() updatePreferencesDto: UpdatePreferencesDto,
  ) {
    return this.userService.updatePreferences(guestUserId, updatePreferencesDto);
  }
}
