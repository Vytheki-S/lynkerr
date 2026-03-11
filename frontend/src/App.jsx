import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ListingDetailPage from './pages/ListingDetailPage'
import CreateListingPage from './pages/CreateListingPage'
import EditListingPage from './pages/EditListingPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/listings/create" element={
            <ProtectedRoute><CreateListingPage /></ProtectedRoute>
          } />
          <Route path="/listings/:id/edit" element={
            <ProtectedRoute><EditListingPage /></ProtectedRoute>
          } />
          <Route path="/listings/:id" element={<ListingDetailPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
