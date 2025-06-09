"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paymentSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    course: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true });
exports.Payment = mongoose_1.default.model("Payment", paymentSchema);
