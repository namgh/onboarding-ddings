import { ApiProperty } from '@nestjs/swagger';

export class BoardInput {
  @ApiProperty({
    type: String,
    description: 'password',
    default: '',
  })
  readonly password: string;

  @ApiProperty({
    type: String,
    description: 'title',
    default: '',
  })
  readonly title: string;

  @ApiProperty({
    type: String,
    description: 'content',
    default: '',
  })
  readonly content: string;
}
