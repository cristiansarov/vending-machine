import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import SecurityService from './security.service';
import { Authenticated } from './decorators/security.decorators';
import { AuthGuard } from '@nestjs/passport';
import { LoginRequest } from './types/security.controllerTypes';
import { JwtService } from '@nestjs/jwt';
import { AUTH_TOKEN_COOKIE_NAME } from './types/security.constants';


@Controller('/security')
export class SecurityController {
  @Inject() private readonly securityService: SecurityService;
  @Inject() jwtService: JwtService;

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Body() body: LoginRequest, @Req() req: Request, @Res() res: Response) {
    const token = await this.securityService.generateToken(req.user.id);
    await this.securityService.createUserSession(req.user.id, token);
    const activeSessions = await this.securityService.countActiveUserSessions(req.user.id);
    res.cookie(AUTH_TOKEN_COOKIE_NAME, token);
    res.json({ activeSessions });
  }

  @Authenticated()
  @Get('/profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @Authenticated()
  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.securityService.removeUserSession(req.user.id, req.cookies.authToken);
    res.clearCookie(AUTH_TOKEN_COOKIE_NAME)
    res.sendStatus(204);
  }

  @Authenticated()
  @Post('/logout/all')
  async logoutAll(@Req() req: Request, @Res() res: Response) {
    await this.securityService.removeAllUserSessions(req.user.id);
    res.clearCookie(AUTH_TOKEN_COOKIE_NAME)
    res.sendStatus(204);
  }
}
