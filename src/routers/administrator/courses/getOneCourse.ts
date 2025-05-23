import { Request, Response, NextFunction, Router } from "express";
import { Course } from "../../../models/course.models";
import { requireRole } from "../../../../common/src/middlewares/require-role";
const router = Router();

router.get(
  "/api/course/getone/:id",
  requireRole(["administrator"]),

  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      let error = new Error("Course id is required") as CustomError;
      error.status = 400;
      return next(error);
    }

    const course = await Course.findById(id);
    if (!course) {
      let error = new Error("Course not found") as CustomError;
      error.status = 404;
      return next(error);
    }
    res.status(200).json(course);
  }
);
export { router as getOneCourseRouter };
