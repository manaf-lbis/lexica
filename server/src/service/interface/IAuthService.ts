export interface IAuthService {
    login(email: string, password: string): Promise<{ accessToken: string, refreshToken: string }>;
    signup(name: string, email: string, password: string, dateOfBirth: Date): Promise<{ signupToken: string }>;
    verifySignupOtp(otp: string, signupToken: string): Promise<{ email: string,name: string, avatar?: string, accessToken: string }>;
}