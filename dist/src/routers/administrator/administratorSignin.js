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
exports.administratorSigninRouter = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const administrator_models_1 = require("../../models/administrator.models");
const authentication_1 = require("../../../common/src/services/authentication");
const router = (0, express_1.Router)();
exports.administratorSigninRouter = router;
router.post("/api/administrator/auth/signin", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        let error = new Error("Please fill in all the inputs");
        error.status = 400;
        return next(error);
    }
    const administrator = yield administrator_models_1.Administrator.findOne({ email });
    if (!administrator) {
        let error = new Error("Administrator not found");
        error.status = 404;
        return next(error);
    }
    const isEqual = authentication_1.authenticationService.comparePwd(administrator === null || administrator === void 0 ? void 0 : administrator.password, password);
    if (!isEqual) {
        let error = new Error("Invalid credentials");
        error.status = 401;
        return next(error);
    }
    const token = jsonwebtoken_1.default.sign({ email, id: administrator._id, role: "administrator" }, process.env.JWT_KEY);
    req.session = {
        jwt: token,
    };
    res.status(200).send(administrator);
}));
