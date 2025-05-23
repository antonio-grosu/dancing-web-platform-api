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
exports.Feedback = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const feedbackSchema = new mongoose_1.default.Schema({
    leftBy: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Trainer",
        required: true,
    },
    date: {
        type: Date,
    },
    content: {
        type: String,
        required: true,
    },
    onCourse: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    belongsToUser: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: true,
    },
});
feedbackSchema.statics.build = (dto) => {
    return new exports.Feedback(dto);
};
feedbackSchema.pre("save", function (done) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("date") || this.isNew) {
            this.date = new Date();
        }
        done();
    });
});
exports.Feedback = mongoose_1.default.model("Feedback", feedbackSchema);
