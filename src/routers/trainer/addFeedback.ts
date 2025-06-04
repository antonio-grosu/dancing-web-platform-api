import { Router, Request, Response, NextFunction } from "express";
import { requireRole } from "../../../common/src/middlewares/require-role";
import { Trainer } from "../../models/trainer.models";
import { Feedback } from "../../models/feedback.models";
import { Course } from "../../models/course.models";
import { User } from "../../models/user.models";
import { sendEmail } from "../../../common/src/services/send-email";
const router = Router();

router.post(
  "/api/feedback/add/:courseId/:userId",
  requireRole(["trainer"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, userId } = req.params;
    if (!courseId || !userId) {
      let error = new Error(
        "Course id and user id are required"
      ) as CustomError;
      error.status = 400;
      return next(error);
    }
    const { content } = req.body;

    if (!content) {
      let error = new Error("Feedback content is required") as CustomError;
      error.status = 400;
      return next(error);
    }

    const trainerId = req.currentUser?.id;
    const trainer = await Trainer.findById(trainerId);
    const user = await User.findById(userId);
    const course = await Course.findById(courseId).populate("trainers");

    if (!trainer) {
      let error = new Error("Trainer not found") as CustomError;
      error.status = 404;
      return next(error);
    }
    if (!user) {
      let error = new Error("User not found") as CustomError;
      error.status = 404;
      return next(error);
    }
    if (!course) {
      let error = new Error("Course not found") as CustomError;
      error.status = 404;
      return next(error);
    }

    const isTrainerInCourse = course.trainers?.some(
      (trainer) => trainer._id!.toString() === trainerId
    );

    if (!isTrainerInCourse) {
      let error = new Error(
        "You are not a trainer in this course"
      ) as CustomError;
      error.status = 403;
      return next(error);
    }

    const feedback = Feedback.build({
      content,
      onCourse: course,
      belongsToUser: user,
      leftBy: trainer,
    });
    await feedback.save();

    await User.findByIdAndUpdate(
      { _id: userId },
      {
        $push: {
          receivedFeedbacks: feedback._id,
        },
      }
    );

    await Trainer.findByIdAndUpdate(
      { _id: trainerId },
      {
        $push: {
          sentFeedback: feedback._id,
        },
      }
    );

    //   await sendEmail({
    //     to: user.email,
    //     subject: `Ai primit un nou feedback la cursul ${course.name}`,
    //     html: `
    //   <p>Salut, ${user.firstName}!</p>
    //   <p>Antrenorul tău <strong>${trainer.firstName} ${trainer.lastName}</strong> ți-a lăsat un feedback la <strong>${course.name}</strong>:</p>
    //   <blockquote>${req.body.content}</blockquote>
    //   <p>Ține-o tot așa! 🕺</p>
    // `,
    //   });

    res.status(201).json({ ok: true });
  }
);

export { router as addFeedbackRouter };
