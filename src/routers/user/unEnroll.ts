import { Request, Response, NextFunction, Router } from "express";
import { requireRole } from "../../../common/src/middlewares/require-role";
import { User } from "../../models/user.models";
import { Course } from "../../models/course.models";
import { sendEmail } from "../../../common/src/services/send-email";
import { Payment } from "../../models/payment.models";
import { stripe } from "../../../common/src/services/stripe-config";
const router = Router();

router.post(
  "/api/course/unenrollment/:id",
  requireRole(["user"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.currentUser!.id;

    const user = await User.findById({ _id: userId }).populate("enrolledTo");

    const isEnrolled = user?.enrolledTo?.some(
      (enrollment) => enrollment._id!.toString() === id
    );

    if (!isEnrolled) {
      let error = new Error(
        "You are not enrolled to this course"
      ) as CustomError;

      error.status = 400;
      return next(error);
    }

    const course = await Course.findById({ _id: id });
    if (!course) {
      let error = new Error("Course not found!") as CustomError;
      error.status = 404;
      return next(error);
    }

    const activePayment = await Payment.findOne({
      user: userId,
      course: id,
      status: "succeeded",
    });

    if (activePayment?.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.del(activePayment.stripeSubscriptionId);
        console.log(
          "✅ Subscription anulată:",
          activePayment.stripeSubscriptionId
        );

        await Payment.findByIdAndUpdate(activePayment._id, {
          status: "canceled",
        });
      } catch (err) {
        console.error("❌ Eroare la ștergerea subscripției:", err);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $pull: {
          enrolledTo: id,
        },
        new: true,
      }
    );
    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: id },
      {
        $pull: {
          members: userId,
        },
        new: true,
      }
    );

    // Momentan feedbackurile userului in cadrul acestui curs nu se sterg

    await sendEmail({
      to: user!.email,
      subject: `Ai renuntat la ${course!.name}`,
      html: `
          <p>Salut, ${user!.firstName}!</p>
          <p>Din pacate, acesta este mail-ul de confirmare a renuntarii la cursul ${
            course!.name
          }.</p>
          <p>🕺</p>
        `,
    });
    res.status(201).send({
      unEnrollment: true,
      courseId: id,
    });
  }
);

export { router as unEnrollmentRouter };
