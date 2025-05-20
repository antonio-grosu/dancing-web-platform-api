import { Router, Request, Response, NextFunction } from "express";
import { Course } from "../../../models/course.models";
const router = Router();

router.get(
  "/api/courses",
  async (req: Request, res: Response, next: NextFunction) => {
    const courses = await Course.find({});
    res.status(200).json(courses);
  }
);

export { router as getAllCoursesRouter };
