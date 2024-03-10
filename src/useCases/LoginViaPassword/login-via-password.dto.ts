import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginViaPasswordRequestDto {
  @IsEmail()
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @MinLength(8)
  @IsString()
  password: string;
}

export class LoginViaPasswordResponseDto {
  accessToken: string;
}
