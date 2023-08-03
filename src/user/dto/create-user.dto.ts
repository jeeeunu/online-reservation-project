export class UserCreateDto {
  user_email: string;
  user_password: string;
  user_name: string;
  user_image?: string;
  is_admin?: boolean;
}
