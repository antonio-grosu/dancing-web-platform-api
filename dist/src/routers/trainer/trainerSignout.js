"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainerSignoutRouter = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.trainerSignoutRouter = router;
router.post("/api/trainers/auth/signout", (req, res, next) => {
    req.session = null;
    res.send({});
});
