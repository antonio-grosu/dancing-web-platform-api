import { Request, Response, NextFunction } from "express";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    const error = new Error("Not authorized") as CustomError;
    error.status = 401;
    next(error);
  }
  next();
};
