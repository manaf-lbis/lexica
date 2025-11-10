import { useState } from "react";

interface Category {
  id: string;
  name: string;
  isPrefered: boolean;
}

interface CategoryPreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categories: string[]) => void;
  categories: Category[];
  title?: string;
  description?: string;
}

export default function CategoryPreferenceModal({
  isOpen,
  onClose,
  onSave,
  categories,
  title = "Select Your Interests",
  description = "Choose categories you are interested in to personalize your experience",
}: CategoryPreferenceModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(categories.filter(c => c.isPrefered).map(c => c.id));

  const handleToggleCategory = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one category");
      return;
    }
    onSave(selectedIds);
  };

  const handleClose = () => {
    setSelectedIds(categories.filter(c => c.isPrefered).map(c => c.id));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="px-6 sm:px-8 py-6 sm:py-8 bg-linear-to-r from-blue-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{description}</p>
            </div>
            <button
              onClick={handleClose}
              className="shrink-0 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-200 dark:scrollbar-thumb-blue-600 dark:scrollbar-track-gray-800">
          <div className="px-6 sm:px-8 py-6 sm:py-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleToggleCategory(category.id)}
                  className={`relative p-3 sm:p-4 rounded-2xl font-semibold transition-all duration-300 flex flex-col items-center justify-center gap-2 text-center min-h-24 border-2 group ${
                    selectedIds.includes(category.id)
                      ? "bg-blue-600 dark:bg-blue-700 text-white border-blue-600 dark:border-blue-700 shadow-lg shadow-blue-500/30 scale-105"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md"
                  }`}
                >
                  <span className="text-xs sm:text-sm font-semibold line-clamp-2 group-hover:line-clamp-none">
                    {category.name}
                  </span>
                  {selectedIds.includes(category.id) && (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 animate-in fade-in" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 sm:px-8 py-4 sm:py-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              <span className="font-bold text-gray-900 dark:text-white text-lg">{selectedIds.length}</span> of{" "}
              <span className="font-bold text-gray-900 dark:text-white text-lg">{categories.length}</span> selected
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleClose}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold transition-all hover:shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:shadow-blue-500/30"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}