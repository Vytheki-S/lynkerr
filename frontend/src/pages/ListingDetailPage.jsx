import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getListing, deleteListing } from '../api/listingsApi'
import { timeAgo } from '../utils/timeAgo'

export default function ListingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [listing, setListing]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchListing()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function fetchListing() {
    setLoading(true)
    setError('')
    try {
      const res = await getListing(id)
      setListing(res.data)
    } catch {
      setError('Listing not found.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    setDeleting(true)
    try {
      await deleteListing(id)
      navigate('/')
    } catch {
      alert('Failed to delete. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const isOwner = user && listing && user.username === listing.owner_username

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316] mx-auto mb-4" />
          <p className="text-[#6B7280]">Loading experience...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#EF4444] text-xl mb-4">{error}</p>
          <Link to="/" className="text-[#F97316] hover:text-[#EA580C]">← Back to feed</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Back link */}
        <Link to="/" className="text-[#F97316] hover:text-[#EA580C] text-sm transition mb-6 inline-block">
          ← Back to all experiences
        </Link>

        {/* Hero image */}
        <div className="rounded-2xl overflow-hidden h-80 sm:h-96 mb-8">
          <img
            src={listing.image_url}
            alt={listing.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://placehold.co/800x400/111111/F97316?text=No+Image' }}
          />
        </div>

        {/* Title and price */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-3xl sm:text-4xl font-black text-white">{listing.title}</h1>
          {listing.price ? (
            <div className="bg-[#F97316] text-white text-xl font-black px-6 py-3 rounded-2xl whitespace-nowrap">
              ${listing.price}
            </div>
          ) : (
            <div className="bg-[#1C1C1C] border border-[#1F2937] text-green-400 text-base font-semibold px-6 py-3 rounded-2xl">
              Free
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-[#F97316] text-lg">📍</span>
          <span className="text-[#F97316] text-lg font-medium">{listing.location}</span>
        </div>

        {/* Description */}
        <div className="bg-[#111111] border border-[#1F2937] rounded-2xl p-6 mb-6">
          <h3 className="text-[#F97316] font-semibold uppercase text-sm tracking-wider mb-4">
            About This Experience
          </h3>
          <p className="text-[#D1D5DB] leading-relaxed">{listing.description}</p>
        </div>

        {/* Meta */}
        <div className="bg-[#111111] border border-[#1F2937] rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#6B7280] text-sm">Listed by</p>
              <p className="text-white font-semibold">{listing.owner_username}</p>
            </div>
            <div className="text-right">
              <p className="text-[#6B7280] text-sm">Posted {timeAgo(listing.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="flex gap-4">
            <Link
              to={`/listings/${id}/edit`}
              className="flex-1 text-center border border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white py-3 rounded-xl font-semibold transition"
            >
              ✏️ Edit Listing
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : '🗑️ Delete Listing'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
