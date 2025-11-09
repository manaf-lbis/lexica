import { Menu, Plus, Search, User, X, LogIn, Home, Compass, Bookmark, Settings, Flame, LogOut } from "lucide-react"
import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { useLogoutMutation } from "../api/authApi"
import { toast } from "sonner"
import { logout } from "../slice/authSlice"

export default function NavbarLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarHovered, setSidebarHovered] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [logoutCall] = useLogoutMutation()
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
      setSidebarOpen(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutCall({}).unwrap()
      dispatch(logout());
      setUserMenuOpen(false)
      navigate("/")
      toast.success( "Successfully signed out.")
    } catch (e : any){
      toast.error(e.data?.message || "Failed to sign out. Please try again.")
    }


  }

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [sidebarOpen])

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Compass, label: "Explore", path: "/explore" },
    { icon: Flame, label: "Trending", path: "/trending" },
    ...(isAuthenticated
      ? [
        { icon: Bookmark, label: "Saved", path: "/saved" },
        { icon: Settings, label: "Settings", path: "/settings" },
      ]
      : []),
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="flex h-screen bg-slate-950">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:relative md:flex flex-col h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 z-50 md:hover:w-64 md:group ${sidebarHovered ? "md:w-64" : "md:w-20"
          } ${sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg shrink-0 shadow-lg">
              ✎
            </div>
            <span
              className={`text-sm font-bold bg-linear-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent transition-all ${sidebarHovered ? "md:block md:opacity-100 md:w-auto" : "md:hidden md:opacity-0 md:w-0"
                } whitespace-nowrap overflow-hidden`}
            >
              Lexica
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${isActive(item.path)
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              title={!sidebarHovered ? item.label : ""}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className={`text-sm font-medium whitespace-nowrap ${sidebarHovered ? "md:block" : "md:hidden"}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-800 space-y-3">
          {!loading && isAuthenticated && (
            <Link
              to="/write"
              className={`flex items-center justify-center md:justify-start gap-2 px-4 py-3 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg shadow-blue-600/30 group`}
              title={!sidebarHovered ? "Write" : ""}
              onClick={() => setSidebarOpen(false)}
            >
              <Plus className="w-5 h-5 shrink-0" />
              <span className={`text-sm ${sidebarHovered ? "md:block" : "md:hidden"}`}>Write</span>
            </Link>
          )}
          {!loading && !isAuthenticated && (
            <Link
              to="/login"
              className={`flex items-center justify-center md:justify-start gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all duration-200 font-semibold`}
              title={!sidebarHovered ? "Login" : ""}
              onClick={() => setSidebarOpen(false)}
            >
              <LogIn className="w-5 h-5 shrink-0" />
              <span className={`text-sm ${sidebarHovered ? "md:block" : "md:hidden"}`}>Login</span>
            </Link>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
          <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 mx-auto max-w-7xl w-full">
            {/* Left section: Menu & Brand (mobile only) */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
                title="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link to="/" className="flex items-center gap-2 shrink-0">
                <div className="w-6 h-6 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-lg">
                  ✎
                </div>
                <span
                  className={`text-sm font-bold bg-linear-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent transition-all ${sidebarHovered ? "md:block md:opacity-100 md:w-auto" : "md:hidden md:opacity-0 md:w-0"
                    } whitespace-nowrap overflow-hidden`}
                >
                  Lexica
                </span>
              </Link>
            </div>

            {/* Center section: Search bar - now properly centered on desktop */}
            <div className="hidden md:flex flex-1 items-center justify-center px-4">
              <form onSubmit={handleSearch} className="w-full max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </form>
            </div>

            {/* Mobile search - below header on smaller screens */}
            <form onSubmit={handleSearch} className="md:hidden flex-1 max-w-xs">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </form>

            {/* Right section: User menu & Login button */}
            <div className="flex items-center gap-3 shrink-0">
              {!loading && isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
                    title="User menu"
                  >
                    <User className="w-5 h-5" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-200 hover:bg-slate-700 transition-colors first:rounded-t-lg"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-200 hover:bg-slate-700 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm font-medium">Settings</span>
                      </Link>
                      <Link
                        to="/change-password"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-200 hover:bg-slate-700 transition-colors border-t border-slate-700"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm font-medium">Change Password</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-200 hover:bg-red-600/20 hover:text-red-400 transition-colors last:rounded-b-lg border-t border-slate-700"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm whitespace-nowrap"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
