import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { promises } from 'dns';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 함수 : 암호화 적용
  async transformPassword(user: CreateUserDto): Promise<void> {
    user.user_password = await bcrypt.hash(user.user_password, 10);
    return Promise.resolve();
  }

  // 회원가입
  async create(
    createUserDto: CreateUserDto,
  ): Promise<CreateUserDto | undefined> {
    await this.transformPassword(createUserDto);
    return await this.userRepository.save(createUserDto);
  }

  // async findOne(id: number) {
  //   return await this.userRepository.findOne({ where: { id } });
  // }

  // async update(id: number, updateCatDto: UpdateUserDto) {
  //   const cat = await this.findOne(id);
  //   if (!cat) {
  //     throw new Error('cat not found');
  //   }
  //   Object.assign(cat, updateCatDto);
  //   return await this.userRepository.save(cat);
  // }

  // async remove(id: number) {
  //   const cat = await this.findOne(id);
  //   if (!cat) {
  //     throw new Error('cat not found');
  //   }
  //   return await this.userRepository.remove(cat);
  // }
}
