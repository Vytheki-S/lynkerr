import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { timeAgo } from '../utils/timeAgo'
import { toggleLike } from '../api/listingsApi'

export default function ListingCard({ listing }) {
  const { id, title, location, image_url, description, price, owner_username, created_at, rating, category } = listing
  const [liked, setLiked] = useState(listing.is_liked || false)
  const [likeCount, setLikeCount] = useState(listing.like_count || 0)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  async function handleLike(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      const res = await toggleLike(id)
      setLiked(res.data.liked)
      setLikeCount(res.data.like_count)
    } catch {
      // silently ignore
    }
  }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate(`/listings/${id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/listings/${id}`)}
      className="bg-[#111111] border border-[#1F2937] hover:border-[#F97316] rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer group"
    >
        <div className="relative overflow-hidden h-52">
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = 'https://placehold.co/400x300/111111/F97316?text=No+Image' }}
          />
          {/* Star rating badge */}
          {rating && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#0A0A0A]/80 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1.5 rounded-full">
              <span className="text-yellow-400">★</span>
              <span>{parseFloat(rating).toFixed(1)}</span>
            </div>
          )}
          {/* Category tag */}
          {category && (
            <div className="absolute top-3 left-3 bg-[#0A0A0A]/70 backdrop-blur-sm text-[#F97316] text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
              {category}
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-white font-semibold text-lg leading-tight mb-2 line-clamp-1">{title}</h3>
          <p className="flex items-center gap-1 mb-3">
            <span className="text-[#F97316]">📍</span>
            <span className="text-[#F97316] text-sm">{location}</span>
          </p>
          <p className="text-[#6B7280] text-sm line-clamp-2 mb-4">{description}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#D1D5DB] text-xs">
                by{' '}
                <Link
                  to={`/profile/${owner_username}`}
                  className="text-[#F97316] hover:text-[#EA580C] transition font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  {owner_username}
                </Link>
              </p>
              <p className="text-[#6B7280] text-xs">Posted {timeAgo(created_at)}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Like button */}
              <button
                onClick={handleLike}
                className="flex items-center gap-1 transition"
              >
                <span className="text-sm">{liked ? '❤️' : '🤍'}</span>
                <span className={`text-xs ${liked ? 'text-[#F97316]' : 'text-[#6B7280]'}`}>
                  {likeCount}
                </span>
              </button>

              {/* Price badge */}
              {price ? (
                <span className="bg-[#F97316] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  ${price}
                </span>
              ) : (
                <span className="bg-[#1C1C1C] text-[#6B7280] text-xs px-3 py-1 rounded-full border border-[#1F2937]">
                  Free
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}
