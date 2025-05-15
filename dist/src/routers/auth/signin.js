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
exports.signinRouter = void 0;
const express_1 = require("express");
const user_models_1 = require("../../models/user.models");
const authentication_1 = require("../../../common/src/services/authentication");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
exports.signinRouter = router;
router.post("/api/auth/signin", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_models_1.User.findOne({ email });
    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        return next(error);
    }
    const isEqual = authentication_1.authenticationService.comparePwd(user === null || user === void 0 ? void 0 : user.password, password);
    if (!isEqual) {
        const error = new Error("Invalid credntials");
        error.status = 401;
        return next(error);
    }
    const token = jsonwebtoken_1.default.sign({ email, userId: user._id, role: "user" }, process.env.JWT_KEY);
    req.session = { jwt: token };
    res.status(200).send(user);
}));
