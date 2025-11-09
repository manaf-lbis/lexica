import { Types } from "mongoose";

export interface IAuthService {
    login(email: string, password: string): Promise<{ accessToken: string, refreshToken: string }>;
    signup(name: string, email: string, password: string, dateOfBirth: Date): Promise<{ signupToken: string }>;
    verifySignupOtp(otp: string, signupToken: string): Promise<{ email: string, name: string, avatar?: string, accessToken: string }>;
    logout(userId: Types.ObjectId): Promise<void>;
    resendOtp(email: string, token: string): Promise<{ signupToken: string }>;
    
    forgotPassword(email: string): Promise<{ email: string, resetToken: string }>
    verifyResetOtp(otp: string, resetToken: string): Promise<{ email: string, name: string, avatar?: string, accessToken: string }>
    resetPassword(password: string, resetToken: string): Promise<any>
    resentResetOtp(email: string, resetToken: string): Promise<any>

}