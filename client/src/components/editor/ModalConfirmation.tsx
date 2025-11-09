import { CheckCircle, X } from "lucide-react"

interface ModalConfirmationProps {
  message: string
  onClose: () => void
}

export default function ModalConfirmation({ message, onClose }: ModalConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div className="flex-1">
            <p className="text-slate-200 font-medium">{message}</p>
          </div>
          <button onClick={onClose} className="shrink-0 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
