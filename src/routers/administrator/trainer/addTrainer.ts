import { Router, Request, Response, NextFunction } from "express";
import { Trainer } from "../../../models/trainer.models";
import { requireRole } from "../../../../common/src/middlewares/require-role";
const router = Router();

router.post(
  "/api/trainer/add",
  requireRole(["administrator"]),

  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, percentage } = req.body;

    if (!firstName || !lastName || !email || !password || !percentage) {
      let error = new Error(
        "Trainer first name, last name, email, password and percentage are required"
      ) as CustomError;
      error.status = 400;
      return next(error);
    }

    const trainer = await Trainer.findOne({ email });
    if (trainer) {
      let error = new Error("Trainer already exists") as CustomError;
      error.status = 400;
      return next(error);
    }

    const newTrainer = Trainer.build({
      firstName,
      lastName,
      email,
      password,
      percentage,
    });

    await newTrainer.save();

    res.status(201).json({ created: newTrainer });
  }
);

export { router as createTrainerRouter };
