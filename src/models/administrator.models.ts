import mongoose from "mongoose";
import { authenticationService } from "../../common/src/services/authentication";
export interface AdministratorDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreateAdministratorDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AdministratorModel extends mongoose.Model<AdministratorDoc> {
  build(dto: CreateAdministratorDto): AdministratorDoc;
}

const administratorSchema = new mongoose.Schema({
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
});

administratorSchema.pre("save", async function (done) {
  if (this.isModified("password") || this.isNew) {
    const hashedPwd = await authenticationService.pwdToHash(
      this.get("password")
    );
    this.set("password", hashedPwd);
  }
  done();
});

administratorSchema.statics.build = (createUserDto: CreateAdministratorDto) => {
  return new Administrator(createUserDto);
};

export const Administrator = mongoose.model<
  AdministratorDoc,
  AdministratorModel
>("Administrator", administratorSchema);
