import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../auth/decorator/public.decorator';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorator/role.decorator';
import { RolesGuard } from '../auth/guards/role.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Get()
  @Roles([Role.admin])
  @UseGuards(RolesGuard)
  findAll() {
    return this.userService.findAll();
  }
}
