import { OtpModel } from "../model/otpModel";
import { IOtp } from "../types/otp";
import { BaseRepository } from "./baseRepository";
import { IOtpRepository } from "./interface/IOtpRepository";

export class OtpRepository extends BaseRepository<IOtp> implements IOtpRepository {
    constructor() {
        super(OtpModel);
    }
    



}