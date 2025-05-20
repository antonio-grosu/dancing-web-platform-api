"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.currentUser || !roles.includes(req.currentUser.role)) {
            const error = new Error("Access denied");
            error.status = 403;
            return next(error);
        }
        next();
    };
};
exports.requireRole = requireRole;
