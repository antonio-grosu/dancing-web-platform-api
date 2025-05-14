import mongoose, { Mongoose } from "mongoose";
import { CourseDoc } from "./course.models";
import { UserDoc } from "./user.models";

export interface FeedbackDoc extends mongoose.Document {
  leftBy: string;
  date: Date;
  content: string;
  onCourse: CourseDoc;
  belongsToUser: UserDoc;
}

export interface CreateFeedbackDto {
  leftBy: string;
  date: Date;
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
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  onCourse: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  belongsToUser: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

export const Feedback = mongoose.model<FeedbackDoc, FeedbackModel>(
  "Feedback",
  feedbackSchema
);
