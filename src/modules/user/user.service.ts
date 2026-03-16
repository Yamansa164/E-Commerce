import { Injectable } from '@nestjs/common';
import { ok } from 'src/common/base-response';
import { PrismaService } from 'src/prisma/prisma_service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return ok({ data: await this.prismaService.user.findMany() });
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    return user;
  }

  async findById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });
    return user;
  }
}
