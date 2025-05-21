import { Request, Response, NextFunction, Router } from "express";
import { Trainer } from "../../../models/trainer.models";
import { requireRole } from "../../../../common/src/middlewares/require-role";
const router = Router();

router.delete(
  "/api/trainer/delete/:id",
  requireRole(["administrator"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      let error = new Error("Trainer id is required") as CustomError;
      error.status = 400;
      return next(error);
    }

    const trainer = await Trainer.findById(id);
    if (!trainer) {
      let error = new Error("Trainer not found") as CustomError;
      error.status = 404;
      return next(error);
    }

    await Trainer.findByIdAndDelete(id);
    res.status(200).json({ deleted: trainer });
  }
);

export { router as deleteOneTrainerRouter };
