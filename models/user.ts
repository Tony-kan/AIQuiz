import { Schema, models, model, Document } from "mongoose";

export type UserRole = "Student" | "Admin";
export const userRoles: UserRole[] = ["Student", "Admin"]; // For Zod/validation

export interface IUser extends Document {
  username: string;
  fullname: string | null; // NextAuth default fields
  email: string;
  password: string; // Optional, if you are storing passwords
  role: UserRole; // The role field
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullname: { type: String },
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: userRoles, // Restrict values to the defined roles
      default: "Student", // Set a default role if needed
      required: true,
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt

const UserModel = models.User || model<IUser>("User", userSchema);

export default UserModel;
