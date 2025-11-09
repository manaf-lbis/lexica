import mongoose,{Schema, Types} from "mongoose";
import { IUser } from "../types/user";

const userSchema = new Schema<IUser>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    prefrences :{
        type:Types.ObjectId,
        ref:"ArticlePrefrence"
    },
    password:{
        type:String,
        required:true,
    },
    avatar: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    refreshToken: {
        type: String
    },
},{ timestamps: true})

export const UserModel = mongoose.model("User",userSchema);