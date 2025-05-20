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
exports.getAllCoursesRouter = void 0;
const express_1 = require("express");
const course_models_1 = require("../../models/course.models");
const router = (0, express_1.Router)();
exports.getAllCoursesRouter = router;
router.get("/api/administrator/getallcourses", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield course_models_1.Course.find({});
    res.status(200).json(courses);
}));
