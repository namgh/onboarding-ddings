import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BoardService } from './board.service';
import { BoardInput } from './dto/board.input';

@Controller('board')
@ApiTags('board')
export class BoardCotroller {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  async create(@Body() input: BoardInput) {
    await this.boardService.check({ input });
    return await this.boardService.create({ input });
  }
}
