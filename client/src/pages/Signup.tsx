import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, User, Calendar, ArrowRight, AlertCircle } from "lucide-react"

interface FormErrors {
  fullName?: string
  dateOfBirth?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export default function SignupPage() {
  const [fullName, setFullName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required"
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters"
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
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and numbers"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required"
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined })
    }
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8 overflow-hidden">
      {/* Decorative blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">Join Lexica</h1>
          <p className="text-xs sm:text-sm text-slate-400">Create your account to start writing</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 space-y-2 sm:space-y-3 flex flex-col"
        >
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
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  clearFieldError("fullName")
                }}
                className={`w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2 bg-slate-700/50 border rounded-lg transition-all duration-300 focus:outline-none text-xs sm:text-sm placeholder:text-slate-500 text-white ${
                  errors.fullName
                    ? "border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    : "border-slate-600 hover:border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                }`}
              />
            </div>
            {errors.fullName && (
              <div className="flex items-center gap-1.5 text-red-400 text-xs mt-0.5">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span className="leading-tight">{errors.fullName}</span>
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
                className={`w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2 bg-slate-700/50 border rounded-lg transition-all duration-300 focus:outline-none text-xs sm:text-sm text-white [scheme:dark] ${
                  errors.dateOfBirth
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
                className={`w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2 bg-slate-700/50 border rounded-lg transition-all duration-300 focus:outline-none text-xs sm:text-sm placeholder:text-slate-500 text-white ${
                  errors.email
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
                  className={`w-full pl-10 sm:pl-11 pr-10 sm:pr-11 py-2 bg-slate-700/50 border rounded-lg transition-all duration-300 focus:outline-none text-xs sm:text-sm placeholder:text-slate-500 text-white ${
                    errors.password
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
                  className={`w-full pl-10 sm:pl-11 pr-10 sm:pr-11 py-2 bg-slate-700/50 border rounded-lg transition-all duration-300 focus:outline-none text-xs sm:text-sm placeholder:text-slate-500 text-white ${
                    errors.confirmPassword
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
                  <span className="leading-tight text-xs">{errors.confirmPassword}</span>
                </div>
              )}
            </div>
          </div>

          {/* Terms - condensed for mobile */}
          <p className="text-xs text-slate-400 text-center leading-tight py-1 sm:py-2">
            By signing up, you agree to our{" "}
            <Link to="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium">
              Privacy
            </Link>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 sm:py-2.5 px-3 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative py-1.5 sm:py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-slate-800/50 text-slate-400 font-medium">Already have an account?</span>
            </div>
          </div>

          {/* Sign In Link */}
          <Link
            to="/login"
            className="block w-full py-2 sm:py-2.5 px-3 sm:px-4 border-2 border-slate-600 hover:border-blue-500 hover:bg-blue-500/10 text-slate-200 font-semibold rounded-lg transition-all duration-300 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 text-xs sm:text-sm"
          >
            Sign In
          </Link>
        </form>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-3 sm:mt-4">© 2025 Lexica. All rights reserved.</p>
      </div>
    </div>
  )
}
