import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "ron" },
    stripeSubscriptionId: { type: String, required: true },
    status: {
      type: String,
      enum: ["succeeded", "failed", "pending"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
