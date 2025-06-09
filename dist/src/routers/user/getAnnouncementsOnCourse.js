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
exports.getAnnouncementsOnCourseRouter = void 0;
const express_1 = require("express");
const require_role_1 = require("../../../common/src/middlewares/require-role");
const announcement_models_1 = require("../../models/announcement.models");
const course_models_1 = require("../../models/course.models");
const router = (0, express_1.Router)();
exports.getAnnouncementsOnCourseRouter = router;
router.get("/api/announcements/course/:id", (0, require_role_1.requireRole)(["user", "trainer"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const course = yield course_models_1.Course.findById({ _id: id });
    if (!course) {
        let error = new Error("Course not found");
        error.status = 404;
        return next(error);
    }
    const announcements = yield announcement_models_1.Announcement.find({ onCourse: id });
    res.status(200).json({ announcements });
}));
