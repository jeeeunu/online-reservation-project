import { IsString, IsOptional } from 'class-validator';
export class UserCreateDto {
  @IsString()
  readonly user_email: string;

  @IsString()
  user_password: string;

  @IsString()
  readonly user_name: string;

  @IsString()
  @IsOptional()
  readonly user_image?: string;

  @IsString()
  readonly is_admin: boolean;
}
