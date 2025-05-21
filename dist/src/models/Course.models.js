"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const courseSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    dancingStyle: {
        type: String,
        required: true,
    },
    trainers: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: "Trainer",
    },
    members: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: "User",
    },
    announcements: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: "Announcement",
    },
    schedule: {
        type: [String],
    },
});
courseSchema.statics.build = (dto) => {
    return new exports.Course(dto);
};
exports.Course = mongoose_1.default.model("Course", courseSchema);
