import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { compare, hashSync } from 'bcrypt';
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
    else {
      const isPasswordMatch = await compare(password, user.password);
      if (!isPasswordMatch) throw new UnauthorizedException('user not found');
      else {
        const loginResponse = await this.generateToken(user.id);
        return loginResponse;
      }
    }
  }

  async generateToken(userId: number) {
    console.log(`hhhhhhhhhhhh ${userId}`);

    const token = this.jwtService.sign({ sub: userId });
    console.log('hhhhhhhhhhhh11');

    return {
      userId,
      token,
    };
  }

  async validJwtUser(userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException();
    return {
      id: userId,
      role: user.role,
    };
  }

  register(createUserDto: CreateUserDto) {
    const hashedPassword = hashSync(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    const user = this.prismaService.user.create({ data: createUserDto });

    return user;
  }
}
