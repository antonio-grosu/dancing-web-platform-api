import * as dotenv from "dotenv";
import cors from "cors";
import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
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
