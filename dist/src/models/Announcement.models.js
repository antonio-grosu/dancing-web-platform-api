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
        ref: "Trainer",
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        // required: true,
    },
    onCourse: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "Course",
    },
});
announcementSchema.statics.build = (dto) => {
    return new exports.Announcement(dto);
};
announcementSchema.pre("save", function (done) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("date") || this.isNew) {
            this.date = new Date();
        }
        done();
    });
});
exports.Announcement = mongoose_1.default.model("Announcement", announcementSchema);
