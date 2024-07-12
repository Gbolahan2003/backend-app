// @types/express.d.ts

import { Request } from 'express';
import { user, userData } from './src/interface';
import session from 'express-session';

declare module 'express-serve-static-core' {
  interface Request {
    user: userData; // Replace 'any' with your actual user type if you have one
  }
}

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}
