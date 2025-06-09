// /routers/user/createCheckout.ts
import { Router, Request, Response, NextFunction } from "express";
import { stripe } from "../../../common/src/services/stripe-config";
import { requireRole } from "../../../common/src/middlewares/require-role";
import { User } from "../../models/user.models";
import * as dotenv from "dotenv";
const router = Router();

dotenv.config();

router.post(
  "/api/user/payment/checkout/:courseId/:amount",
  requireRole(["user"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;
      const userId = req.currentUser!.id;

      const user = await User.findById(userId).populate("enrolledTo");

      const isEnrolled = user!.enrolledTo!.some(
        (c) => c._id!.toString() === courseId
      );
      if (isEnrolled) {
        const error = new Error(
          "You are already enrolled to this course!"
        ) as CustomError;
        error.status = 400;
        return next(error);
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: process.env.STRIPE_PRICE_SUBSCRIPTION,
            quantity: 1,
          },
        ],
        subscription_data: {
          metadata: {
            userId,
            courseId,
            userEmail: user!.email,
          },
        },
        success_url: `http://localhost:8080/success`,
        cancel_url: `http://localhost:8080/cancel`,
        client_reference_id: userId,
      });

      res.status(200).json({ checkoutUrl: session.url });
    } catch (err) {
      console.error("❌ Eroare la crearea sesiunii Stripe:", err);
      res.status(500).json({ message: "Eroare la checkout", error: err });
    }
  }
);

export { router as createCheckoutRouter };
