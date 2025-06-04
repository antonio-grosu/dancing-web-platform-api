import mongoose from "mongoose";
import { CourseDoc } from "./course.models";
import { UserDoc } from "./user.models";
import { TrainerDoc } from "./trainer.models";

export interface FeedbackDoc extends mongoose.Document {
  leftBy: TrainerDoc;
  content: string;
  onCourse: CourseDoc;
  belongsToUser: UserDoc;
}

export interface CreateFeedbackDto {
  leftBy: TrainerDoc;
  content: string;
  onCourse: CourseDoc;
  belongsToUser: UserDoc;
}

export interface FeedbackModel extends mongoose.Model<FeedbackDoc> {
  build(dto: CreateFeedbackDto): FeedbackDoc;
}

const feedbackSchema = new mongoose.Schema({
  leftBy: {
    type: mongoose.Types.ObjectId,
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
    type: mongoose.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  belongsToUser: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// feedbackSchema.statics.build = (dto: CreateFeedbackDto) => {
//   return new Feedback(dto);
// };

feedbackSchema.pre("save", async function (done) {
  if (this.isModified("date") || this.isNew) {
    this.date = new Date();
  }
  done();
});

export const Feedback = mongoose.model<FeedbackDoc, FeedbackModel>(
  "Feedback",
  feedbackSchema
);
