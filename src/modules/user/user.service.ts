import { Injectable } from '@nestjs/common';


import { PrismaService } from 'src/prisma/prisma_service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

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
