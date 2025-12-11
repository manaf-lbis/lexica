// import nodemailer from "nodemailer";
// import ApiError from "./apiError";
// import dotenv from "dotenv";
// import { error } from "console";
// dotenv.config();



// export const mailTransporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });


// export const sendMail = async (to: string, subject: string, html: string): Promise<void> => {
//     try {
//         await mailTransporter.sendMail({
//             from: `"Code Brocamp" <${process.env.EMAIL_USER}>`,
//             to,
//             subject,
//             html,
//         });

//     } catch (err) {
//         console.log(err);
//         throw new ApiError("Failed to send email");
//     }
// };




import Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY!
);

export const sendMail = async (to: string, subject: string, html: string): Promise<void> => {
    try {
        await apiInstance.sendTransacEmail({
            sender: {
                name: "Code Brocamp",
                email: process.env.EMAIL_USER,
            },
            to: [{ email: to }],
            subject,
            htmlContent: html,
        });

        console.log("Brevo email sent!");
    } catch (err: any) {
        console.error("Brevo error:", err);
        throw new Error("Failed to send email: " + err.message);
    }
};
