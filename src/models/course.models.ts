import mongoose, { PostMiddlewareFunction } from "mongoose";
import { TrainerDoc } from "./trainer.models";
import { UserDoc } from "./user.models";
import { AnnouncementDoc } from "./announcement.models";

export interface CourseDoc extends mongoose.Document {
  name: string;
  dancingStyle: string;
  trainers?: Array<TrainerDoc>;
  members?: Array<UserDoc>;
  announcements?: Array<AnnouncementDoc>;
}

export interface CreateCourseDto {
  name: string;
  dancingStyle: string;
}

export interface CourseModel extends mongoose.Model<CourseDoc> {
  build(dto: CreateCourseDto): CourseDoc;
}

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  dancingStyle: {
    type: String,
    required: true,
  },

  trainers: {
    type: mongoose.Types.ObjectId,
  },
  memebers: {
    type: mongoose.Types.ObjectId,
  },
  announcements: {
    type: mongoose.Types.ObjectId,
  },
});

courseSchema.statics.build = (dto: CreateCourseDto) => {
  return new Course(dto);
};

export const Course = mongoose.model<CourseDoc, CourseModel>(
  "Course",
  courseSchema
);
