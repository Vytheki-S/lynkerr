import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as loginApi } from '../api/authApi'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await loginApi({ username, password })
      const { access, refresh } = res.data
      const userId = JSON.parse(atob(access.split('.')[1])).user_id
      auth.login({ access, refresh, username, userId })
      navigate('/')
    } catch {
      setError('Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[#F97316]">LYNKERR</h1>
          <p className="text-[#9CA3AF] text-sm mt-2">Discover unique travel experiences</p>
        </div>

        <div className="bg-[#111111] border border-[#1F2937] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Welcome Back 👋</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-[#EF4444] rounded-lg px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-[#D1D5DB] text-sm mb-1 block">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#1C1C1C] border border-[#1F2937] focus:border-[#F97316] focus:outline-none text-white rounded-lg px-4 py-3 w-full transition-colors placeholder-[#6B7280]"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-[#D1D5DB] text-sm mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#1C1C1C] border border-[#1F2937] focus:border-[#F97316] focus:outline-none text-white rounded-lg px-4 py-3 w-full transition-colors placeholder-[#6B7280]"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#F97316] hover:bg-[#EA580C] text-white w-full py-3 rounded-lg font-semibold mt-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-[#9CA3AF] text-sm mt-6">
            No account yet?{' '}
            <Link to="/register" className="text-[#F97316] hover:text-[#EA580C] transition-colors">
              Register Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
