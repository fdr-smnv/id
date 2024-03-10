import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterUserRequestDto {
  @IsEmail()
  @IsString()
  @IsOptional()
  email: string | null;

  @IsString()
  @IsOptional()
  phone: string | null;

  @MinLength(8)
  @IsString()
  password: string;
}

export class RegisterUserResponseDto {
  accessToken: string;
}
