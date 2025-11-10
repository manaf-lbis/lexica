import { NextFunction, Request, Response } from "express";
import { IProfileService } from "../service/interface/IProfileService";
import { sendSuccess } from "../utils/apiSuccess";
import { validateDateOfBirth, validateName } from "../utils/validator";

export class ProfileController {
    constructor(
        private _profileService: IProfileService

    ) { }

    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;
            const profile = await this._profileService.getProfile(userId!);

            sendSuccess(res, profile, "Profile fetched successfully");

        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, dateOfBirth, aboutMe } = req.body

            const userId = req.user?.userId;
            await this._profileService.updateProfile(userId!, {
                name:validateName(name),
                dateOfBirth:validateDateOfBirth(dateOfBirth),
                aboutMe: aboutMe.trim()
            });

            sendSuccess(res, {}, "Profile updated successfully");

        } catch (error) {
            next(error);
        }

    }

    async updateAvatar(req: Request, res: Response, next: NextFunction) {
        try {
            const { avatar } = req.body;
            if (!avatar) throw new Error("Avatar is required");
            
            const userId = req.user?.userId;
            await this._profileService.updateAvatar(userId!, avatar);

            sendSuccess(res, {}, "Avatar updated successfully");

        } catch (error) {
            next(error);
        }
    }


}