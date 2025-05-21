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
exports.addFeedbackRouter = void 0;
const express_1 = require("express");
const require_role_1 = require("../../../../common/src/middlewares/require-role");
const trainer_models_1 = require("../../../models/trainer.models");
const feedback_models_1 = require("../../../models/feedback.models");
const course_models_1 = require("../../../models/course.models");
const user_models_1 = require("../../../models/user.models");
const router = (0, express_1.Router)();
exports.addFeedbackRouter = router;
router.post("/api/feedback/add/:courseId/:userId", (0, require_role_1.requireRole)(["trainer"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { courseId, userId } = req.params;
    if (!courseId || !userId) {
        let error = new Error("Course id and user id are required");
        error.status = 400;
        return next(error);
    }
    const { content } = req.body;
    if (!content) {
        let error = new Error("Feedback content is required");
        error.status = 400;
        return next(error);
    }
    const trainerId = (_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.id;
    const trainer = yield trainer_models_1.Trainer.findById(trainerId);
    const user = yield user_models_1.User.findById(userId);
    const course = yield course_models_1.Course.findById(courseId).populate("trainers");
    if (!trainer) {
        let error = new Error("Trainer not found");
        error.status = 404;
        return next(error);
    }
    if (!user) {
        let error = new Error("User not found");
        error.status = 404;
        return next(error);
    }
    if (!course) {
        let error = new Error("Course not found");
        error.status = 404;
        return next(error);
    }
    const isTrainerInCourse = (_b = course.trainers) === null || _b === void 0 ? void 0 : _b.some((trainer) => trainer._id.toString() === trainerId);
    if (!isTrainerInCourse) {
        let error = new Error("You are not a trainer in this course");
        error.status = 403;
        return next(error);
    }
    const feedback = feedback_models_1.Feedback.build({
        content,
        onCourse: course,
        belongsToUser: user,
        leftBy: trainer,
    });
    yield feedback.save();
    yield user_models_1.User.findByIdAndUpdate(userId, {
        $push: {
            receivedFeedbacks: feedback._id,
        },
    });
    yield trainer_models_1.Trainer.findByIdAndUpdate(trainerId, {
        $push: {
            sentFeedback: feedback._id,
        },
    });
    res.status(201).json({ feedback });
}));
