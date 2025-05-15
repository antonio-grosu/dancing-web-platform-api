import { Request, Response, NextFunction } from "express";

export const requireRole = (role: "user" | "trainer" | "administrator") => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser || req.currentUser.role !== role) {
      const error = new Error("Access denied") as CustomError;
      error.status = 403;
      return next(error);
    }
    next();
  };
};
