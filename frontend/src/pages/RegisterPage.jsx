import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register as registerApi } from '../api/authApi'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      await registerApi({ username, email, password, password2 })
      navigate('/login')
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data)
      } else {
        setErrors({ non_field_errors: ['Registration failed. Is the server running?'] })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[#F97316]">LYNKERR</h1>
          <p className="text-[#9CA3AF] text-sm mt-2">Share your travel experiences</p>
        </div>

        <div className="bg-[#111111] border border-[#1F2937] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
          <p className="text-[#9CA3AF] text-sm mb-6">Join thousands of experience providers</p>

          {errors.non_field_errors && (
            <div className="bg-red-500/10 border border-red-500/30 text-[#EF4444] rounded-lg px-4 py-3 mb-4 text-sm">
              {errors.non_field_errors.join(' ')}
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
                placeholder="Choose a username"
                required
              />
              {errors.username && <p className="text-[#EF4444] text-xs mt-1">{[].concat(errors.username).join(' ')}</p>}
            </div>

            <div className="mb-4">
              <label className="text-[#D1D5DB] text-sm mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1C1C1C] border border-[#1F2937] focus:border-[#F97316] focus:outline-none text-white rounded-lg px-4 py-3 w-full transition-colors placeholder-[#6B7280]"
                placeholder="your@email.com"
                required
              />
              {errors.email && <p className="text-[#EF4444] text-xs mt-1">{[].concat(errors.email).join(' ')}</p>}
            </div>

            <div className="mb-4">
              <label className="text-[#D1D5DB] text-sm mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#1C1C1C] border border-[#1F2937] focus:border-[#F97316] focus:outline-none text-white rounded-lg px-4 py-3 w-full transition-colors placeholder-[#6B7280]"
                placeholder="Minimum 8 characters"
                required
              />
              {errors.password && <p className="text-[#EF4444] text-xs mt-1">{[].concat(errors.password).join(' ')}</p>}
            </div>

            <div className="mb-4">
              <label className="text-[#D1D5DB] text-sm mb-1 block">Confirm Password</label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="bg-[#1C1C1C] border border-[#1F2937] focus:border-[#F97316] focus:outline-none text-white rounded-lg px-4 py-3 w-full transition-colors placeholder-[#6B7280]"
                placeholder="Repeat your password"
                required
              />
              {errors.password2 && <p className="text-[#EF4444] text-xs mt-1">{[].concat(errors.password2).join(' ')}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#F97316] hover:bg-[#EA580C] text-white w-full py-3 rounded-lg font-semibold mt-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-[#9CA3AF] text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#F97316] hover:text-[#EA580C] transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
