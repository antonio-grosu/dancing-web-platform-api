import { Router, Request, Response, NextFunction } from "express";
import { Course } from "../../../models/course.models";

const router = Router();

router.patch(
  "/api/courses/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      let error = new Error("Course id is required") as CustomError;
      error.status = 400;
      return next(error);
    }
    const { name, dancingStyle, trainers, members, schedule } = req.body;

    if (!name || !dancingStyle) {
      let error = new Error(
        "Course name, description and dancing style are required"
      ) as CustomError;
      error.status = 400;
      return next(error);
    }

    const course = await Course.findById(
      id,
      {
        name: name,
        dancingStyle: dancingStyle,
        trainers: trainers ? trainers : [],
        members: members ? members : [],
        schedule: schedule ? schedule : [],
      },
      { new: true }
    );

    if (!course) {
      let error = new Error("Course not found") as CustomError;
      error.status = 404;
      return next(error);
    }
    res.status(200).json({ updated: course });
  }
);

export { router as editCourseRouter };
