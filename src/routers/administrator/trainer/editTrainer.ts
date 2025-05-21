import { Router, Request, Response, NextFunction } from "express";
import { Trainer } from "../../../models/trainer.models";
import { requireRole } from "../../../../common/src/middlewares/require-role";
const router = Router();

router.patch(
  "/api/trainer/edit/:id",
  requireRole(["administrator"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      let error = new Error("Trainer id is required") as CustomError;
      error.status = 400;
      return next(error);
    }
    const { firstName, lastName, email, percentage } = req.body;
    if (!firstName || !lastName || !email || !percentage) {
      let error = new Error(
        "Trainer name, email and percentage are required"
      ) as CustomError;
      error.status = 400;
      return next(error);
    }

    const trainer = await Trainer.findOne({ email });

    if (!trainer) {
      let error = new Error("Trainer not found") as CustomError;
      error.status = 404;
      return next(error);
    }
    const updatedTrainer = await Trainer.findByIdAndUpdate(id, {
      firstName: firstName,
      lastName: lastName,
      email: email,
      percentage: percentage,
    });

    res.status(200).json({ updated: updatedTrainer });
  }
);

export { router as editTrainerRouter };
