import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, Calendar, ArrowRight, AlertCircle, CheckCircle } from "lucide-react"
import OTPInput from "../components/OtpInput"
import { useNavigate } from "react-router-dom"
import { useResentOtpMutation, useSignupMutation, useVerifySignupOtpMutation } from "../api/authApi"
import { useDispatch } from "react-redux"
import { setUser } from "../slice/authSlice"
import ResendTimer from "../components/ResentTimer"
import { toast } from "sonner"


interface FormErrors {
  name?: string
  dateOfBirth?: string
  email?: string
  password?: string
  confirmPassword?: string
  otp?: string
  server?: string
}

export default function SignupForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"details" | "otp">("details")

  const [name, setName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [signup, { isLoading }] = useSignupMutation();
  const [verifyOtp, { isLoading: otpLoading }] = useVerifySignupOtpMutation();
  const [resentOtp, { isLoading: resentLoading }] = useResentOtpMutation();
  const dispatch = useDispatch();

  const [otp, setOtp] = useState("")

  const [errors, setErrors] = useState<FormErrors>({})

  const validateDetailsForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!name.trim()) {
      newErrors.name = "Full name is required"
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required"
    } else {
      const today = new Date()
      const birthDate = new Date(dateOfBirth)
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 13) {
        newErrors.dateOfBirth = "You must be at least 13 years old"
      }
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required"
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateOTP = (): boolean => {
    const newErrors: FormErrors = {}

    if (!otp) {
      newErrors.otp = "OTP is required"
    } else if (otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleResendOTP = async () => {
    try {
      await resentOtp({ email }).unwrap()
      toast.success("OTP resent successfully.")
      setErrors({})
    } catch (error: any) {
      setErrors({ ...errors, server: error?.data?.message || "Failed to send OTP. Please try again." })
    }
  }

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateDetailsForm()) return

    try {
      await signup({ name, dateOfBirth, email, password }).unwrap()
      setStep("otp")
      setErrors({})
    } catch (error: any) {
      setErrors({ ...errors, server: error?.data?.message || "Failed to send OTP. Please try again." })
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateOTP()) return

    try {
      const response = await verifyOtp({ otp }).unwrap();
      dispatch(setUser(response.user));
      navigate("/")
    } catch (error: any) {
      setErrors({ ...errors, otp: error?.data?.message || "Invalid OTP. Please try again." })
    }
  }

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field] || errors.server) {
      setErrors({ ...errors, [field]: undefined, server: undefined })
    }
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8 overflow-hidden">
      {/* Decorative blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <button
          onClick={() => navigate("/login")}
          className="mb-4 flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors duration-300 text-xs sm:text-sm font-medium"
        >
          <span>←</span>
          <span>Back to Login</span>
        </button>

        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">Join Lexica</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {step === "details" ? "Create your account to start writing" : "Verify your email address"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2 mb-4 sm:mb-6">
          <div
            className={`flex-1 h-1 rounded-full transition-colors ${step === "details" ? "bg-blue-500" : "bg-slate-700"}`}
          ></div>
          <div
            className={`flex-1 h-1 rounded-full transition-colors ${step === "otp" ? "bg-blue-500" : "bg-slate-700"}`}
          ></div>
        </div>

        {/* Details Form */}
        {step === "details" && (
          <form
            onSubmit={handleDetailsSubmit}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 space-y-2 sm:space-y-3"
          >
            {/* Server Error Message */}
            {errors.server && (
              <div className="flex items-center gap-2 text-red-400 text-xs sm:text-sm bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span>{errors.server}</span>
              </div>
            )}

            {/* Full Name Input */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-xs font-semibold text-slate-200">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" />
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    clearFieldError("name")
                  }}
                  className={`w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2 bg-slate-700/50 border rounded-lg transition-all duration-300 focus:outline-none text-xs sm:text-sm placeholder:text-slate-500 text-white ${errors.name
                    ? "border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    : "border-slate-600 hover:border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    }`}
                />
              </div>
              {errors.name && (
                <div className="flex items-center gap-1.5 text-red-400 text-xs mt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span className="leading-tight">{errors.name}</span>
                </div>
              )}
            </div>

            {/* Date of Birth Input */}
            <div className="space-y-1">
              <label htmlFor="dob" className="block text-xs font-semibold text-slate-200">
                Date of Birth
              </label>
              <div className="relative group">
                <Calendar className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300 pointer-events-none" />
                <input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => {
                    setDateOfBirth(e.target.value)
                    clearFieldError("dateOfBirth")
                  }}
                  className={`w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2 bg-slate-700/50 border rounded-lg transition-all duration-300 focus:outline-none text-xs sm:text-sm text-white [scheme:dark] ${errors.dateOfBirth
                    ? "border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    : "border-slate-600 hover:border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    }`}
                />
              </div>
              {errors.dateOfBirth && (
                <div className="flex items-center gap-1.5 text-red-400 text-xs mt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span className="leading-tight">{errors.dateOfBirth}</span>
                </div>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-semibold text-slate-200">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    clearFieldError("email")
                  }}
                  className={`w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2 bg-slate-700/50 border rounded-lg transition-all duration-300 focus:outline-none text-xs sm:text-sm placeholder:text-slate-500 text-white ${errors.email
                    ? "border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    : "border-slate-600 hover:border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    }`}
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-1.5 text-red-400 text-xs mt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span className="leading-tight">{errors.email}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Password Input */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-200">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      clearFieldError("password")
                    }}
                    className={`w-full pl-10 sm:pl-11 pr-10 sm:pr-11 py-2 bg-slate-700/50 border rounded-lg transition-all duration-300 focus:outline-none text-xs sm:text-sm placeholder:text-slate-500 text-white ${errors.password
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                      : "border-slate-600 hover:border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1.5 text-red-400 text-xs mt-0.5">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span className="leading-tight">{errors.password}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-200">
                  Confirm
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      clearFieldError("confirmPassword")
                    }}
                    className={`w-full pl-10 sm:pl-11 pr-10 sm:pr-11 py-2 bg-slate-700/50 border rounded-lg transition-all duration-300 focus:outline-none text-xs sm:text-sm placeholder:text-slate-500 text-white ${errors.confirmPassword
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                      : "border-slate-600 hover:border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors duration-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center gap-1.5 text-red-400 text-xs mt-0.5">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span className="leading-tight">{errors.confirmPassword}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-slate-400 text-center leading-tight py-1 sm:py-2">
              By signing up, you agree to our{" "}
              <a href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium">
                Terms
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium"
              >
                Privacy
              </a>
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || otpLoading}
              className="w-full py-2 sm:py-2.5 px-3 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              {isLoading || otpLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Sending OTP...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* OTP Verification Form */}
        {step === "otp" && (
          <form
            onSubmit={handleOTPSubmit}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 space-y-4 sm:space-y-5"
          >
            {/* Success Message */}
            <div className="flex items-center gap-2 text-blue-400 text-xs sm:text-sm bg-blue-500/10 border border-blue-500/50 rounded-lg p-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>
                We sent a verification code to <strong>{email}</strong>
              </span>
            </div>

            {/* OTP Input */}
            <OTPInput
              value={otp}
              onChange={setOtp}
              error={errors.otp}
              disabled={isLoading || otpLoading}
              label="Verification Code"
              placeholder="000000"
              demoHint="Check your email for the 6-digit code"
            />

            {/* Resend OTP Link */}
            <div className="text-center text-xs sm:text-sm text-slate-400">
              <ResendTimer
                onResend={handleResendOTP}
                duration={30}
                isLoading={resentLoading || otpLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || otpLoading || otp.length !== 6}
              className="w-full py-2 sm:py-2.5 px-3 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              {isLoading || otpLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify & Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                setStep("details")
                setOtp("")
                setErrors({})
              }}
              className="w-full py-2 sm:py-2.5 px-3 sm:px-4 border-2 border-slate-600 hover:border-blue-500 hover:bg-blue-500/10 text-slate-200 font-semibold rounded-lg transition-all duration-300 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 text-xs sm:text-sm"
            >
              Back to Details
            </button>
          </form>
        )}

        <p className="text-center text-slate-500 text-xs mt-3 sm:mt-4">© 2025 Lexica. All rights reserved.</p>
      </div>
    </div>
  )
}
