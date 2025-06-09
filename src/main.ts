import * as dotenv from "dotenv";
import cors from "cors";
import express, {
  json,
  NextFunction,
  urlencoded,
  Request,
  Response,
} from "express";
import { requireAuth } from "../common/src/middlewares/require-auth";
import { requireRole } from "../common/src/middlewares/require-role";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import nodemailer from "nodemailer";
import { startOverdueSubscriptionCron } from "../common/src/services/checkOverDueSubscriptions";
// stripe webhook router
import { stripeWebhookRouter } from "./routers/stripe/webhook";
// routers pentru useri ( sportiv )

import { userSignupRouter } from "./routers/user/userSignup";
import { userSigninRouter } from "./routers/user/userSignin";
import { userSignoutRouter } from "./routers/user/userSignout";
import { currentUserRouter } from "./routers/user/current-user";
import { currentUser } from "../common/src/middlewares/current-user";
import { enrollToCourseRouter } from "./routers/user/enrollTo";
import { unEnrollmentRouter } from "./routers/user/unEnroll";
import { getAllEnrollmentsRouter } from "./routers/user/getAllEnrollments";
import { getFeedbackOnCourseRouter } from "./routers/user/getFeedbackOnCourse";
import { getAllFeedbackRouter } from "./routers/user/getAllFeedback";
import { getAnnouncementsOnCourseRouter } from "./routers/user/getAnnouncementsOnCourse";
import { createCheckoutRouter } from "./routers/user/createChekout";

// routers pentru administratori
import { administratorSigninRouter } from "./routers/administrator/administratorSignin";
import { administratorSignupRouter } from "./routers/administrator/administratorSignup";
import { administratorSignoutRouter } from "./routers/administrator/administratorSignout";
import { getAllAdministratorsRouter } from "./routers/administrator/administratorGetAll";
import { getOneAdministratorRouter } from "./routers/administrator/administratorGetOne";
import { deleteAdministratorRouter } from "./routers/administrator/administratorDelete";
import { getAllUsersRouter } from "./routers/user/userGetAll";
import { getOneUserRouter } from "./routers/user/userGetOne";
import { addCourseRouter } from "./routers/administrator/courses/addCourse";
import { deleteCourseRouter } from "./routers/administrator/courses/deleteCourse";
import { editCourseRouter } from "./routers/administrator/courses/editCourse";
import { getAllCoursesRouter } from "./routers/administrator/courses/getAllCourses";
import { getOneCourseRouter } from "./routers/administrator/courses/getOneCourse";
import { addManagementRouter } from "./routers/administrator/trainer/addManagement";
// trainer creation -> administrator required

import { createTrainerRouter } from "./routers/administrator/trainer/addTrainer";
import { getAllTrainersRouter } from "./routers/administrator/trainer/getAllTrainers";
import { getOneTrainerRouter } from "./routers/administrator/trainer/getOneTrainer";
import { deleteOneTrainerRouter } from "./routers/administrator/trainer/deleteTrainer";
import { editTrainerRouter } from "./routers/administrator/trainer/editTrainer";

// trainer routers

import { trainerSigninRouter } from "./routers/trainer/trainerSignin";
import { trainerSignoutRouter } from "./routers/trainer/trainerSignout";
import { addAnnouncementRouter } from "./routers/trainer/addAnnouncement";
import { addFeedbackRouter } from "./routers/trainer/addFeedback";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);
app.use(urlencoded({ extended: false }));

app.set("trust proxy", true);

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookRouter
);
app.use(json());

declare global {
  interface CustomError extends Error {
    status: number;
  }
}
// --- Middleware global
app.use(currentUser);

// --- RUTE AUTENTIFICARE PUBLICĂ ---
app.use(userSignupRouter);
app.use(userSigninRouter);
app.use(administratorSignupRouter);
app.use(administratorSigninRouter);
app.use(trainerSigninRouter);

app.use(requireAuth);
// --- RUTE UTILIZATORI (user) ---
app.use(currentUserRouter);
app.use(userSignoutRouter);
// enroll ul vechi
app.use(enrollToCourseRouter);
//create checkout
app.use(createCheckoutRouter);
app.use(unEnrollmentRouter);
app.use(getAllEnrollmentsRouter);
app.use(getFeedbackOnCourseRouter);
app.use(getAllFeedbackRouter);
app.use(getAnnouncementsOnCourseRouter);
// --- RUTE TRAINERI (trainer) ---
app.use(trainerSignoutRouter);
app.use(addAnnouncementRouter);
app.use(addFeedbackRouter);

// --- RUTE ADMINISTRATORI (admin) ---
app.use(administratorSignoutRouter);
app.use(getAllAdministratorsRouter);
app.use(getOneAdministratorRouter);
app.use(deleteAdministratorRouter);
app.use(getAllUsersRouter);
app.use(getOneUserRouter);
app.use(addCourseRouter);
app.use(deleteCourseRouter);
app.use(editCourseRouter);
app.use(getOneCourseRouter);
app.use(createTrainerRouter);
app.use(getAllTrainersRouter);
app.use(getOneTrainerRouter);
app.use(deleteOneTrainerRouter);
app.use(editTrainerRouter);
app.use(addManagementRouter);
// --- RUTE ACCES COMUN (orice rol) ---
app.use(getAllCoursesRouter);

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const status = typeof err.status === "number" ? err.status : 500;
  res.status(status).json({ message: err.message || "Unexpected error" });
});

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const start = async () => {
  if (!process.env.MONGO_URI)
    throw new Error("Mongo URI is required in order to use the API");

  if (!process.env.JWT_KEY)
    throw new Error("JWT Key is required in order to use the API");

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("ENV variables EMAIL_USER or EMAIL_PASS are missing");
  }

  try {
    await transporter.verify();
    console.log("✅ Nodemailer is ready to send emails\n");
  } catch (err: unknown) {
    throw new Error("Nodemailer Error: " + (err as Error).message);
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");
  } catch (err: unknown) {
    throw new Error("MongoDB Error");
  }

  app.listen("8080", () => {
    console.log("💡 API running on port 8080");
    startOverdueSubscriptionCron();
  });
};

start();
