import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";
import { sendSuccess } from "../utils/apiSuccess";
import { IAuthService } from "../service/interface/IAuthService";
import { validateDateOfBirth, validateEmail, validateName, validateOtp, validatePassword } from "../utils/validator";

export class AuthController {
    constructor(
        private _authService: IAuthService
    ) { }

    async login(req: Request, res: Response, next: Function) {
        try {
            const { email, password } = req.body;
            const user = await this._authService.login(validateEmail(email), validatePassword(password));

            res.cookie("token", user.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
            })

            sendSuccess(res, {}, "Login successful");

        } catch (error) {
            next(error);
        }
    }

    async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, dateOfBirth, email, password } = req.body

            const { signupToken } = await this._authService.signup(
                validateName(name),
                validateEmail(email),
                validatePassword(password),
                validateDateOfBirth(dateOfBirth)
            );

            res.cookie('signupToken', signupToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
            });
            sendSuccess(res, {}, 'OTP Generated successfully')

        } catch (error) {
            next(error);
        }

    }

    async verifySignupOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const { otp } = req.body;
            if (!otp?.trim() || otp.length !== 6) throw new ApiError("Email and OTP are required");

            const signupToken = req.cookies?.signupToken;

            if (!signupToken) throw new ApiError("Invalid signup Attempt Try Again");

            const response = await this._authService.verifySignupOtp(otp.trim(), signupToken);

            res.clearCookie("signupToken");
            res.cookie("token", response.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: Number(process.env.COOKIE_EXPIRY) * 60 * 1000
            })

            sendSuccess(res, {
                email: response.email,
                name: response.name,
                avatar: response.avatar
            }, "OTP verified successfully");

        } catch (error) {
            next(error);
        }
    }

    async validateUser(req: Request, res: Response, next: Function) {
        sendSuccess(res, {})
    }

    async logout(req: Request, res: Response, next: Function) {
        try {
            res.clearCookie("token");
            sendSuccess(res, {})
        } catch (error) {
            next(error);
        }

    }

    async resentOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            const token = req.cookies.signupToken;
            if (!email.trim()) throw new ApiError("Email is required");
            const user = await this._authService.resendOtp(email, token);

            res.cookie("signupToken", user.signupToken)

            sendSuccess(res, null, "OTP resent successfully");
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            const data = await this._authService.forgotPassword(validateEmail(email));

            res.cookie("resetToken", data.resetToken), {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: Number(process.env.COOKIE_EXPIRY) * 60 * 1000
            };

            sendSuccess(res, null, "OTP sent to your email. Check your inbox!");

        } catch (error) {
            next(error);
        }
    }

    async verifyResetOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const { otp } = req.body;

            const resetToken = req.cookies?.resetToken;
            if (!resetToken) throw new ApiError("Invalid signup Attempt Try Again");

            const response = await this._authService.verifyResetOtp(validateOtp(otp), resetToken);

            sendSuccess(res, {}, "OTP verified successfully");

        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { password } = req.body;
            const resetToken = req.cookies?.resetToken;
            if (!resetToken) throw new ApiError("Invalid signup Attempt Try Again");

            const response = await this._authService.resetPassword(validatePassword(password), resetToken);

            res.clearCookie("resetToken");

            sendSuccess(res, {
                email: response.email,
                name: response.name,
                avatar: response.avatar
            }, "Password reset successfully");

        } catch (error) {
            next(error);
        }
    }

    async resentResetOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            const resetToken = req.cookies?.resetToken;
            if (!resetToken) throw new ApiError("Invalid signup Attempt Try Again");

            const response = await this._authService.resentResetOtp(validateEmail(email), resetToken);

            sendSuccess(res, {
                email: response.email,
                name: response.name,
                avatar: response.avatar
            }, "OTP resent successfully");

        } catch (error) {
            next(error);
        }
    }





}