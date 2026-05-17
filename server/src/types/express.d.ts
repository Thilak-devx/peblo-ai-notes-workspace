declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: {
        _id: unknown;
        name: string;
        email: string;
        createdAt?: Date;
        updatedAt?: Date;
      };
    }
  }
}

export {};
