"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Announcement = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const announcementSchema = new mongoose_1.default.Schema({
    author: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    belongsTo: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
});
exports.Announcement = mongoose_1.default.model("Announcement", announcementSchema);
