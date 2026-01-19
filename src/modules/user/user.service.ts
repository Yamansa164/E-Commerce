import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashSync } from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma_service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    const hashedPassword = hashSync(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    const user = this.prismaService.user.create({ data: createUserDto });

    return user;
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findFirst({ where: { email } });
    return user;
  }

  async findById(id: number) {
    const user = await this.prismaService.user.findFirst({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });
    return user;
  }
}
