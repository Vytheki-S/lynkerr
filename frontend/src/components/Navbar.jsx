// TODO: implement full Navbar with orange-black branding
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <nav className="bg-[#0A0A0A] border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black text-orange-500">LYNKERR</Link>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/listings/create" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                + New Listing
              </Link>
              <button onClick={logout} className="text-gray-400 hover:text-white text-sm transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-400 hover:text-white text-sm transition">Login</Link>
              <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
