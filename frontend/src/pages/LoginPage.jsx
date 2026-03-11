// TODO: implement full login page
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as loginApi } from '../api/authApi'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await loginApi(form)
      login(res.data, { username: form.username })
      navigate('/')
    } catch {
      setError('Invalid username or password.')
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-orange-500">LYNKERR</h1>
          <p className="text-gray-400 mt-2 text-sm">Discover unique travel experiences</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>}
          <input className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-orange-500 placeholder-gray-500"
            placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
          <input className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-orange-500 placeholder-gray-500"
            placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
          <button onClick={handleSubmit} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition">Sign In</button>
          <p className="text-center text-gray-400 text-sm mt-6">No account? <Link to="/register" className="text-orange-500 hover:text-orange-400">Register Free</Link></p>
        </div>
      </div>
    </div>
  )
}
