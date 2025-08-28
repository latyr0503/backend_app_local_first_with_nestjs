import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole, Sexe } from '../entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'username123' })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '+221701234567' })
  @IsString()
  phone_number: string;

  @ApiProperty({ example: '123 Rue de la Paix, Dakar' })
  @IsString()
  adresse: string;

  @ApiProperty({ enum: Sexe, example: Sexe.HOMME })
  @IsEnum(Sexe)
  sexe: Sexe;

  @ApiProperty({ enum: UserRole, example: UserRole.AGENT, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'username123', required: false })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  username?: string;

  @ApiProperty({ example: '+221701234567', required: false })
  @IsString()
  @IsOptional()
  phone_number?: string;

  @ApiProperty({ example: '123 Rue de la Paix, Dakar', required: false })
  @IsString()
  @IsOptional()
  adresse?: string;

  @ApiProperty({ enum: Sexe, example: Sexe.HOMME, required: false })
  @IsEnum(Sexe)
  @IsOptional()
  sexe?: Sexe;

  @ApiProperty({ enum: UserRole, example: UserRole.AGENT, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
