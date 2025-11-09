export const otpTemplate = (otp: string, username?: string) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 30px;">
      <h2 style="color: #2563eb; text-align: center;">🔐 Email Verification</h2>
      <p style="font-size: 16px; color: #374151;">
        Hi ${username || "User"},
      </p>
      <p style="font-size: 15px; color: #374151;">
        Use the below One-Time Password (OTP) to verify your account. This OTP is valid for <b>5 minutes</b>.
      </p>
      <div style="text-align: center; margin: 25px 0;">
        <div style="display: inline-block; background: #2563eb; color: white; font-size: 22px; font-weight: bold; letter-spacing: 4px; padding: 12px 25px; border-radius: 10px;">
          ${otp}
        </div>
      </div>
      <p style="color: #6b7280; font-size: 13px;">
        If you did not request this, please ignore this email.  
        Your account remains safe.
      </p>
      <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 30px;">
        &copy; ${new Date().getFullYear()} Lexica By Manaf. All rights reserved.
      </p>
    </div>
  </div>
`;
