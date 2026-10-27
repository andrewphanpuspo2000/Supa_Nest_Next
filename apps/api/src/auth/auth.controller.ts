import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { COOKIE_KEYS } from '@supavolt/constants';
import type { JwtPayload } from '@supavolt/types';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

/**
 * Passthrough adalah untuk supaya response dari res dan return dalam belun object di handle oleh nest
 * kalau tidak ada passthrough:true maka object return tidak terkirim ke front end
 *
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(dto);
    this.authService.setTokenCookies(res, tokens);
    return { message: 'Logged in successfully' };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.clearTokenCookies(res);
    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies[COOKIE_KEYS.REFRESH_TOKEN];
    const tokens = await this.authService.refreshTokens(refreshToken);
    this.authService.setTokenCookies(res, tokens);
    return { message: 'Tokens refreshed' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    return user;
  }

  @Get('google')
  @Redirect()
  googleLogin() {
    return { url: this.authService.getGoogleAuthUrl() };
  }

  @Get('google/callback')
  async googleCallBack(@Query('code') code: string, @Res() res: Response) {
    const tokens = await this.authService.handleGoogleCallback(code);
    this.authService.setTokenCookies(res, tokens);
    return res.redirect(
      `${this.configService.get<string>('WEB_URL')}/dashboard`,
    );
  }

  @Get('github')
  @Redirect()
  githubLogin() {
    return { url: this.authService.getGithubAuthUrl() };
  }

  @Get('github/callback')
  async githubCallback(@Query('code') code: string, @Res() res: Response) {
    const tokens = await this.authService.handleGithubCallback(code);
    this.authService.setTokenCookies(res, tokens);
    return res.redirect(
      `${this.configService.get<string>('WEB_URL')}/dashboard`,
    );
  }
}
