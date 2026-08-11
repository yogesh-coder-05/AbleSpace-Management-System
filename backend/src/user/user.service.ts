import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getProfile(guestUserId: string): Promise<User> {
    const user = await this.userModel.findOne({ guestUserId }).exec();
    if (!user) {
      // Fallback if not found, return default profile object
      return {
        guestUserId: guestUserId || 'guest_default',
        name: 'Dexter',
        email: 'dexter@gmail.com',
        title: 'Designer',
        username: 'Dexuser',
        theme: 'light',
        colorMode: 'blue',
      } as User;
    }
    return user;
  }

  async updateProfile(guestUserId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { guestUserId },
      { $set: updateProfileDto },
      { new: true, upsert: true },
    ).exec();
    return user;
  }

  async updatePreferences(guestUserId: string, updatePreferencesDto: UpdatePreferencesDto): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { guestUserId },
      { $set: updatePreferencesDto },
      { new: true, upsert: true },
    ).exec();
    return user;
  }
}
