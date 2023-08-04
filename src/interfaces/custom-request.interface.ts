import { Request } from 'express';

export interface CustomRequest extends Request {
  user: {
    isAdmin: boolean;
    req_user_id: number;
  };
}
