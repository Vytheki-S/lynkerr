import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  const login = (tokens, userData) => {
    window.__accessToken = tokens.access
    setAccessToken(tokens.access)
    setUser(userData)
    localStorage.setItem('refresh', tokens.refresh)
  }

  const logout = () => {
    window.__accessToken = null
    setAccessToken(null)
    setUser(null)
    localStorage.removeItem('refresh')
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
