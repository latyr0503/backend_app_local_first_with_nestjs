import {
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'Mon premier post' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Sous-titre optionnel', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  subtitle?: string;

  @ApiProperty({ example: 'Contenu du post...' })
  @IsString()
  @MinLength(1)
  body: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}

export class UpdatePostDto {
  @ApiProperty({ example: 'Mon post modifié', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @ApiProperty({ example: 'Sous-titre modifié', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  subtitle?: string;

  @ApiProperty({ example: 'Contenu modifié...', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  body?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}

export class PostQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  limit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}
