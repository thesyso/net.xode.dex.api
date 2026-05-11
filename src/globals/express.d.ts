// src/types/express.d.ts
export {};

declare global {
  namespace Express {
    interface Request {
      agentAuth?: any;
      masterAuth?: any;
      memberAuth?: any;
    }
  }
}