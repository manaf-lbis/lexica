import { Types } from "mongoose";
import { IOtpRepository } from "../repository/interface/IOtpRepository";
import { IUserRepository } from "../repository/interface/IUserRepository";
import { StatusCodes } from "../types/statusCodes";
import ApiError from "../utils/apiError";
import { comparePassword, hashPassword } from "../utils/hashing";
import { generateOTP } from "../utils/otpGenerator";
import { generateAccessToken, generateTokens, verifyToken } from "../utils/token";
import { IAuthService } from "./interface/IAuthService";
import { otpTemplate } from "../template/otpTemplate";
import { sendMail } from "../utils/mail";

export class AuthService implements IAuthService {
    constructor(
        private _userRepository: IUserRepository,
        private _otpRepository: IOtpRepository
    ) { }
    async login(email: string, password: string): Promise<{ accessToken: string, refreshToken: string }> {
        const user = await this._userRepository.findByEmail(email);

        if (!user) throw new ApiError("Invalid email or password");
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) throw new ApiError("Invalid email or password");
        const token = generateTokens({
            email: user.email,
            userId: user._id
        });

        await this._userRepository.update(user._id, {
            refreshToken: token.refreshToken
        });

        return token;

    };

    async signup(name: string, email: string, password: string, dateOfBirth: Date): Promise<{ signupToken: string }> {

        const userWithEmail = await this._userRepository.findByEmail(email);
        if (userWithEmail) throw new ApiError("Email already in use");

        const hashedPassword = await hashPassword(password);

        const otp = generateOTP(6)
        console.log('generated Otp', otp);

        await sendMail(email, "Your Signup OTP", otpTemplate(otp));

        const otpDoc = await this._otpRepository.create({ email, otp });
        const { accessToken } = generateTokens({ name, email, hashedPassword, dateOfBirth, otpId: otpDoc._id, userId: otpDoc._id });

        return {
            signupToken: accessToken
        }
    };

    async verifySignupOtp(otp: string, signupToken: string): Promise<{ email: string, name: string, avatar?: string, accessToken: string }> {

        const data = verifyToken(signupToken);
        if (!data) throw new ApiError("Invalid signup Attempt Try Again", StatusCodes.BAD_REQUEST);

        const otpRecord = await this._otpRepository.findById(data.otpId!);
        if (!otpRecord) throw new ApiError("OTP Expired", 400);

        if (otpRecord.attempts >= Number(process.env.MAX_OTP_ATTEMPTS)) {
            throw new ApiError("OTP attempts exceeded, Try after Sometime", 400);
        }

        if (otpRecord.otp !== otp.trim()) {
            await this._otpRepository.update(data.otpId!, { attempts: otpRecord.attempts + 1 });
            throw new ApiError(`Invalid OTP You have ${Number(process.env.MAX_OTP_ATTEMPTS) - otpRecord.attempts} left.`);
        }

        const user = await this._userRepository.create({
            name: data.name,
            email: data.email,
            password: data.hashedPassword,
            dateOfBirth: data.dateOfBirth
        });

        const tokens = generateTokens({
            email: user.email,
            userId: user._id
        });

        await this._userRepository.update(user._id, {
            refreshToken: tokens.refreshToken
        });

        return {
            email: user.email,
            name: user.name,
            avatar: user?.avatar,
            accessToken: tokens.accessToken
        };
    };

    async logout(userId: Types.ObjectId): Promise<void> {
        await this._userRepository.clearRefreshToken(userId);
    };


    async resendOtp(email: string, token: string): Promise<{ signupToken: string }> {

        const data = verifyToken(token);
        if (!data) throw new ApiError("Invalid signup Attempt Try Again");

        const otpRecord = await this._otpRepository.findById(data.otpId!);
        if (!otpRecord) throw new ApiError("Time Limit Exceed Try Again");

        if (otpRecord.attempts >= Number(process.env.MAX_OTP_ATTEMPTS)) {
            throw new ApiError("OTP attempts exceeded, Try after Sometime");
        }

        const otp = generateOTP();
        console.log(`OTP ${otp}`);

        const newOtpRecord = await this._otpRepository.update(data.otpId!, {
            otp,
            expiresAt: new Date(Date.now() + Number(process.env.OTP_VALIDITY_MINUTES) * 60 * 1000)
        });

        await sendMail(email, "Your Signup OTP", otpTemplate(otp));

        const signupToken = generateAccessToken({
            email: data.email,
            hashedPassword: data.hashedPassword,
            otpId: otpRecord._id,
            userId: otpRecord._id
        });


        return { signupToken: signupToken };
    }

    async forgotPassword(email: string): Promise<{ email: string; resetToken: string }> {

        const user = await this._userRepository.findByEmail(email);
        if (!user) throw new ApiError("Email not found");

        const otp = generateOTP(6)
        console.log('generated Otp', otp);

        await sendMail(email, "Your Forgot Password OTP", otpTemplate(otp));

        const otpDoc = await this._otpRepository.create({ email, otp });

        const resetToken = generateAccessToken({ email, otpId: otpDoc._id, userId: user._id });
        return { email: user.email, resetToken };
    }

    async verifyResetOtp(otp: string, resetToken: string): Promise<any> {

        const data = verifyToken(resetToken);
        if (!data) throw new ApiError("Invalid signup Attempt Try Again");

        const otpRecord = await this._otpRepository.findById(data.otpId!);
        if (!otpRecord) throw new ApiError("OTP Expired", 400);

        if (otpRecord.attempts >= Number(process.env.MAX_OTP_ATTEMPTS)) {
            throw new ApiError("OTP attempts exceeded, Try after Sometime", 400);
        }

        if (otpRecord.otp !== otp.trim()) {
            await this._otpRepository.update(data.otpId!, { attempts: otpRecord.attempts + 1 });
            throw new ApiError(`Invalid OTP You have ${Number(process.env.MAX_OTP_ATTEMPTS) - otpRecord.attempts} left.`);
        } else {
            await this._otpRepository.update(data.otpId!, { verified: true });
        }
        return true

    }

    async resetPassword(password: string, resetToken: string): Promise<any> {

        const data = verifyToken(resetToken);
        if (!data) throw new ApiError("Invalid signup Attempt Try Again");

        const otpRecord = await this._otpRepository.findById(data.otpId!);
        if (!otpRecord) throw new ApiError("OTP Expired", 400);

        if (otpRecord.attempts >= Number(process.env.MAX_OTP_ATTEMPTS)) {
            throw new ApiError("OTP attempts exceeded, Try after Sometime", 400);
        }

        const user = await this._userRepository.findById(data.userId!);
        if (!user) throw new ApiError("User not found", 400);

        const hashedPassword = await hashPassword(password);

        await this._userRepository.update(user._id, { password: hashedPassword });

        return { email: user.email }
    }

    async resentResetOtp(email: string, resetToken: string): Promise<any> {

        const data = verifyToken(resetToken);
        if (!data) throw new ApiError("Invalid signup Attempt Try Again");

        const otpRecord = await this._otpRepository.findById(data.otpId!);
        if (!otpRecord) throw new ApiError("OTP Expired", 400);

        if (otpRecord.attempts >= Number(process.env.MAX_OTP_ATTEMPTS)) {
            throw new ApiError("OTP attempts exceeded, Try after Sometime", 400);
        }

        const otp = generateOTP(6);
        console.log('generated Otp', otp);

        await sendMail(email, "Your Forgot Password OTP", otpTemplate(otp));

        await this._otpRepository.update(data.otpId!, {
            otp,
            expiresAt: new Date(Date.now() + Number(process.env.OTP_VALIDITY_MINUTES) * 60 * 1000)
        });

        return { email: data.email }
    }




}