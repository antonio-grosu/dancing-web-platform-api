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
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_session_1 = __importDefault(require("cookie-session"));
// routers pentru useri ( sportiv )
const userSignup_1 = require("./routers/user/userSignup");
const userSignin_1 = require("./routers/user/userSignin");
const userSignout_1 = require("./routers/user/userSignout");
const current_user_1 = require("./routers/user/current-user");
const current_user_2 = require("../common/src/middlewares/current-user");
const enrollTo_1 = require("./routers/user/enrollTo");
const getAllEnrollments_1 = require("./routers/user/getAllEnrollments");
// routers pentru administratori
const administratorSignin_1 = require("./routers/administrator/administratorSignin");
const administratorSignup_1 = require("./routers/administrator/administratorSignup");
const administratorSignout_1 = require("./routers/administrator/administratorSignout");
const administratorGetAll_1 = require("./routers/administrator/administratorGetAll");
const administratorGetOne_1 = require("./routers/administrator/administratorGetOne");
const administratorDelete_1 = require("./routers/administrator/administratorDelete");
const userGetAll_1 = require("./routers/user/userGetAll");
const userGetOne_1 = require("./routers/user/userGetOne");
const addCourse_1 = require("./routers/administrator/courses/addCourse");
const deleteCourse_1 = require("./routers/administrator/courses/deleteCourse");
const editCourse_1 = require("./routers/administrator/courses/editCourse");
const getAllCourses_1 = require("./routers/administrator/courses/getAllCourses");
const getOneCourse_1 = require("./routers/administrator/courses/getOneCourse");
const addManagement_1 = require("./routers/administrator/trainer/addManagement");
// trainer creation -> administrator required
const addTrainer_1 = require("./routers/administrator/trainer/addTrainer");
const getAllTrainers_1 = require("./routers/administrator/trainer/getAllTrainers");
const getOneTrainer_1 = require("./routers/administrator/trainer/getOneTrainer");
const deleteTrainer_1 = require("./routers/administrator/trainer/deleteTrainer");
const editTrainer_1 = require("./routers/administrator/trainer/editTrainer");
// trainer routers
const trainerSignin_1 = require("./routers/trainer/trainerSignin");
const trainerSignout_1 = require("./routers/trainer/trainerSignout");
const addAnnouncement_1 = require("./routers/trainer/addAnnouncement");
const addFeedback_1 = require("./routers/administrator/trainer/addFeedback");
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
// --- Middleware global
app.use(current_user_2.currentUser);
// --- RUTE AUTENTIFICARE PUBLICĂ ---
app.use(userSignup_1.userSignupRouter);
app.use(userSignin_1.userSigninRouter);
app.use(administratorSignup_1.administratorSignupRouter);
app.use(administratorSignin_1.administratorSigninRouter);
app.use(trainerSignin_1.trainerSigninRouter);
app.use(require_auth_1.requireAuth);
// --- RUTE UTILIZATORI (user) ---
app.use(current_user_1.currentUserRouter);
app.use(userSignout_1.userSignoutRouter);
app.use(enrollTo_1.enrollToCourseRouter);
app.use(getAllEnrollments_1.getAllEnrollmentsRouter);
// --- RUTE TRAINERI (trainer) ---
app.use(trainerSignout_1.trainerSignoutRouter);
app.use(addAnnouncement_1.addAnnouncementRouter);
app.use(addFeedback_1.addFeedbackRouter);
// --- RUTE ADMINISTRATORI (admin) ---
app.use(administratorSignout_1.administratorSignoutRouter);
app.use(administratorGetAll_1.getAllAdministratorsRouter);
app.use(administratorGetOne_1.getOneAdministratorRouter);
app.use(administratorDelete_1.deleteAdministratorRouter);
app.use(userGetAll_1.getAllUsersRouter);
app.use(userGetOne_1.getOneUserRouter);
app.use(addCourse_1.addCourseRouter);
app.use(deleteCourse_1.deleteCourseRouter);
app.use(editCourse_1.editCourseRouter);
app.use(getOneCourse_1.getOneCourseRouter);
app.use(addTrainer_1.createTrainerRouter);
app.use(getAllTrainers_1.getAllTrainersRouter);
app.use(getOneTrainer_1.getOneTrainerRouter);
app.use(deleteTrainer_1.deleteOneTrainerRouter);
app.use(editTrainer_1.editTrainerRouter);
app.use(addManagement_1.addManagementRouter);
// --- RUTE ACCES COMUN (orice rol) ---
app.use(getAllCourses_1.getAllCoursesRouter);
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
