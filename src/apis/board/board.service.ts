import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

  async delete({ id, input }) {
    const board = await this.boardRepository.findOne({ where: { id } });
    if (!board) throw new ConflictException('id값에 일치하는 정보가 없습니다');
    const authcheck = await bcrypt.compare(input.password, board.password); //user.password - 해쉬된 비밀번호
    if (!authcheck) throw new UnauthorizedException('비밀번호가 틀렸습니다!!!');
    const result = await this.boardRepository.softDelete({ id });
    return result.affected ? true : false;
  }

  async update({ id, input }) {
    const board = await this.boardRepository.findOne({ where: { id } });
    if (!board) throw new ConflictException('id값에 일치하는 정보가 없습니다');
    const authcheck = await bcrypt.compare(input.password, board.password); //user.password - 해쉬된 비밀번호
    if (!authcheck) throw new UnauthorizedException('비밀번호가 틀렸습니다!!!');

    const { password, ...rest } = input;
    return await this.boardRepository.save({ ...board, ...rest });
  }

  async findall() {
    return await this.boardRepository.find({
      order: {
        createdDate: 'DESC',
      },
    });
  }

  async findpage({ page }) {
    return await this.boardRepository.find({
      order: {
        createdDate: 'DESC',
      },
      skip: (page - 1) * 20,
      take: 20,
    });
  }
}
