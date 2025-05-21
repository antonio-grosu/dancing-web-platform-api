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
exports.getOneUserRouter = void 0;
const express_1 = require("express");
const user_models_1 = require("../../models/user.models");
const require_role_1 = require("../../../common/src/middlewares/require-role");
const router = (0, express_1.Router)();
exports.getOneUserRouter = router;
router.get("/api/user/getone/:id", (0, require_role_1.requireRole)(["administrator"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        let error = new Error("Id is mandatory in order to search for a user");
        error.status = 400;
        return next(error);
    }
    const user = yield user_models_1.User.findById(id);
    if (!user) {
        let error = new Error("User not found");
        error.status = 404;
        return next(error);
    }
    res.status(200).send(user);
}));
