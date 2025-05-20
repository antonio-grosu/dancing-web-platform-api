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
exports.trainerSigninRouter = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const trainer_models_1 = require("../../models/trainer.models");
const authentication_1 = require("../../../common/src/services/authentication");
const router = (0, express_1.Router)();
exports.trainerSigninRouter = router;
router.post("/api/trainers/auth/signin", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        let error = new Error("Email and password are required");
        error.status = 400;
        return next(error);
    }
    const trainer = yield trainer_models_1.Trainer.findOne({ email });
    if (!trainer) {
        let error = new Error("Trainer not found");
        error.status = 404;
        return next(error);
    }
    const isEqual = authentication_1.authenticationService.comparePwd(trainer === null || trainer === void 0 ? void 0 : trainer.password, password);
    if (!isEqual) {
        let error = new Error("Invalid credentials");
        error.status = 401;
        return next(error);
    }
    const token = jsonwebtoken_1.default.sign({ email, id: trainer._id, role: "trainer" }, process.env.JWT_KEY);
    req.session = { jwt: token };
    res.status(200).send(trainer);
}));
