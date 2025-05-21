import { Router, Request, Response, NextFunction } from "express";
import { Administrator } from "../../models/administrator.models";
import { requireRole } from "../../../common/src/middlewares/require-role";
const router = Router();

router.get(
  "/api/administrator/getone/:id",

  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      let error = new Error(
        "Id is required in order to search for an administrator"
      ) as CustomError;
      error.status = 400;
      next(error);
    }

    const administrator = await Administrator.findById({ _id: id });
    if (!administrator) {
      let error = new Error("Administrator not found") as CustomError;
      error.status = 400;
      return next(error);
    }

    res.status(200).send(administrator);
  }
);

export { router as getOneAdministratorRouter };
