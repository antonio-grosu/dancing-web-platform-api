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
exports.getAllEnrollmentsRouter = void 0;
const express_1 = require("express");
const require_role_1 = require("../../../common/src/middlewares/require-role");
const user_models_1 = require("../../models/user.models");
const router = (0, express_1.Router)();
exports.getAllEnrollmentsRouter = router;
router.get("/api/user/enrollment/getall", (0, require_role_1.requireRole)(["user"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.currentUser.id;
    const user = yield user_models_1.User.findById(userId).populate("enrolledTo");
    if (!user) {
        let error = new Error("User not found");
        error.status = 404;
        return next(error);
    }
    const enrolledTo = user.enrolledTo;
    res.status(200).json({ enrolledTo });
}));
