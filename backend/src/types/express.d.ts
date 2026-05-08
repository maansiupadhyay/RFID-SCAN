import { TokenPayload } from '../utils/tokenUtils';

declare global {
  namespace Express {
    interface User extends TokenPayload {
      id?: number;
      name?: string;
    }
  }
}

export {};
