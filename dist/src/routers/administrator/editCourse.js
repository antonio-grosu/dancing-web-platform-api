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
exports.editCourseRouter = void 0;
const express_1 = require("express");
const course_models_1 = require("../../models/course.models");
const router = (0, express_1.Router)();
exports.editCourseRouter = router;
router.patch("/api/administrator/editcourse/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        let error = new Error("Course id is required");
        error.status = 400;
        return next(error);
    }
    const { name, dancingStyle, trainers, members, schedule } = req.body;
    if (!name || !dancingStyle) {
        let error = new Error("Course name, description and dancing style are required");
        error.status = 400;
        return next(error);
    }
    const course = yield course_models_1.Course.findById(id, {
        name: name,
        dancingStyle: dancingStyle,
        trainers: trainers ? trainers : [],
        members: members ? members : [],
        schedule: schedule ? schedule : [],
    }, { new: true });
    if (!course) {
        let error = new Error("Course not found");
        error.status = 404;
        return next(error);
    }
    res.status(200).json(course);
}));
