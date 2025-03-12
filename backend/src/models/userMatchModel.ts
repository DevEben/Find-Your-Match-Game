import mongoose, { Schema, Document } from "mongoose";
import { IUserMatch } from "../interfaces/modelInterface";

const UserMatchSchema: Schema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userZodiac: {
      type: String,
      required: true,
    },
    loverName: {
      type: String,
      required: true,
    },
    loverZodiac: {
      type: String,
      required: true,
    },
    matchScore: {
      type: Number,
      required: true,
    },
    matchDescription: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUserMatch>("UserMatch", UserMatchSchema);
