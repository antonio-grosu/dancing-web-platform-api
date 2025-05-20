import { Request, Response, NextFunction } from "express";

export const requireRole = (
  roles: Array<"user" | "trainer" | "administrator">
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser || !roles.includes(req.currentUser.role)) {
      const error = new Error("Access denied") as CustomError;
      error.status = 403;
      return next(error);
    }
    next();
  };
};
