import cron from "node-cron";
import { stripe } from "../../../common/src/services/stripe-config";
import { Payment } from "../../../src/models/payment.models";
import { Course } from "../../../src/models/course.models";
import { User } from "../../../src/models/user.models";
import { sendEmail } from "../../../common/src/services/send-email";

const cutoffDate = new Date();
cutoffDate.setDate(cutoffDate.getDate() - 32);

const runUnsubscribeCron = async () => {
  const overduePayments = await Payment.find({
    status: "succeeded",
    createdAt: { $lte: cutoffDate },
  });

  for (const payment of overduePayments) {
    try {
      const subscription = await stripe.subscriptions.retrieve(
        payment.stripeSubscriptionId
      );

      if (subscription.status === "active") {
        await stripe.subscriptions.del(subscription.id);

        await User.findByIdAndUpdate(payment.user, {
          $pull: { enrolledTo: payment.course },
        });

        await Course.findByIdAndUpdate(payment.course, {
          $pull: { members: payment.user },
        });

        await Payment.findByIdAndUpdate(payment._id, {
          status: "canceled",
        });

        await sendEmail({
          to: payment.userEmail,
          subject: "Abonamentul tău a fost anulat",
          html: `<p>Plata ta lunară pentru curs nu a fost procesată în ultimele 32 de zile, așa că subscripția a fost anulată automat.</p>`,
        });

        console.log(`✅ Subscriție anulată pentru user ${payment.user}`);
      }
    } catch (err) {
      console.error("❌ Eroare cron:", err);
    }
  }
  console.log("Cron Job ended");
};

//daily job
export const startOverdueSubscriptionCron = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("🔁 CRON JOB: verifying overdue payments...");
    await runUnsubscribeCron();
  });
};
