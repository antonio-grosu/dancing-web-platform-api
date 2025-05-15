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
import { signupRouter } from "./routers/userAuth/signup";
import cookieSession from "cookie-session";
import { signinRouter } from "./routers/userAuth/signin";
import { currentUserRouter } from "./routers/userAuth/current-user";
import { currentUser } from "../common/src/middlewares/current-user";
import { signoutRouter } from "./routers/userAuth/signout";

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
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(currentUserRouter);

app.get(
  "/",
  requireAuth,
  requireRole("administrator"),
  async (req: Request, res: Response) => {
    res.send("OK");
  }
);

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
