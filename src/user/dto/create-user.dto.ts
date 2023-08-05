import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
export class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  readonly user_email: string;

  @IsNotEmpty()
  @IsString()
  user_password: string;

  @IsNotEmpty()
  @IsString()
  readonly user_name: string;

  @IsOptional()
  @IsString()
  readonly user_image?: string;

  @IsOptional()
  @IsBoolean()
  readonly is_admin: boolean;
}
