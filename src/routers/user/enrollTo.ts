import { Router, Request, Response, NextFunction } from "express";
import { requireRole } from "../../../common/src/middlewares/require-role";
import { Course } from "../../models/course.models";
import { User } from "../../models/user.models";
import { sendEmail } from "../../../common/src/services/send-email";
import { Administrator } from "../../models/administrator.models";
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

    const admins = await Administrator.find({});
    const course = await Course.findById(id)
      .populate("members")
      .populate("trainers");

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
    await sendEmail({
      to: updatedUser!.email,
      subject: "Confirmare Inscriere",
      html: `<h1>Inscriere cu succes</h1>
             <p>Te-ai inscris cu succes la cursul : ${updatedCourse!.name}.</p>
             <p>Multumim!</p>`,
    });

    const recipients = [
      ...course.trainers!.map((trainer) => trainer.email),
      ...admins.map((admin) => admin.email),
    ];

    await Promise.all(
      recipients.map((email) =>
        sendEmail({
          to: email,
          subject: `Un nou sportiv s-a înscris la ${course.name}`,
          html: `
        <p><strong>${updatedUser!.firstName} ${
            updatedUser!.lastName
          }</strong> s-a înscris la cursul <strong>${course.name}</strong>.</p>
        <p>Poți vedea detalii în platformă.</p>
      `,
        })
      )
    );
    res.status(200).json({ enrolledTo: id, user: userId });
  }
);

export { router as enrollToCourseRouter };
