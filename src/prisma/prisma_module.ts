import { Global, Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma_service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
