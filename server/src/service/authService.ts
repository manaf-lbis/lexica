import { IOtpRepository } from "../repository/interface/IOtpRepository";
import { IUserRepository } from "../repository/interface/IUserRepository";
import { StatusCodes } from "../types/statusCodes";
import ApiError from "../utils/apiError";
import { comparePassword, hashPassword } from "../utils/hashing";
import { generateOTP } from "../utils/otpGenerator";
import { generateTokens, verifyToken } from "../utils/token";
import { IAuthService } from "./interface/IAuthService";

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

        const otpDoc = await this._otpRepository.create({ email, otp });
        const { accessToken } = generateTokens({ name, email, hashedPassword, dateOfBirth, otpId: otpDoc._id });

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






}