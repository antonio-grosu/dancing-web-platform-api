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
exports.startOverdueSubscriptionCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const stripe_config_1 = require("../../../common/src/services/stripe-config");
const payment_models_1 = require("../../../src/models/payment.models");
const course_models_1 = require("../../../src/models/course.models");
const user_models_1 = require("../../../src/models/user.models");
const send_email_1 = require("../../../common/src/services/send-email");
const cutoffDate = new Date();
cutoffDate.setDate(cutoffDate.getDate() - 32);
const runUnsubscribeCron = () => __awaiter(void 0, void 0, void 0, function* () {
    const overduePayments = yield payment_models_1.Payment.find({
        status: "succeeded",
        createdAt: { $lte: cutoffDate },
    });
    for (const payment of overduePayments) {
        try {
            const subscription = yield stripe_config_1.stripe.subscriptions.retrieve(payment.stripeSubscriptionId);
            if (subscription.status === "active") {
                yield stripe_config_1.stripe.subscriptions.del(subscription.id);
                yield user_models_1.User.findByIdAndUpdate(payment.user, {
                    $pull: { enrolledTo: payment.course },
                });
                yield course_models_1.Course.findByIdAndUpdate(payment.course, {
                    $pull: { members: payment.user },
                });
                yield payment_models_1.Payment.findByIdAndUpdate(payment._id, {
                    status: "canceled",
                });
                yield (0, send_email_1.sendEmail)({
                    to: payment.userEmail,
                    subject: "Abonamentul tău a fost anulat",
                    html: `<p>Plata ta lunară pentru curs nu a fost procesată în ultimele 32 de zile, așa că subscripția a fost anulată automat.</p>`,
                });
                console.log(`✅ Subscriție anulată pentru user ${payment.user}`);
            }
        }
        catch (err) {
            console.error("❌ Eroare cron:", err);
        }
    }
    console.log("Cron Job ended");
});
//daily job
const startOverdueSubscriptionCron = () => {
    node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("🔁 CRON JOB: verifying overdue payments...");
        yield runUnsubscribeCron();
    }));
};
exports.startOverdueSubscriptionCron = startOverdueSubscriptionCron;
