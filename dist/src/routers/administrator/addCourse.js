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
exports.addCourseRouter = void 0;
const express_1 = require("express");
const course_models_1 = require("../../models/course.models");
const router = (0, express_1.Router)();
exports.addCourseRouter = router;
router.post("/api/administrator/addcourse", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, dancingStyle } = req.body;
    if (!name || !dancingStyle) {
        let error = new Error("Name and dancing style are required in order to create a post/event");
        error.status = 400;
        return next(error);
    }
    const course = course_models_1.Course.build({ name, dancingStyle });
    yield course.save();
    res.status(201).send(course);
}));
