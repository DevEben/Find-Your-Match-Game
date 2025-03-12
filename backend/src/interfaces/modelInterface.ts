import { Types, Document } from "mongoose";

export interface IUserMatch extends Document {
  userName: string;
  userZodiac: string;
  loverName: string;
  loverZodiac: string;
  matchScore: number;
  matchDescription: string;
  createdAt: Date;
}

