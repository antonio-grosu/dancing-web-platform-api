import { Router, Request, Response, NextFunction } from "express";
import { currentUser } from "../../../common/src/middlewares/current-user";

const router = Router();

router.get(
  "/api/auth/current-user",
  currentUser,
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ currentUser: req.currentUser });
  }
);

export { router as currentUserRouter };
