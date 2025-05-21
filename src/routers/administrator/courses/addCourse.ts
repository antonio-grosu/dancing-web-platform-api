import { Request, Response, NextFunction, Router } from "express";
import { Course } from "../../../models/course.models";
import { requireRole } from "../../../../common/src/middlewares/require-role";
const router = Router();

router.post(
  "/api/course/add",
  requireRole(["administrator"]),

  async (req: Request, res: Response, next: NextFunction) => {
    const { name, dancingStyle } = req.body;

    if (!name || !dancingStyle) {
      let error = new Error(
        "Name and dancing style are required in order to create a post/event"
      ) as CustomError;

      error.status = 400;
      return next(error);
    }

    const course = Course.build({ name, dancingStyle });
    await course.save();

    res.status(201).send(course);
  }
);

export { router as addCourseRouter };
