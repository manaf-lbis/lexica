export default function LoadingScreen() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center">
      {/* Animated radial glow behind logo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.2) 40%, transparent 70%)",
            animation: "pulse 3s ease-in-out infinite",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)",
            animation: "pulse 3s ease-in-out infinite 0.5s",
            filter: "blur(30px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-12 text-center px-4">
        {/* Shining Logo Container */}


        {/* Company name */}
        <div className="space-y-3">
          <h1
            className="text-5xl sm:text-7xl font-bold tracking-tight text-white"
            style={{
              animation: "fadeInUp 1s ease-out",
              textShadow: "0 0 30px rgba(99, 102, 241, 0.5)",
            }}
          >
            LEXICA
          </h1>

          <p
            className="text-base sm:text-lg text-indigo-300 font-light tracking-wide"
            style={{
              animation: "fadeInUp 1s ease-out 0.2s both",
            }}
          >
            Craft Brilliance, Share Knowledge
          </p>
        </div>

      </div>

      {/* Animations */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(99, 102, 241, 0.8), 0 0 40px rgba(168, 85, 247, 0.6);
          }
          50% {
            text-shadow: 0 0 30px rgba(99, 102, 241, 1), 0 0 50px rgba(168, 85, 247, 0.8), 0 0 70px rgba(236, 72, 153, 0.6);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-12px);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
