import { Request, Response, NextFunction, Router } from "express";
import { Trainer } from "../../../models/trainer.models";
const router = Router();

router.get(
  "/api/trainers",
  async (req: Request, res: Response, next: NextFunction) => {
    const trainers = await Trainer.find({});

    res.status(200).json(trainers);
  }
);

export { router as getAllTrainersRouter };
