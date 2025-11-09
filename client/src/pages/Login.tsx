import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser } from "../slice/authSlice"
import { useLoginMutation } from "../api/authApi"

interface FormErrors {
  email?: string
  password?: string
  server?: string
}

export default function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const dispatch = useDispatch();
  const [login,{isLoading}] = useLoginMutation()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      const response = await login({ email, password }).unwrap();
      dispatch(setUser(response.user));
      navigate("/");
    } catch (error: any) {
      setErrors({ ...errors, server: error.data?.message || 'Failed to sign in. Please try again.' });
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
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">Welcome Back</h1>
          <p className="text-xs sm:text-sm text-slate-400">Sign in to your Lexica account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 space-y-3 sm:space-y-4"
        >
          {/* Server Error Message */}
          {errors.server && (
            <div className="flex items-center gap-2 text-red-400 text-xs sm:text-sm bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>{errors.server}</span>
            </div>
          )}

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

          {/* Forgot Password Link */}
          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 sm:py-2.5 px-3 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {/* Sign up Link */}
          <div className="text-center text-xs sm:text-sm text-slate-400">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium"
            >
              Sign up
            </button>
          </div>
        </form>

        <p className="text-center text-slate-500 text-xs mt-3 sm:mt-4">© 2025 Lexica. All rights reserved.</p>
      </div>
    </div>
  )
}
