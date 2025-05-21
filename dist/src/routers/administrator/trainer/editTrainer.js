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
exports.editTrainerRouter = void 0;
const express_1 = require("express");
const trainer_models_1 = require("../../../models/trainer.models");
const require_role_1 = require("../../../../common/src/middlewares/require-role");
const router = (0, express_1.Router)();
exports.editTrainerRouter = router;
router.patch("/api/trainer/edit/:id", (0, require_role_1.requireRole)(["administrator"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        let error = new Error("Trainer id is required");
        error.status = 400;
        return next(error);
    }
    const { firstName, lastName, email, percentage } = req.body;
    if (!firstName || !lastName || !email || !percentage) {
        let error = new Error("Trainer name, email and percentage are required");
        error.status = 400;
        return next(error);
    }
    const trainer = yield trainer_models_1.Trainer.findOne({ email });
    if (!trainer) {
        let error = new Error("Trainer not found");
        error.status = 404;
        return next(error);
    }
    const updatedTrainer = yield trainer_models_1.Trainer.findByIdAndUpdate(id, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        percentage: percentage,
    });
    res.status(200).json({ updated: updatedTrainer });
}));
