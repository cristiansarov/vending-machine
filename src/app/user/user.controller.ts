import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import UserService from './user.service';
import {
  UserDetails,
  UserRegistrationDetails,
} from './types/user.controllerTypes';
import { Authenticated } from '../security/decorators/security.decorators';
import { UserRoles } from '../../global/universal.types';

@Controller('/user')
export default class UserController {
  @Inject() private readonly userService: UserService;

  @Post('/')
  createUser(@Body() body: UserRegistrationDetails) {
    return this.userService.createUser(body);
  }

  @Authenticated({ oneOfRoles: [UserRoles.seller] })
  @Get('/')
  getUsers() {
    return this.userService.getUsers();
  }

  @Authenticated({ oneOfRoles: [UserRoles.seller] })
  @Get('/:userId')
  getUser(@Param('userId') userId: string) {
    return this.userService.getUser(parseInt(userId));
  }

  @Authenticated({ oneOfRoles: [UserRoles.seller] })
  @Put('/:userId')
  updateUser(
    @Param('userId') userId: string,
    @Body() body: UserDetails,
    @Req() req: Request,
  ) {
    if (req.user.id !== parseInt(userId)) {
      throw new ForbiddenException("You don't have access to update this user");
    }
    return this.userService.updateUser(parseInt(userId), body);
  }

  @Authenticated({ oneOfRoles: [UserRoles.seller] })
  @Delete('/:userId')
  deleteUser(@Param('userId') userId: string, @Req() req: Request) {
    if (req.user.id !== parseInt(userId)) {
      throw new ForbiddenException("You don't have access to delete this user");
    }
    return this.userService.deleteUser(parseInt(userId));
  }
}
