import type React from "react"
import { AlertCircle } from "lucide-react"

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  label?: string
  placeholder?: string
  demoHint?: string
}

export default function OTPInput({
  value,
  onChange,
  error,
  disabled = false,
  label = "Enter OTP",
  placeholder = "000000",
  demoHint,
}: OTPInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (/^\d*$/.test(inputValue) && inputValue.length <= 6) {
      onChange(inputValue)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-slate-200">{label}</label>
        {demoHint && <span className="text-xs text-slate-500">{demoHint}</span>}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        maxLength={6}
        disabled={disabled}
        className={`w-full px-4 py-2 bg-slate-800/50 border rounded-lg text-slate-200 text-center text-xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          error ? "border-red-500" : "border-slate-700"
        }`}
      />
      {error && (
        <p className="mt-2 flex items-center gap-1 text-sm text-red-400">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
}
