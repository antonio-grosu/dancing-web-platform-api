"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhookRouter = void 0;
const express_1 = __importDefault(require("express"));
const payment_models_1 = require("../../models/payment.models");
const user_models_1 = require("../../models/user.models");
const course_models_1 = require("../../models/course.models");
const stripe_config_1 = require("../../../common/src/services/stripe-config");
const send_email_1 = require("../../../common/src/services/send-email");
const administrator_models_1 = require("../../models/administrator.models");
const router = express_1.default.Router();
exports.stripeWebhookRouter = router;
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe_config_1.stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "invoice.paid") {
        const invoice = event.data.object;
        try {
            // Recuperezi invoice-ul extins cu subscripție inclusă
            const detailedInvoice = yield stripe_config_1.stripe.invoices.retrieve(invoice.id, {
                expand: ["subscription"],
            });
            const subscription = detailedInvoice.subscription;
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
            yield payment_models_1.Payment.create({
                user: userId,
                course: courseId,
                userEmail,
                amount,
                status: "succeeded",
                stripeSubscriptionId: subscription.id,
            });
            const user = yield user_models_1.User.findByIdAndUpdate(userId, {
                $addToSet: { enrolledTo: courseId },
            });
            const course = yield course_models_1.Course.findByIdAndUpdate(courseId, {
                $addToSet: { members: userId },
            }).populate("trainers");
            const admins = yield administrator_models_1.Administrator.find();
            yield (0, send_email_1.sendEmail)({
                to: userEmail,
                subject: "Confirmare plată lunară curs",
                html: `<h1>Plată procesată</h1><p>Ai plătit ${amount} RON pentru cursul ${course === null || course === void 0 ? void 0 : course.name}.</p>`,
            });
            const recipients = [
                ...(((_a = course === null || course === void 0 ? void 0 : course.trainers) === null || _a === void 0 ? void 0 : _a.map((t) => t.email)) || []),
                ...admins.map((a) => a.email),
            ];
            yield Promise.all(recipients.map((email) => (0, send_email_1.sendEmail)({
                to: email,
                subject: `Plată nouă - ${course === null || course === void 0 ? void 0 : course.name}`,
                html: `<p><strong>${user === null || user === void 0 ? void 0 : user.firstName} ${user === null || user === void 0 ? void 0 : user.lastName}</strong> a plătit luna curentă pentru <strong>${course === null || course === void 0 ? void 0 : course.name}</strong>.</p>`,
            })));
            return res.status(200).json({ received: true });
        }
        catch (err) {
            console.error("❌ Error in invoice.paid:", err);
            return res
                .status(500)
                .json({ error: "Webhook processing failed", details: err });
        }
    }
    res.status(200).json({ received: true });
}));
