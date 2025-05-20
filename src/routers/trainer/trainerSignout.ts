import { Response, Request, NextFunction, Router } from "express";

const router = Router();

router.post(
  "/api/trainers/auth/signout",
  (req: Request, res: Response, next: NextFunction) => {
    req.session = null;
    res.send({});
  }
);

export { router as trainerSignoutRouter };
