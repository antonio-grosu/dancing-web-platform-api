import { Request, Response, NextFunction, Router } from "express";
import { requireRole } from "../../../common/src/middlewares/require-role";
import { Announcement } from "../../models/announcement.models";
import { Course } from "../../models/course.models";
const router = Router();

router.get(
  "/api/announcements/course/:id",
  requireRole(["user", "trainer"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const course = await Course.findById({ _id: id });

    if (!course) {
      let error = new Error("Course not found") as CustomError;
      error.status = 404;
      return next(error);
    }

    const announcements = await Announcement.find({ onCourse: id });

    res.status(200).json({ announcements });
  }
);

export { router as getAnnouncementsOnCourseRouter };
