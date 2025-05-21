import mongoose from "mongoose";
import { CourseDoc } from "./course.models";
import { TrainerDoc } from "./trainer.models";

export interface AnnouncementDoc extends mongoose.Document {
  author: TrainerDoc;
  content: string;
  onCourse: CourseDoc;
}

export interface CreateAnnouncementDto {
  author: TrainerDoc;
  content: string;
  onCourse: CourseDoc;
}

export interface AnnouncementModel extends mongoose.Model<AnnouncementDoc> {
  build(dto: CreateAnnouncementDto): AnnouncementDoc;
}

const announcementSchema = new mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Trainer",
  },

  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    // required: true,
  },
  onCourse: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Course",
  },
});

announcementSchema.statics.build = (dto: CreateAnnouncementDto) => {
  return new Announcement(dto);
};
announcementSchema.pre("save", async function (done) {
  if (this.isModified("date") || this.isNew) {
    this.date = new Date();
  }
  done();
});

export const Announcement = mongoose.model<AnnouncementDoc, AnnouncementModel>(
  "Announcement",
  announcementSchema
);
