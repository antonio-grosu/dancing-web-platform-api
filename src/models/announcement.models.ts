import mongoose from "mongoose";
import { UserDoc } from "./user.models";

export interface AnnouncementDoc extends mongoose.Document {
  author: string;
  content: string;
  date: Date;
  belongsTo: UserDoc;
}

export interface CreateAnnouncementDto {
  author: string;
  content: string;
  date: Date;
  belongsTo: UserDoc;
}

export interface AnnouncementModel extends mongoose.Model<AnnouncementDoc> {
  build(dto: CreateAnnouncementDto): AnnouncementDoc;
}

const announcementSchema = new mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  belongsTo: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

export const Announcement = mongoose.model<AnnouncementDoc, AnnouncementModel>(
  "Announcement",
  announcementSchema
);
