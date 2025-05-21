import { Router, Request, Response, NextFunction } from "express";
import { Course } from "../../../models/course.models";
import { requireRole } from "../../../../common/src/middlewares/require-role";
const router = Router();

router.get(
  "/api/course/getall",
  requireRole(["administrator", "trainer", "user"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const courses = await Course.find({});
    res.status(200).json(courses);
  }
);

export { router as getAllCoursesRouter };
