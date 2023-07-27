import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
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
