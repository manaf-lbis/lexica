import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"

interface FormErrors {
  email?: string
  password?: string
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (errors.email) setErrors({ ...errors, email: undefined })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (errors.password) setErrors({ ...errors, password: undefined })
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-6 sm:py-8">
      {/* Decorative blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">Welcome Back</h1>
          <p className="text-sm sm:text-base text-slate-400">Sign in to your Lexica account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl sm:rounded-2xl p-5 sm:p-8 space-y-4 sm:space-y-6"
        >
          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-200">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" />
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={handleEmailChange}
                className={`w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-slate-700/50 border rounded-lg transition-all duration-300 focus:outline-none text-sm sm:text-base placeholder:text-slate-500 text-white ${
                  errors.email
                    ? "border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    : "border-slate-600 hover:border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                }`}
              />
            </div>
            {errors.email && (
              <div className="flex items-center gap-2 text-red-400 text-xs sm:text-sm mt-1">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-slate-200">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full pl-11 sm:pl-12 pr-11 sm:pr-12 py-2.5 sm:py-3 bg-slate-700/50 border rounded-lg transition-all duration-300 focus:outline-none text-sm sm:text-base placeholder:text-slate-500 text-white ${
                  errors.password
                    ? "border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    : "border-slate-600 hover:border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors duration-300"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center gap-2 text-red-400 text-xs sm:text-sm mt-1">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end pt-1">
            <Link
              to="#"
              className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 sm:py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="relative py-3 sm:py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-slate-800/50 text-slate-400 font-medium text-xs sm:text-sm">New to Lexica?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            to="/signup"
            className="block w-full py-2.5 sm:py-3 px-4 border-2 border-slate-600 hover:border-blue-500 hover:bg-blue-500/10 text-slate-200 font-semibold rounded-lg transition-all duration-300 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 text-sm sm:text-base"
          >
            Create Account
          </Link>
        </form>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs sm:text-sm mt-6 sm:mt-8">
          © 2025 Lexica. All rights reserved.
        </p>
      </div>
    </div>
  )
}
