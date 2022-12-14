import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BoardService } from './board.service';
import { BoardDelete } from './dto/board.delete';
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

  @Delete(':id')
  async delete(@Body() input: BoardDelete, @Param('id') id: string) {
    return await this.boardService.delete({ id, input });
  }

  @Put(':id')
  async update(@Body() input: BoardInput, @Param('id') id: string) {
    return await this.boardService.update({ id, input });
  }

  @Get()
  async findall() {
    return await this.boardService.findall();
  }

  @Get('/:page')
  async findpage(@Param('page') page: number) {
    return await this.boardService.findpage({ page });
  }
}
