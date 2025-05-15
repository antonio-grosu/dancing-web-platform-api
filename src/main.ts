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
// routers pentru useri ( sportiv )

import { userSignupRouter } from "./routers/user/userSignup";
import { userSigninRouter } from "./routers/user/userSignin";
import { userSignoutRouter } from "./routers/user/userSignout";
import { currentUserRouter } from "./routers/user/current-user";
import { currentUser } from "../common/src/middlewares/current-user";
// routers pentru administratori
import { administratorSigninRouter } from "./routers/administrator/administratorSignin";
import { administratorSignupRouter } from "./routers/administrator/administratorSignup";
import { administratorSignouRouter } from "./routers/administrator/administratorSignout";
import { getAllAdministratorsRouter } from "./routers/administrator/administratorGetAll";
import { getOneAdministratorRouter } from "./routers/administrator/administratorGetOne";
import { deleteAdministratorRouter } from "./routers/administrator/administratorDelete";
import { getAllUsersRouter } from "./routers/user/userGetAll";
import { getOneUserRouter } from "./routers/user/userGetOne";
import { addCourseRouter } from "./routers/administrator/addCourse";
import { deleteCourseRouter } from "./routers/administrator/deleteCourse";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);
app.use(json());
app.use(urlencoded({ extended: false }));

app.set("trust proxy", true);

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

declare global {
  interface CustomError extends Error {
    status: number;
  }
}
app.use(currentUser);

// rutele user / sportiv
app.use(userSignupRouter);
app.use(userSigninRouter);
app.use(userSignoutRouter);
app.use(currentUserRouter);

// rutele administrator

app.use(administratorSigninRouter);
app.use(administratorSignouRouter);
app.use(administratorSignupRouter);
app.use(requireAuth, requireRole("administrator"), getAllAdministratorsRouter);
app.use(requireAuth, requireRole("administrator"), getOneAdministratorRouter);
app.use(requireAuth, requireRole("administrator"), deleteAdministratorRouter);
app.use(requireAuth, requireRole("administrator"), getAllUsersRouter);
app.use(requireAuth, requireRole("administrator"), getOneUserRouter);
app.use(requireAuth, requireRole("administrator"), addCourseRouter);
app.use(requireAuth, requireRole("administrator"), deleteCourseRouter);

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status).json(err.message);
});

const start = async () => {
  if (!process.env.MONGO_URI)
    throw new Error("Mongo URI is required in order to use the API");

  if (!process.env.JWT_KEY)
    throw new Error("JWT Key is required in order to use the API");

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err: unknown) {
    throw new Error("MongoDB Error");
  }

  app.listen("8080", () => {
    console.log("API running on port 8080");
  });
};

start();
