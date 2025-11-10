import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Check, AlertCircle } from "lucide-react";
import OTPInput from "../components/OtpInput";
import ResendTimer from "../components/ResentTimer";
import { useForgotPasswordMutation, useVerifyResetOtpMutation, useSetNewPasswordMutation, useResentResetOtpMutation } from "../api/authApi";
import { toast } from "sonner";

type Step = "email" | "otp" | "password";

interface FormState {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

interface ErrorState {
  [key: string]: string | undefined;
}

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading: forgotLoading }] = useForgotPasswordMutation();
  const [verifyResetOtp, { isLoading: otpLoading }] = useVerifyResetOtpMutation();
  const [setNewPassword, { isLoading: passwordLoading }] = useSetNewPasswordMutation();
  const [resentResetOtp, { isLoading: resentLoading }] = useResentResetOtpMutation();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("email");
  const [form, setForm] = useState<FormState>({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ErrorState>({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  // Step 1: Send OTP to email
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    if (!form.email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (!validateEmail(form.email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    try {
      await forgotPassword({ email: form.email }).unwrap();
      setSuccessMessage("OTP sent to your email. Check your inbox!");
      setStep("otp");
    } catch (error: any) {
      setErrors({ server: error.data?.message || "Failed to send OTP. Please try again." });
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    if (!form.otp.trim()) {
      setErrors({ otp: "OTP is required" });
      return;
    }
    if (form.otp.length !== 6) {
      setErrors({ otp: "OTP must be 6 digits" });
      return;
    }

    try {
      await verifyResetOtp(form.otp).unwrap();
      setSuccessMessage("OTP verified successfully!");
      setStep("password");
    } catch (error: any) {
      setErrors({ otp: error.data?.message || "Invalid OTP. Please try again." });
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    const newErrors: ErrorState = {};
    if (!form.password.trim()) {
      newErrors.password = "New password is required";
    } else if (!validatePassword(form.password)) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await setNewPassword( form.password ).unwrap();
      setSuccessMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      setErrors({ server: error.data?.message || "Failed to reset password. Please try again." });
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    try {
      await resentResetOtp(form.email).unwrap();
      toast.success("OTP resent successfully.");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to resend OTP. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.server) {
      setErrors((prev) => ({ ...prev, [name]: undefined, server: undefined }));
    }
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("email");
      setForm((prev) => ({ ...prev, otp: "" }));
    } else if (step === "password") {
      setStep("otp");
      setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    }
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-lg">
              ✎
            </div>
            <span className="text-lg font-bold bg-linear-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
              Lexica
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-slate-400">
            {step === "email" && "Enter your email to receive an OTP"}
            {step === "otp" && "Enter the OTP sent to your email"}
            {step === "password" && "Create a new password"}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          <div className={`h-1 flex-1 rounded-full transition-colors ${step === "email" ? "bg-blue-600" : "bg-slate-700"}`} />
          <div className={`h-1 flex-1 rounded-full transition-colors ${["otp", "password"].includes(step) ? "bg-blue-600" : "bg-slate-700"}`} />
          <div className={`h-1 flex-1 rounded-full transition-colors ${step === "password" ? "bg-blue-600" : "bg-slate-700"}`} />
        </div>

        {/* Main Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          {/* Server Error */}
          {errors.server && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{errors.server}</p>
            </div>
          )}
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
              <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <p className="text-sm text-green-400">{successMessage}</p>
            </div>
          )}

          {/* Step 1: Email */}
          {step === "email" && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleInputChange}
                    disabled={forgotLoading}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.email ? "border-red-500" : "border-slate-700"}`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 flex items-center gap-1 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {forgotLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <OTPInput
                value={form.otp}
                onChange={(otp: string) => setForm((prev) => ({ ...prev, otp }))}
                error={errors.otp}
                disabled={otpLoading || resentLoading}
                label="Enter OTP"
                placeholder="000000"
                demoHint="Check your email for the 6-digit code"
              />
              <ResendTimer
                onResend={handleResendOTP}
                duration={30}
                isLoading={resentLoading || otpLoading}
              />
              <button
                type="submit"
                disabled={otpLoading || resentLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {otpLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>
          )}

          {/* Step 3: Password */}
          {step === "password" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    name="password"
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={handleInputChange}
                    disabled={passwordLoading}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.password ? "border-red-500" : "border-slate-700"}`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-2 flex items-center gap-1 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={handleInputChange}
                    disabled={passwordLoading}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.confirmPassword ? "border-red-500" : "border-slate-700"}`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 flex items-center gap-1 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {passwordLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Resetting...</span>
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          {/* Back Button */}
          {step !== "email" && (
            <button
              onClick={handleBack}
              disabled={forgotLoading || otpLoading || passwordLoading || resentLoading}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {/* Login Link */}
          <div className="mt-6 border-t border-slate-800 pt-6 text-center">
            <p className="text-slate-400">
              Remember your password?{" "}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}