import { Router, Request, Response, NextFunction } from "express";
import { Trainer } from "../../../models/trainer.models";

const router = Router();

router.get(
  "/api/trainers/:id",
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
    res.status(200).json(trainer);
  }
);

export { router as getOneTrainerRouter };
