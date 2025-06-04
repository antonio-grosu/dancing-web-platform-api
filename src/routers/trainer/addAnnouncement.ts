import { Router, Response, Request, NextFunction } from "express";
import { Announcement } from "../../models/announcement.models";
import { requireRole } from "../../../common/src/middlewares/require-role";
import { Course } from "../../models/course.models";
import { Trainer } from "../../models/trainer.models";
import { sendEmail } from "../../../common/src/services/send-email";
const router = Router();

router.post(
  "/api/announcement/add/:courseId",
  requireRole(["trainer"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { content } = req.body;
    const { courseId } = req.params;
    // const currentDate = new Date();

    if (!content) {
      let error = new Error("Announcement content is required") as CustomError;
      error.status = 400;
      return next(error);
    }
    const trainerId = req.currentUser!.id;
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      let error = new Error("Trainer not found") as CustomError;
      error.status = 404;
      return next(error);
    }
    const course = await Course.findById(courseId)
      .populate("trainers")
      .populate("members");
    if (!course) {
      let error = new Error("Course not found") as CustomError;
      error.status = 404;
      return next(error);
    }

    // verificare daca trainerul manageriaza cursul
    const isTrainer = course.trainers?.some(
      (trainer) => trainer._id!.toString() === trainerId
    );
    if (!isTrainer) {
      let error = new Error(
        "Trainer does not manage this course"
      ) as CustomError;
      error.status = 403;
      return next(error);
    }

    const announcement = Announcement.build({
      content: content,
      //   date: currentDate,
      onCourse: course,
      author: trainer,
    });
    await announcement.save();

    await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: { announcements: announcement._id },
      }
    );

    if (course.members && course.members.length > 0) {
      const recipientEmails = course.members
        .filter((member) => member.email)
        .map((member) => member.email);

      await Promise.all(
        recipientEmails.map((email) =>
          sendEmail({
            to: email,
            subject: `Anunț nou la cursul ${course.name}`,
            html: `
          <h3>Bună!</h3>
          <p>A fost publicat un nou anunț de către antrenorul tău ${trainer.firstName} ${trainer.lastName}:</p>
          <blockquote>${content}</blockquote>
          <p>Ne vedem la antrenament! 💃</p>
        `,
          })
        )
      );
    }

    res.status(201).json({ created: announcement });
  }
);

export { router as addAnnouncementRouter };
