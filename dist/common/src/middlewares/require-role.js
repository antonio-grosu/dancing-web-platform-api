"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.currentUser || req.currentUser.role !== role) {
            const error = new Error("Access denied");
            error.status = 403;
            return next(error);
        }
        next();
    };
};
exports.requireRole = requireRole;
