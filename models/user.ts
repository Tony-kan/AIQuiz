import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
  username: string;
  fullname: string;
  email: string;
  role: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
