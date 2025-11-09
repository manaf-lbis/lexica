import { Document, Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string
    dateOfBirth: Date,
    prefrences?: Types.ObjectId
    avatar?: string;
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
}