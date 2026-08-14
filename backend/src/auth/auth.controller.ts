import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('guest-login')
  async guestLogin(@Body('name') name?: string) {
    return this.authService.guestLogin(name);
  }

  @Post('logout')
  async logout(@Body('guestUserId') guestUserId?: string) {
    return this.authService.logout(guestUserId);
  }
}
