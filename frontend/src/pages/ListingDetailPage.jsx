// TODO: implement full detail page
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getListing, deleteListing } from '../api/listingsApi'
import { useAuth } from '../context/AuthContext'
import timeAgo from '../utils/timeAgo'

export default function ListingDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)

  useEffect(() => {
    getListing(id).then(res => setListing(res.data)).catch(() => navigate('/'))
  }, [id])

  const handleDelete = async () => {
    if (window.confirm('Delete this listing?')) {
      await deleteListing(id)
      navigate('/')
    }
  }

  if (!listing) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>

  const isOwner = user?.username === listing.creator_name

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="rounded-2xl overflow-hidden h-80 mb-8">
          <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">{listing.title}</h1>
            <p className="text-orange-400">📍 {listing.location}</p>
          </div>
          <div className="bg-orange-500 text-white text-2xl font-black px-6 py-3 rounded-xl">
            {listing.price ? `$${listing.price}` : 'Free'}
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h3 className="text-orange-500 font-semibold mb-3 uppercase text-sm tracking-wider">About This Experience</h3>
          <p className="text-gray-300 leading-relaxed">{listing.description}</p>
        </div>
        <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div>
            <p className="text-gray-500 text-sm">Listed by</p>
            <p className="text-white font-semibold">{listing.creator_name}</p>
          </div>
          <p className="text-gray-600 text-sm">{timeAgo(listing.created_at)}</p>
        </div>
        {isOwner && (
          <div className="flex gap-4 mt-6">
            <Link to={`/listings/${listing.id}/edit`}
              className="flex-1 text-center border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white py-3 rounded-xl font-semibold transition">
              Edit Listing
            </Link>
            <button onClick={handleDelete}
              className="flex-1 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white py-3 rounded-xl font-semibold transition">
              Delete Listing
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
