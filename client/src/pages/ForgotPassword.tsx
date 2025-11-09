import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, Lock, ArrowLeft, Check, AlertCircle } from "lucide-react"
import OTPInput from "../components/OtpInput"

type Step = "email" | "otp" | "password"

interface FormState {
  email: string
  otp: string
  password: string
  confirmPassword: string
}

interface ErrorState {
  [key: string]: string
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email")
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormState>({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<ErrorState>({})
  const [successMessage, setSuccessMessage] = useState("")

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 8
  }

  // Step 1: Send OTP to email
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage("")

    if (!form.email.trim()) {
      setErrors({ email: "Email is required" })
      return
    }

    if (!validateEmail(form.email)) {
      setErrors({ email: "Please enter a valid email address" })
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSuccessMessage("OTP sent to your email. Check your inbox!")
      setStep("otp")
    }, 1500)
  }

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage("")

    if (!form.otp.trim()) {
      setErrors({ otp: "OTP is required" })
      return
    }

    if (form.otp.length !== 6) {
      setErrors({ otp: "OTP must be 6 digits" })
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      if (form.otp === "123456") {
        setSuccessMessage("OTP verified successfully!")
        setStep("password")
      } else {
        setErrors({ otp: "Invalid OTP. Please try again." })
      }
    }, 1500)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage("")

    const newErrors: ErrorState = {}

    if (!form.password.trim()) {
      newErrors.password = "New password is required"
    } else if (!validatePassword(form.password)) {
      newErrors.password = "Password must be at least 8 characters long"
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSuccessMessage("Password reset successful! Redirecting to login...")
      setTimeout(() => {
        window.location.href = "/login"
      }, 2000)
    }, 1500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleBack = () => {
    if (step === "otp") {
      setStep("email")
      setErrors({})
      setSuccessMessage("")
    } else if (step === "password") {
      setStep("otp")
      setErrors({})
      setSuccessMessage("")
    }
  }

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

        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          <div
            className={`h-1 flex-1 rounded-full transition-colors ${step === "email" ? "bg-blue-600" : "bg-slate-700"}`}
          />
          <div
            className={`h-1 flex-1 rounded-full transition-colors ${
              ["otp", "password"].includes(step) ? "bg-blue-600" : "bg-slate-700"
            }`}
          />
          <div
            className={`h-1 flex-1 rounded-full transition-colors ${
              step === "password" ? "bg-blue-600" : "bg-slate-700"
            }`}
          />
        </div>

        {/* Main Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          {/* Success message */}
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
                    disabled={loading}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.email ? "border-red-500" : "border-slate-700"
                    }`}
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
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors"
              >
                {loading ? "Sending..." : "Send OTP"}
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
                disabled={loading}
                label="Enter OTP (Use 123456 for demo)"
                demoHint="Demo code: 123456"
              />

              <p className="text-xs text-slate-400 text-center">
                Did not receive OTP?{" "}
                <button
                  type="button"
                  onClick={() => handleSendOTP({ preventDefault: () => {} } as any)}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Resend
                </button>
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors"
              >
                {loading ? "Verifying..." : "Verify OTP"}
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
                    disabled={loading}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.password ? "border-red-500" : "border-slate-700"
                    }`}
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
                    disabled={loading}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.confirmPassword ? "border-red-500" : "border-slate-700"
                    }`}
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
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          {/* Back button */}
          {step !== "email" && (
            <button
              onClick={handleBack}
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {/* Login link */}
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
  )
}
