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
exports.addAnnouncementRouter = void 0;
const express_1 = require("express");
const announcement_models_1 = require("../../models/announcement.models");
const require_role_1 = require("../../../common/src/middlewares/require-role");
const course_models_1 = require("../../models/course.models");
const trainer_models_1 = require("../../models/trainer.models");
const router = (0, express_1.Router)();
exports.addAnnouncementRouter = router;
router.post("/api/announcement/add/:courseId", (0, require_role_1.requireRole)(["trainer"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { content } = req.body;
    const { courseId } = req.params;
    // const currentDate = new Date();
    if (!content) {
        let error = new Error("Announcement content is required");
        error.status = 400;
        return next(error);
    }
    const trainerId = req.currentUser.id;
    const trainer = yield trainer_models_1.Trainer.findById(trainerId);
    if (!trainer) {
        let error = new Error("Trainer not found");
        error.status = 404;
        return next(error);
    }
    const course = yield course_models_1.Course.findById(courseId).populate("trainers");
    if (!course) {
        let error = new Error("Course not found");
        error.status = 404;
        return next(error);
    }
    // verificare daca trainerul manageriaza cursul
    const isTrainer = (_a = course.trainers) === null || _a === void 0 ? void 0 : _a.some((trainer) => trainer._id.toString() === trainerId);
    if (!isTrainer) {
        let error = new Error("Trainer does not manage this course");
        error.status = 403;
        return next(error);
    }
    const announcement = announcement_models_1.Announcement.build({
        content: content,
        //   date: currentDate,
        onCourse: course,
        author: trainer,
    });
    yield announcement.save();
    yield course_models_1.Course.findByIdAndUpdate({ _id: courseId }, {
        $push: { announcements: announcement._id },
    });
    res.status(201).json({ created: announcement });
}));
