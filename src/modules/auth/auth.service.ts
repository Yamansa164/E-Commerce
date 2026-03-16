import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma_service';

@Injectable()
export class AuthService {
  constructor(
    readonly userService: UserService,
    readonly prismaService: PrismaService,

    private readonly jwtService: JwtService,
  ) {}
  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new UnauthorizedException('user not found');

    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch) throw new UnauthorizedException('user not found');

    return this.generateToken(user.id);
  }

  async generateToken(userId: number) {
    const token = this.jwtService.sign({ sub: userId });

    return {
      userId,
      token,
    };
  }

  async validateJwtUser(userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException();
    return {
      id: userId,
      role: user.role,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await hash(createUserDto.password, 10);
    const user = this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    return user;
  }
}
