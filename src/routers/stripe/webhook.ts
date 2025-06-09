import express, { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import { Payment } from "../../models/payment.models";
import { User } from "../../models/user.models";
import { Course } from "../../models/course.models";
import { stripe } from "../../../common/src/services/stripe-config";
import { sendEmail } from "../../../common/src/services/send-email";
import { Administrator } from "../../models/administrator.models";
const router = express.Router();

router.post("/", async (req: Request, res: any, next: NextFunction) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;

    try {
      // Recuperezi invoice-ul extins cu subscripție inclusă
      const detailedInvoice = await stripe.invoices.retrieve(invoice.id, {
        expand: ["subscription"],
      });

      const subscription = detailedInvoice.subscription as Stripe.Subscription;

      if (!subscription) {
        console.warn("⚠️ Invoice nu are subscription asociat:", invoice.id);
        return res.status(200).json({ ignored: true });
      }

      const { userId, courseId, userEmail } = subscription.metadata || {};

      if (!userId || !courseId || !userEmail) {
        console.warn("Missing metadata in subscription:", subscription.id);
        return res.status(200).json({ ignored: true });
      }

      const amount = invoice.amount_paid / 100;

      await Payment.create({
        user: userId,
        course: courseId,
        userEmail,
        amount,
        status: "succeeded",
        stripeSubscriptionId: subscription.id as string,
      });

      const user = await User.findByIdAndUpdate(userId, {
        $addToSet: { enrolledTo: courseId },
      });

      const course = await Course.findByIdAndUpdate(courseId, {
        $addToSet: { members: userId },
      }).populate("trainers");

      const admins = await Administrator.find();

      await sendEmail({
        to: userEmail,
        subject: "Confirmare plată lunară curs",
        html: `<h1>Plată procesată</h1><p>Ai plătit ${amount} RON pentru cursul ${course?.name}.</p>`,
      });

      const recipients = [
        ...(course?.trainers?.map((t: any) => t.email) || []),
        ...admins.map((a: any) => a.email),
      ];

      await Promise.all(
        recipients.map((email) =>
          sendEmail({
            to: email,
            subject: `Plată nouă - ${course?.name}`,
            html: `<p><strong>${user?.firstName} ${user?.lastName}</strong> a plătit luna curentă pentru <strong>${course?.name}</strong>.</p>`,
          })
        )
      );

      return res.status(200).json({ received: true });
    } catch (err) {
      console.error("❌ Error in invoice.paid:", err);
      return res
        .status(500)
        .json({ error: "Webhook processing failed", details: err });
    }
  }

  res.status(200).json({ received: true });
});

export { router as stripeWebhookRouter };
