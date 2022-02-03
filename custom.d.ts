import { CurrentUser } from './src/app/security/types/security.types';

declare global{
  namespace Express {
    interface Request {
      user: CurrentUser;
    }
  }
}
