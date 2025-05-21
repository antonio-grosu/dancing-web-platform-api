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
exports.getAllTrainersRouter = void 0;
const express_1 = require("express");
const trainer_models_1 = require("../../../models/trainer.models");
const require_role_1 = require("../../../../common/src/middlewares/require-role");
const router = (0, express_1.Router)();
exports.getAllTrainersRouter = router;
router.get("/api/trainer/getall", (0, require_role_1.requireRole)(["administrator"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const trainers = yield trainer_models_1.Trainer.find({});
    res.status(200).json(trainers);
}));
