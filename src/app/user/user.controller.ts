import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import UserService from './user.service';
import { UserDetails, UserRegistrationDetails } from './types/user.controllerTypes';
import { Authenticated } from '../security/decorators/security.decorators';
import { UserRoles } from './types/user.types';


@Controller('/user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

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
  updateUser(@Param('userId') userId: string, @Body() body: UserDetails) {
    return this.userService.updateUser(parseInt(userId), body);
  }

  @Authenticated({ oneOfRoles: [UserRoles.seller] })
  @Delete('/:userId')
  deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(parseInt(userId));
  }
}
