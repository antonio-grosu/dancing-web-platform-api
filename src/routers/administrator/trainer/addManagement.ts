import { Request, Response, NextFunction, Router } from "express";
import { requireRole } from "../../../../common/src/middlewares/require-role";
import { Course } from "../../../models/course.models";
import { Trainer } from "../../../models/trainer.models";

const router = Router();

router.post(
  "/api/trainer/addmanagement/:trainerId/:courseId",
  requireRole(["administrator"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { trainerId, courseId } = req.params;

    if (!trainerId || !courseId) {
      let error = new Error(
        "Trainer id and course id are required"
      ) as CustomError;
      error.status = 400;
      return next(error);
    }

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      let error = new Error("Trainer not found") as CustomError;
      error.status = 404;
      return next(error);
    }

    const course = await Course.findById(courseId).populate("trainers");
    if (!course) {
      let error = new Error("Course not found") as CustomError;
      error.status = 404;
      return next(error);
    }

    const isAlreadyTrainer = course.trainers?.some(
      (trainer) => trainer._id!.toString() === trainerId
    );

    if (isAlreadyTrainer) {
      let error = new Error(
        "Trainer already manages this course"
      ) as CustomError;
      error.status = 400;
      return next(error);
    }

    await Course.findByIdAndUpdate(courseId, {
      $push: { trainers: trainerId },
    });

    res.status(200).json({ addedTrainer: trainerId, course: courseId });
  }
);

export { router as addManagementRouter };
