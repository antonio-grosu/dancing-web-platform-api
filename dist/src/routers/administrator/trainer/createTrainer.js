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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrainerRouter = void 0;
const express_1 = require("express");
const trainer_models_1 = require("../../../models/trainer.models");
const router = (0, express_1.Router)();
exports.createTrainerRouter = router;
router.post("/api/trainers/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, percentage } = req.body;
    if (!firstName || !lastName || !email || !password || !percentage) {
        let error = new Error("Trainer first name, last name, email, password and percentage are required");
        error.status = 400;
        return next(error);
    }
    const trainer = yield trainer_models_1.Trainer.findOne({ email });
    if (trainer) {
        let error = new Error("Trainer already exists");
        error.status = 400;
        return next(error);
    }
    const newTrainer = trainer_models_1.Trainer.build({
        firstName,
        lastName,
        email,
        password,
        percentage,
    });
    yield newTrainer.save();
    res.status(201).json({ created: newTrainer });
}));
