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
exports.userSignupRouter = void 0;
const express_1 = require("express");
const user_models_1 = require("../../models/user.models");
const router = (0, express_1.Router)();
exports.userSignupRouter = router;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const send_email_1 = require("../../../common/src/services/send-email");
router.post("/api/user/auth/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { lastName, firstName, email, password } = req.body;
    if (!lastName || !firstName || !email || !password) {
        let error = new Error("Please fill in all the inputs");
        error.status = 400;
        return next(error);
    }
    const user = yield user_models_1.User.findOne({ email });
    if (user) {
        let error = new Error("User already exists");
        error.status = 400;
        return next(error);
    }
    const newUser = user_models_1.User.build({ firstName, lastName, email, password });
    yield newUser.save();
    req.session = {
        jwt: jsonwebtoken_1.default.sign({ email, id: newUser._id, role: "user" }, process.env.JWT_KEY),
    };
    yield (0, send_email_1.sendEmail)({
        to: newUser.email,
        subject: "Welcome to Dance Platform",
        html: `<h1>Hello ${newUser.firstName}!</h1>
             <p>Thank you for signing up on our platform. We are excited to have you with us!</p>
             <p>Best regards,</p>
             <p>The Dance Platform Team</p>`,
    });
    res.status(201).send(newUser);
}));
