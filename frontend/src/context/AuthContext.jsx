import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  const login = ({ access, refresh, username, userId }) => {
    window.__accessToken = access
    setAccessToken(access)
    setUser({ username, id: userId })
    localStorage.setItem('refresh', refresh)
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
