"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trainer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const trainerSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    manages: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Course",
    },
    sentFeedback: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Feedback",
    },
});
exports.Trainer = mongoose_1.default.model("Trainer", trainerSchema);
