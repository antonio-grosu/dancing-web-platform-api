"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainerSignoutRouter = void 0;
const express_1 = require("express");
const require_role_1 = require("../../../common/src/middlewares/require-role");
const router = (0, express_1.Router)();
exports.trainerSignoutRouter = router;
router.post("/api/trainers/auth/signout", (0, require_role_1.requireRole)(["trainer"]), (req, res, next) => {
    req.session = null;
    res.send({});
});
