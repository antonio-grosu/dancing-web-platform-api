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
exports.Trainer = void 0;
const authentication_1 = require("../../common/src/services/authentication");
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
    percentage: {
        type: Number,
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
trainerSchema.pre("save", function (done) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password") || this.isNew) {
            const hashedPwd = yield authentication_1.authenticationService.pwdToHash(this.get("password"));
            this.set("password", hashedPwd);
        }
        done();
    });
});
trainerSchema.statics.build = (dto) => {
    return new exports.Trainer(dto);
};
exports.Trainer = mongoose_1.default.model("Trainer", trainerSchema);
