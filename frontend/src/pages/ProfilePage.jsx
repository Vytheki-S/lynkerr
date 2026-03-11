import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axiosInstance'
import ListingCard from '../components/ListingCard'

export default function ProfilePage() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username])

  async function fetchProfile() {
    setLoading(true)
    setError('')
    try {
      const [profileRes, listingsRes] = await Promise.all([
        api.get(`/auth/users/${username}/`),
        api.get(`/auth/users/${username}/listings/`),
      ])
      setProfile(profileRes.data)
      setListings(listingsRes.data)
    } catch {
      setError('User not found.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316] mx-auto" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#EF4444] text-xl mb-4">{error}</p>
          <Link to="/" className="text-[#F97316] hover:text-[#EA580C] transition">← Back to feed</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Profile header card */}
        <div className="bg-[#111111] border border-[#1F2937] rounded-2xl p-8 mb-10">
          <div className="flex items-center gap-6">

            {/* Avatar */}
            <div className="w-20 h-20 bg-[#F97316] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-3xl font-black">
                {profile.username.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Info */}
            <div>
              <h1 className="text-3xl font-black text-white mb-1">{profile.username}</h1>
              <p className="text-[#6B7280] text-sm mb-4">
                Member since {new Date(profile.date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>

              {/* Stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-[#F97316] font-black text-2xl">{profile.listing_count}</p>
                  <p className="text-[#6B7280] text-sm">Experiences</p>
                </div>
                <div className="text-center">
                  <p className="text-[#F97316] font-black text-2xl">🌍</p>
                  <p className="text-[#6B7280] text-sm">Provider</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listings section */}
        <div>
          <h2 className="text-white font-bold text-xl mb-6">
            Experiences by {profile.username}
          </h2>

          {listings.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🌍</p>
              <p className="text-white font-bold text-lg mb-2">No experiences yet</p>
              <p className="text-[#6B7280]">{profile.username} hasn&apos;t posted anything yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
