import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logout as logoutApi } from '../api/authApi'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    const refresh = localStorage.getItem('refresh')
    try { await logoutApi(refresh) } catch { /* token already expired is fine */ }
    logout()
    navigate('/login')
  }

  const avatarLetter = user?.username?.[0]?.toUpperCase() ?? '?'

  const authLinks = isAuthenticated ? (
    <>
      <Link
        to={`/profile/${user?.username}`}
        className="flex items-center gap-2 hover:opacity-80 transition"
      >
        <div className="w-8 h-8 rounded-full bg-[#F97316] flex items-center justify-center text-white text-sm font-bold select-none">
          {avatarLetter}
        </div>
        <span className="text-[#9CA3AF] text-sm hover:text-[#F97316] transition">{user?.username}</span>
      </Link>
      <Link
        to="/listings/create"
        className="bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2 rounded-lg text-sm font-medium"
      >
        + New Listing
      </Link>
      <button
        onClick={handleLogout}
        className="border border-[#1F2937] hover:border-[#F97316] text-[#D1D5DB] px-4 py-2 rounded-lg text-sm"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link to="/login" className="text-[#D1D5DB] hover:text-[#F97316] text-sm">
        Login
      </Link>
      <Link
        to="/register"
        className="bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2 rounded-lg text-sm font-medium"
      >
        Get Started
      </Link>
    </>
  )

  return (
    <nav className="bg-[#111111] border-b border-[#1F2937] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1">
          <span className="text-[#F97316] font-black text-xl tracking-tight">LYNKERR</span>
          <span className="w-2 h-2 rounded-full bg-[#F97316] mb-3 opacity-80" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          {authLinks}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-[#D1D5DB] text-2xl p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#111111] border-t border-[#1F2937] px-6 py-4 flex flex-col gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to={`/profile/${user?.username}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 pb-3 border-b border-[#1F2937] hover:opacity-80 transition"
              >
                <div className="w-10 h-10 rounded-full bg-[#F97316] flex items-center justify-center text-white font-bold select-none">
                  {avatarLetter}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{user?.username}</p>
                  <p className="text-[#6B7280] text-xs">View Profile →</p>
                </div>
              </Link>
              <Link
                to="/listings/create"
                onClick={() => setMobileOpen(false)}
                className="bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
              >
                + New Listing
              </Link>
              <button
                onClick={() => { setMobileOpen(false); handleLogout() }}
                className="border border-[#1F2937] hover:border-[#F97316] text-[#D1D5DB] px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="text-[#D1D5DB] hover:text-[#F97316] text-sm transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
