declare global {
  declare module 'express' {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}
