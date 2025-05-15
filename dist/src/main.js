"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importStar(require("express"));
const require_auth_1 = require("../common/src/middlewares/require-auth");
const require_role_1 = require("../common/src/middlewares/require-role");
const mongoose_1 = __importDefault(require("mongoose"));
const signup_1 = require("./routers/userAuth/signup");
const cookie_session_1 = __importDefault(require("cookie-session"));
const signin_1 = require("./routers/userAuth/signin");
const current_user_1 = require("./routers/userAuth/current-user");
const current_user_2 = require("../common/src/middlewares/current-user");
const signout_1 = require("./routers/userAuth/signout");
dotenv.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
    optionsSuccessStatus: 200,
}));
app.use((0, express_1.json)());
app.use((0, express_1.urlencoded)({ extended: false }));
app.set("trust proxy", true);
app.use((0, cookie_session_1.default)({
    signed: false,
    secure: false,
}));
app.use(current_user_2.currentUser);
app.use(signup_1.signupRouter);
app.use(signin_1.signinRouter);
app.use(signout_1.signoutRouter);
app.use(current_user_1.currentUserRouter);
app.get("/", require_auth_1.requireAuth, (0, require_role_1.requireRole)("administrator"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("OK");
}));
app.use((err, req, res, next) => {
    res.status(err.status).json(err.message);
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.MONGO_URI)
        throw new Error("Mongo URI is required in order to use the API");
    if (!process.env.JWT_KEY)
        throw new Error("JWT Key is required in order to use the API");
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URI);
    }
    catch (err) {
        throw new Error("MongoDB Error");
    }
    app.listen("8080", () => {
        console.log("API running on port 8080");
    });
});
start();
