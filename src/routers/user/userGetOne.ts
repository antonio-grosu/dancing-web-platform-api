import { Request, Response, NextFunction, Router } from "express";
import { User } from "../../models/user.models";
import { requireRole } from "../../../common/src/middlewares/require-role";
const router = Router();

router.get(
  "/api/user/getone/:id",
  requireRole(["administrator"]),

  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      let error = new Error(
        "Id is mandatory in order to search for a user"
      ) as CustomError;
      error.status = 400;

      return next(error);
    }

    const user = await User.findById(id);
    if (!user) {
      let error = new Error("User not found") as CustomError;
      error.status = 404;
      return next(error);
    }

    res.status(200).send(user);
  }
);

export { router as getOneUserRouter };
