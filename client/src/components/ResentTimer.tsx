import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ResendTimerProps {
  onResend: () => Promise<void>;
  duration?: number;
  isLoading?: boolean;
}

export default function ResendTimer({ onResend, duration = 30, isLoading = false }: ResendTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const handleResend = async () => {
    try {
      await onResend();
      setTimeLeft(duration);
      setIsActive(true);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to send OTP. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center gap-1 text-xs sm:text-sm text-slate-400">
      {isActive ? (
        <>
          <span>Didn't receive the code?</span>
          <span className="text-blue-400 font-medium">Resend in {timeLeft}s</span>
        </>
      ) : (
        <>
          <span>Didn't receive the code?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Resending...</span>
              </>
            ) : (
              <span>Resend</span>
            )}
          </button>
        </>
      )}
    </div>
  );
}