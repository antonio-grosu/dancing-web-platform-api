import { Request, Response, NextFunction, Router } from "express";
import { Trainer } from "../../../models/trainer.models";
import { requireRole } from "../../../../common/src/middlewares/require-role";
const router = Router();

router.get(
  "/api/trainer/getall",
  requireRole(["administrator"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const trainers = await Trainer.find({});

    res.status(200).json(trainers);
  }
);

export { router as getAllTrainersRouter };
