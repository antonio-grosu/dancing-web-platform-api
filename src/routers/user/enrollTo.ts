import { Router, Request, Response, NextFunction } from "express";
import { requireRole } from "../../../common/src/middlewares/require-role";
import { Course } from "../../models/course.models";
import { User } from "../../models/user.models";

const router = Router();

router.post(
  "/api/course/enrollment/:id",
  requireRole(["user"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      let error = new Error("Course id is required") as CustomError;
      error.status = 400;
      return next(error);
    }

    const course = await Course.findById(id).populate("members");

    if (!course) {
      let error = new Error("Course not found") as CustomError;
      error.status = 404;
      return next(error);
    }
    const userId = req.currentUser!.id;

    const isMember = course.members?.some(
      (member) => member._id!.toString() === userId
    );

    if (isMember) {
      let error = new Error(
        "You are already enrolled in this course"
      ) as CustomError;
      error.status = 400;
      return next(error);
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $push: {
          enrolledTo: id,
        },
      }
    );
    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: id },
      {
        $push: {
          members: userId,
        },
      }
    );

    res.status(200).json({ enrolledTo: id, user: userId });
  }
);

export { router as enrollToCourseRouter };
