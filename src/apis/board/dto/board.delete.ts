import { ApiProperty } from '@nestjs/swagger';

export class BoardDelete {
  @ApiProperty({
    type: String,
    description: 'password',
    default: '',
  })
  readonly password: string;
}
