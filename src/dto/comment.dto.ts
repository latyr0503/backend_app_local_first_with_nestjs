import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'Excellent post !' })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  body: string;

  @ApiProperty({ example: 'uuid-du-post' })
  @IsString()
  postId: string;
}

export class UpdateCommentDto {
  @ApiProperty({ example: 'Commentaire modifié !', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  body?: string;
}
