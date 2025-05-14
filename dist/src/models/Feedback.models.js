"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const feedbackSchema = new mongoose_1.default.Schema({
    leftBy: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    onCourse: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    belongsToUser: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
});
exports.Feedback = mongoose_1.default.model("Feedback", feedbackSchema);
