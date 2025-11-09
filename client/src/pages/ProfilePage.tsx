import { useState } from "react"
import AvatarUploadModal from "../components/AvatarUploadModal"
import CategoryPreferenceModal from "../components/CategoryPrefrenceModal"

interface ProfileData {
  name: string
  email: string
  dob: string
  aboutMe: string
  avatar: string | null
  categories: string[]
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [profile, setProfile] = useState<ProfileData>({
    name: "John Doe",
    email: "john@example.com",
    dob: "1990-01-15",
    aboutMe: "",
    avatar: null,
    categories: [],
  })

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [formData, setFormData] = useState(profile)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Password Reset State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const handleAvatarUpload = (croppedImage: string) => {
    setProfile((prev) => ({
      ...prev,
      avatar: croppedImage,
    }))
    setIsAvatarModalOpen(false)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required"
    } else {
      const dob = new Date(formData.dob)
      const today = new Date()
      const age = today.getFullYear() - dob.getFullYear()
      if (age < 13) {
        newErrors.dob = "You must be at least 13 years old"
      }
    }

    if (formData.aboutMe && formData.aboutMe.length > 500) {
      newErrors.aboutMe = "About me cannot exceed 500 characters"
    }

    return newErrors
  }

  const handleSaveProfile = () => {
    const newErrors = validateForm()

    if (Object.keys(newErrors).length === 0) {
      setProfile(formData)
      setIsEditingProfile(false)
      setErrors({})
    } else {
      setErrors(newErrors)
    }
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditingProfile(false)
    setErrors({})
  }

  const handleCategoriesSave = (selectedCategories: string[]) => {
    setProfile((prev) => ({
      ...prev,
      categories: selectedCategories,
    }))
    setIsCategoryModalOpen(false)
  }

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {}

    if (!passwordForm.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required"
    }

    if (!passwordForm.newPassword.trim()) {
      newErrors.newPassword = "New password is required"
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters"
    }

    if (!passwordForm.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    return newErrors
  }

  const handlePasswordReset = () => {
    const newErrors = validatePasswordForm()

    if (Object.keys(newErrors).length === 0) {
      setPasswordErrors({})
      setPasswordSuccess(true)
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setTimeout(() => setPasswordSuccess(false), 3000)
    } else {
      setPasswordErrors(newErrors)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Profile</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your personal information and preferences</p>
        </div>

        {/* Tabbed Navigation */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mb-8 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 px-6 py-4 font-medium text-sm sm:text-base transition-colors border-b-2 ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
              }`}
            >
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`flex-1 px-6 py-4 font-medium text-sm sm:text-base transition-colors border-b-2 ${
                activeTab === "categories"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 px-6 py-4 font-medium text-sm sm:text-base transition-colors border-b-2 ${
                activeTab === "password"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
              }`}
            >
              Password
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {/* Profile Info Tab */}
            {activeTab === "profile" && (
              <div className="space-y-8">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  {/* Avatar Display */}
                  <div className="relative flex-shrink-0">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar || "/placeholder.svg"}
                        alt="Profile avatar"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-slate-300 dark:border-slate-600">
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                    <button
                      onClick={() => setIsAvatarModalOpen(true)}
                      className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 p-3 rounded-full shadow-lg transition-colors"
                      aria-label="Change avatar"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{profile.name}</h2>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 justify-center sm:justify-start">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 justify-center sm:justify-start">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{new Date(profile.dob).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Details Section */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Profile Details</h3>
                    {!isEditingProfile && (
                      <button
                        onClick={() => {
                          setFormData(profile)
                          setIsEditingProfile(true)
                        }}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {isEditingProfile ? (
                    <div className="space-y-6">
                      {/* Name Field */}
                      <div>
                        <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                          className={`w-full px-3 py-2 bg-white dark:bg-slate-700 border rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.name ? "border-red-500" : "border-slate-200 dark:border-slate-600"
                          }`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </div>

                      {/* Date of Birth Field */}
                      <div>
                        <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={formData.dob}
                          onChange={(e) => setFormData((prev) => ({ ...prev, dob: e.target.value }))}
                          className={`w-full px-3 py-2 bg-white dark:bg-slate-700 border rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.dob ? "border-red-500" : "border-slate-200 dark:border-slate-600"
                          }`}
                        />
                        {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                      </div>

                      {/* About Me Field */}
                      <div>
                        <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-2">
                          About Me
                        </label>
                        <textarea
                          value={formData.aboutMe}
                          onChange={(e) => setFormData((prev) => ({ ...prev, aboutMe: e.target.value }))}
                          className={`w-full px-3 py-2 bg-white dark:bg-slate-700 border rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                            errors.aboutMe ? "border-red-500" : "border-slate-200 dark:border-slate-600"
                          }`}
                          placeholder="Tell us about yourself (optional)"
                          rows={4}
                          maxLength={500}
                        />
                        <div className="flex justify-between mt-2">
                          <div>{errors.aboutMe && <p className="text-red-500 text-sm">{errors.aboutMe}</p>}</div>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">{formData.aboutMe.length}/500</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors border border-slate-300 dark:border-slate-600"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Full Name</p>
                        <p className="text-slate-900 dark:text-white text-lg">{profile.name}</p>
                      </div>

                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Date of Birth</p>
                        <p className="text-slate-900 dark:text-white text-lg">
                          {new Date(profile.dob).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">About Me</p>
                        {profile.aboutMe ? (
                          <p className="text-slate-900 dark:text-white text-lg leading-relaxed">{profile.aboutMe}</p>
                        ) : (
                          <p className="text-slate-500 dark:text-slate-500 italic">No information provided yet</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === "categories" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Category Preferences</h3>
                  <button
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  >
                    {profile.categories.length > 0 ? "Edit" : "Add"} Categories
                  </button>
                </div>

                {profile.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {profile.categories.map((category) => (
                      <span
                        key={category}
                        className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-medium border border-blue-200 dark:border-blue-800"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 italic">
                    No categories selected yet. Add some to personalize your experience.
                  </p>
                )}
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div className="max-w-md">
                {passwordSuccess && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg">
                    Password changed successfully!
                  </div>
                )}

                <div className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 bg-white dark:bg-slate-700 border rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        passwordErrors.currentPassword ? "border-red-500" : "border-slate-200 dark:border-slate-600"
                      }`}
                      placeholder="Enter your current password"
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 bg-white dark:bg-slate-700 border rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        passwordErrors.newPassword ? "border-red-500" : "border-slate-200 dark:border-slate-600"
                      }`}
                      placeholder="Enter your new password (min 8 characters)"
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 bg-white dark:bg-slate-700 border rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        passwordErrors.confirmPassword ? "border-red-500" : "border-slate-200 dark:border-slate-600"
                      }`}
                      placeholder="Confirm your new password"
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Button */}
                  <button
                    onClick={handlePasswordReset}
                    className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onUpload={(croppedImage: string) => {
          setProfile((prev) => ({
            ...prev,
            avatar: croppedImage,
          }))
          setIsAvatarModalOpen(false)
        }}
      />

      {/* Category Preference Modal */}
      <CategoryPreferenceModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleCategoriesSave}
        initialCategories={profile.categories}
      />
    </div>
  )
}
