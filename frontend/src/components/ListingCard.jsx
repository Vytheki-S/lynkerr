// TODO: implement full listing card with orange-black branding
import { Link } from 'react-router-dom'
import timeAgo from '../utils/timeAgo'

export default function ListingCard({ listing }) {
  return (
    <Link to={`/listings/${listing.id}`}>
      <div className="bg-gray-900 border border-gray-800 rounded-xl hover:border-orange-500 transition overflow-hidden group cursor-pointer">
        <div className="relative h-52 overflow-hidden">
          <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
          {listing.price && (
            <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              ${listing.price}
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-white font-bold text-lg group-hover:text-orange-400 transition">{listing.title}</h3>
          <p className="text-orange-400 text-sm mt-1">📍 {listing.location}</p>
          <p className="text-gray-400 text-sm mt-2 line-clamp-2">{listing.description}</p>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
            <span className="text-gray-500 text-xs">By <span className="text-gray-300">{listing.creator_name}</span></span>
            <span className="text-gray-600 text-xs">{timeAgo(listing.created_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
