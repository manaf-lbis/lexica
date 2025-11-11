import { Link, useNavigate } from "react-router-dom"

export default function NotFound({ message }: { message?: string }) {
    const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {/* 404 Error Code */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-linear-to-br from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-4">Not Found</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-6">
            {message ? message : "The page you're looking for doesn't exist or has been removed. Let's get you back on track."}
          </p>

          {/* Decorative Icon */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
              <svg className="w-16 h-16 text-slate-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mb-8">
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors inline-block"
          >
            Go Home
          </Link>
          <div
            onClick={()=>navigate(-1)}
            className="bg-slate-900 hover:bg-slate-800 cursor-pointer text-slate-300 border border-slate-800 font-semibold px-8 py-3 rounded-lg transition-colors inline-block"
          >
            Back
          </div>
        </div>

        {/* Help Text */}
        <p className="text-sm text-slate-500">
          Need help? <span className="text-slate-400">Contact support</span> or check the navigation menu.
        </p>
      </div>
    </main>
  )
}
