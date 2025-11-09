import mongoose, { Schema } from "mongoose";
import { IOtp } from "../types/otp";

const otpSchema = new Schema<IOtp>({

    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + Number(process.env.OTP_VALIDITY_MINUTES) * 60 * 1000)
    },
    verified: {
        type: Boolean,
        default: false
    },
    attempts: {
        type: Number,
        default: 0
    },

}, { timestamps: true });

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 });

export const OtpModel = mongoose.model("Otp", otpSchema);