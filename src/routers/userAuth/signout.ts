import { Request, Response, NextFunction, Router } from "express";

const router = Router();

router.post(
  "api/auth/signout",
  async (req: Request, res: Response, next: NextFunction) => {
    req.session = null;
    res.send({});
  }
);

export { router as signoutRouter };
