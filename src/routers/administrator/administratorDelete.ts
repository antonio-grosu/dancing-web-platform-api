import { Request, Response, NextFunction, Router } from "express";
import { Administrator } from "../../models/administrator.models";

const router = Router();

router.delete(
  "/api/administrator/delete/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const administrator = await Administrator.findById(id);
    if (!administrator) {
      let error = new Error("Administrator not found") as CustomError;
      error.status = 404;
      return next(error);
    }

    await Administrator.deleteOne({ _id: id });

    res.status(200).send({ deleted: administrator });
  }
);

export { router as deleteAdministratorRouter };
