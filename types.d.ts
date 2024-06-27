// @types/express.d.ts

import { Request } from 'express';
import { user, userData } from './src/interface';

declare module 'express-serve-static-core' {
  interface Request {
    user: userData; // Replace 'any' with your actual user type if you have one
  }
}
