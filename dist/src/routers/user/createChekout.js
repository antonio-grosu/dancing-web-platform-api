"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutRouter = void 0;
// /routers/user/createCheckout.ts
const express_1 = require("express");
const stripe_config_1 = require("../../../common/src/services/stripe-config");
const require_role_1 = require("../../../common/src/middlewares/require-role");
const user_models_1 = require("../../models/user.models");
const dotenv = __importStar(require("dotenv"));
const router = (0, express_1.Router)();
exports.createCheckoutRouter = router;
dotenv.config();
router.post("/api/user/payment/checkout/:courseId/:amount", (0, require_role_1.requireRole)(["user"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const userId = req.currentUser.id;
        const user = yield user_models_1.User.findById(userId).populate("enrolledTo");
        const isEnrolled = user.enrolledTo.some((c) => c._id.toString() === courseId);
        if (isEnrolled) {
            const error = new Error("You are already enrolled to this course!");
            error.status = 400;
            return next(error);
        }
        const session = yield stripe_config_1.stripe.checkout.sessions.create({
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
                    userEmail: user.email,
                },
            },
            success_url: `http://localhost:8080/success`,
            cancel_url: `http://localhost:8080/cancel`,
            client_reference_id: userId,
        });
        res.status(200).json({ checkoutUrl: session.url });
    }
    catch (err) {
        console.error("❌ Eroare la crearea sesiunii Stripe:", err);
        res.status(500).json({ message: "Eroare la checkout", error: err });
    }
}));
