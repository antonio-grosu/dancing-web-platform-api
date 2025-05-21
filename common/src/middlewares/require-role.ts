import { Request, Response, NextFunction } from "express";

type Role = "user" | "administrator" | "trainer";

export const requireRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser || !roles.includes(req.currentUser.role)) {
      const error = new Error("Access denied") as CustomError;
      error.status = 403;
      return next(error);
    }
    next();
  };
};
