import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

import { Role } from '@prisma/client';
import { Roles } from '../auth/decorator/role.decorator';
import { RolesGuard } from '../auth/guards/role.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles([Role.admin])
  @UseGuards(RolesGuard)
  findAll() {
    return this.userService.findAll();
  }
}
