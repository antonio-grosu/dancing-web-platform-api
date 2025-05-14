import mongoose from "mongoose";

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

export const Administrator = mongoose.model<
  AdministratorDoc,
  AdministratorModel
>("Administrator", administratorSchema);
