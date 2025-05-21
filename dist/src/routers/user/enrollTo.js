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
exports.enrollToCourseRouter = void 0;
const express_1 = require("express");
const require_role_1 = require("../../../common/src/middlewares/require-role");
const course_models_1 = require("../../models/course.models");
const user_models_1 = require("../../models/user.models");
const router = (0, express_1.Router)();
exports.enrollToCourseRouter = router;
router.post("/api/course/enrollment/:id", (0, require_role_1.requireRole)(["user"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    if (!id) {
        let error = new Error("Course id is required");
        error.status = 400;
        return next(error);
    }
    const course = yield course_models_1.Course.findById(id).populate("members");
    if (!course) {
        let error = new Error("Course not found");
        error.status = 404;
        return next(error);
    }
    const userId = req.currentUser.id;
    const isMember = (_a = course.members) === null || _a === void 0 ? void 0 : _a.some((member) => member._id.toString() === userId);
    if (isMember) {
        let error = new Error("You are already enrolled in this course");
        error.status = 400;
        return next(error);
    }
    const updatedUser = yield user_models_1.User.findByIdAndUpdate({ _id: userId }, {
        $push: {
            enrolledTo: id,
        },
    });
    const updatedCourse = yield course_models_1.Course.findByIdAndUpdate({ _id: id }, {
        $push: {
            members: userId,
        },
    });
    res.status(200).json({ enrolledTo: id, user: userId });
}));
