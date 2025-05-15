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
exports.administratorSignupRouter = void 0;
const express_1 = require("express");
const administrator_models_1 = require("../../models/administrator.models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
exports.administratorSignupRouter = router;
router.post("/api/administrator/auth/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        let error = new Error("Please fill in all the inputs");
        error.status = 400;
        return next(error);
    }
    const administrator = yield administrator_models_1.Administrator.findOne({ email });
    if (administrator) {
        let error = new Error("Administrator already exists");
        error.status = 400;
        return next(error);
    }
    const newAdministrator = yield administrator_models_1.Administrator.build({
        firstName,
        lastName,
        email,
        password,
    });
    yield newAdministrator.save();
    req.session = {
        jwt: jsonwebtoken_1.default.sign({ email, id: newAdministrator._id, role: "administrator" }, process.env.JWT_KEY),
    };
    res.status(201).send(newAdministrator);
}));
