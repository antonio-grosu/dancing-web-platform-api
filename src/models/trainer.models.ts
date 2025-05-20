import { authenticationService } from "../../common/src/services/authentication";
import mongoose from "mongoose";
import { CourseDoc } from "./course.models";
import { FeedbackDoc } from "./feedback.models";

export interface TrainerDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  percentage: number;
  manages?: Array<CourseDoc>;
  sentFeedbacks?: Array<FeedbackDoc>;
}

export interface CreateTrainerDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  percentage: number;
}

export interface TrainerModel extends mongoose.Model<TrainerDoc> {
  build(dto: CreateTrainerDto): TrainerDoc;
}

const trainerSchema = new mongoose.Schema({
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
    type: mongoose.Types.ObjectId,
    ref: "Course",
  },
  sentFeedback: {
    type: mongoose.Types.ObjectId,
    ref: "Feedback",
  },
});

trainerSchema.pre("save", async function (done) {
  if (this.isModified("password") || this.isNew) {
    const hashedPwd = await authenticationService.pwdToHash(
      this.get("password")
    );
    this.set("password", hashedPwd);
  }
  done();
});

trainerSchema.statics.build = (dto: CreateTrainerDto) => {
  return new Trainer(dto);
};

export const Trainer = mongoose.model<TrainerDoc, TrainerModel>(
  "Trainer",
  trainerSchema
);
