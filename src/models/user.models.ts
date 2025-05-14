import mongoose from "mongoose";
import { authenticationService } from "../../common/src/services/authentication";
import { CourseDoc } from "./course.models";
import { FeedbackDoc } from "./feedback.models";

export interface UserDoc extends mongoose.Document {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  enrolledTo?: Array<CourseDoc>;
  receivedFeedbacks?: Array<FeedbackDoc>;
}

export interface CreateUserDto {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
}

export interface UserModel extends mongoose.Model<UserDoc> {
  build(dto: CreateUserDto): UserDoc;
}

const userSchema = new mongoose.Schema({
  lastName: {
    type: String,
    required: true,
  },
  firstName: {
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

  enrolledTo: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
  },
  receivedFeedbacks: {
    type: mongoose.Types.ObjectId,
    ref: "Feedback",
  },
});

userSchema.pre("save", async function (done) {
  if (this.isModified("password") || this.isNew) {
    const hashedPwd = await authenticationService.pwdToHash(
      this.get("password")
    );
    this.set("password", hashedPwd);
  }
  done();
});

userSchema.statics.build = (createUserDto: CreateUserDto) => {
  return new User(createUserDto);
};

export const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
