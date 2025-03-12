import 'express-session';

declare module 'express-serve-static-core' {
  interface Request {
    session?: Express.Session; // mark optional if not always present
    user?: any; // Replace `any` with your actual user type if you have one
  }
}
