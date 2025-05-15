import { Request, Response, NextFunction, Router } from "express";
import { User } from "../../models/user.models";

const router = Router();

router.get(
  "/api/user/getall",
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({});

    res.status(200).send(users);
  }
);

export { router as getAllUsersRouter };
