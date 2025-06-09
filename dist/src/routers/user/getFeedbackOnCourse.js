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
exports.getFeedbackOnCourseRouter = void 0;
const express_1 = require("express");
const require_role_1 = require("../../../common/src/middlewares/require-role");
const course_models_1 = require("../../models/course.models");
const user_models_1 = require("../../models/user.models");
const feedback_models_1 = require("../../models/feedback.models");
const router = (0, express_1.Router)();
exports.getFeedbackOnCourseRouter = router;
router.get("/api/feedback/course/:id", (0, require_role_1.requireRole)(["user"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = req.currentUser.id;
    const course = yield course_models_1.Course.findById({ _id: id });
    if (!course) {
        let error = new Error("Course not found!");
        error.status = 404;
        return next(error);
    }
    const user = yield user_models_1.User.findById({ _id: userId }).populate("enrolledTo");
    const isEnrolled = (_a = user === null || user === void 0 ? void 0 : user.enrolledTo) === null || _a === void 0 ? void 0 : _a.some((enrollment) => enrollment._id.toString() === id);
    if (!isEnrolled) {
        let error = new Error("You are not enrolled to this course!");
        error.status = 400;
        return next(error);
    }
    const feedbacks = yield feedback_models_1.Feedback.find({
        belongsToUser: userId,
        onCourse: id,
    });
    res.status(200).json({ feedbacks });
}));
