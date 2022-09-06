import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async create({ input }) {
    const { password, ...rest } = input;
    //비밀번호 암호화
    const hash = await bcrypt.hash(password, 2);

    return await this.boardRepository.save({ ...rest, password: hash });
  }

  async check({ input }) {
    if (input.password.length < 6)
      throw new ConflictException('password 길이 6 미만');

    let count = 0;
    input.password.split('').forEach((ele) => {
      if (!isNaN(ele)) count++;
    });
    if (count === 0)
      throw new ConflictException('password에 숫자를 넣어주세요');

    if (input.title.length > 20)
      throw new ConflictException('title 길이 20 초과');

    if (input.content.length > 200)
      throw new ConflictException('content 길이 200 초과');
  }

  async delete({ id }) {
    const result = await this.boardRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}
