import { Response, Request, NextFunction, Router } from "express";
import { requireRole } from "../../../common/src/middlewares/require-role";
import { Course } from "../../models/course.models";
import { User } from "../../models/user.models";
import { Feedback } from "../../models/feedback.models";
const router = Router();

router.get(
  "/api/feedback/course/:id",
  requireRole(["user"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.currentUser!.id;

    const course = await Course.findById({ _id: id });
    if (!course) {
      let error = new Error("Course not found!") as CustomError;
      error.status = 404;
      return next(error);
    }
    const user = await User.findById({ _id: userId }).populate("enrolledTo");

    const isEnrolled = user?.enrolledTo?.some(
      (enrollment) => enrollment._id!.toString() === id
    );
    if (!isEnrolled) {
      let error = new Error(
        "You are not enrolled to this course!"
      ) as CustomError;
      error.status = 400;
      return next(error);
    }

    const feedbacks = await Feedback.find({
      belongsToUser: userId,
      onCourse: id,
    });

    res.status(200).json({ feedbacks });
  }
);

export { router as getFeedbackOnCourseRouter };
