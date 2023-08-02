import { Request } from 'express';

export interface CustomRequest extends Request {
  user: {
    isAdmin: boolean;
    user_id: number;
  };
}
