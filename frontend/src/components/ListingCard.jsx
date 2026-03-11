import { Link } from 'react-router-dom'
import { timeAgo } from '../utils/timeAgo'

export default function ListingCard({ listing }) {
  const { id, title, location, image_url, description, price, owner_username, created_at } = listing

  return (
    <Link to={`/listings/${id}`}>
      <div className="bg-[#111111] border border-[#1F2937] hover:border-[#F97316] rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer group">
        <div className="overflow-hidden h-48">
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = 'https://placehold.co/400x300/111111/F97316?text=No+Image' }}
          />
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
              <p className="text-[#D1D5DB] text-xs">by {owner_username}</p>
              <p className="text-[#6B7280] text-xs">Posted {timeAgo(created_at)}</p>
            </div>
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
    </Link>
  )
}
