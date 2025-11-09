import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";
import { sendSuccess } from "../utils/apiSuccess";
import { IAuthService } from "../service/interface/IAuthService";
import { validateDateOfBirth, validateEmail, validateName, validatePassword } from "../utils/validator";

export class AuthController {
    constructor(
        private _authService: IAuthService
    ) { }

    async login(req: Request, res: Response, next: Function) {
        try {
            const { email, password } = req.body;
            const user = await this._authService.login(validateEmail(email), validatePassword(password));
            res.cookie("token", user.accessToken)

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

            res.cookie('signupToken', signupToken, { httpOnly: true });
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
            res.cookie("token", response.accessToken)

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
        sendSuccess(res, {})
    }





}