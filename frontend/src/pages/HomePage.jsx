import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getListings } from '../api/listingsApi'
import ListingCard from '../components/ListingCard'

function SkeletonCard() {
  return (
    <div className="bg-[#1C1C1C] animate-pulse rounded-2xl h-72" />
  )
}

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const [listings, setListings]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [search, setSearch]           = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount]   = useState(0)
  const [nextPage, setNextPage]       = useState(null)
  const [prevPage, setPrevPage]       = useState(null)

  useEffect(() => {
    fetchListings()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search])

  async function fetchListings() {
    setLoading(true)
    setError('')
    try {
      const res = await getListings({ page: currentPage, search })
      setListings(res.data.results)
      setTotalCount(res.data.count)
      setNextPage(res.data.next)
      setPrevPage(res.data.previous)
    } catch {
      setError('Failed to load listings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleSearch() {
    setSearch(searchInput)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* Hero */}
      <section className="bg-[#111111] border-b border-[#1F2937] py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Discover <span className="text-[#F97316]">Unique</span> Travel Experiences
          </h1>
          <p className="text-[#6B7280] text-lg mb-8">
            Find extraordinary local experiences from guides around the world
          </p>
          <div className="flex gap-3 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search by title or location..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-[#1C1C1C] border border-[#1F2937] focus:border-[#F97316] focus:outline-none text-white rounded-xl px-5 py-4 flex-1 placeholder-[#6B7280]"
            />
            <button
              onClick={handleSearch}
              className="bg-[#F97316] hover:bg-[#EA580C] text-white px-6 py-4 rounded-xl font-semibold transition"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Feed */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-white font-bold text-xl">
            All Experiences
            <span className="text-[#6B7280] font-normal text-base ml-2">({totalCount} listed)</span>
          </h2>
          {search && (
            <button
              onClick={() => { setSearch(''); setSearchInput(''); setCurrentPage(1) }}
              className="text-[#F97316] text-sm hover:text-[#EA580C] cursor-pointer"
            >
              Clear search ✕
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-[#EF4444] mb-4">{error}</p>
            <button
              onClick={fetchListings}
              className="bg-[#F97316] text-white px-6 py-3 rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && listings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🌍</p>
            <h3 className="text-white font-bold text-xl mb-2">No experiences yet</h3>
            <p className="text-[#6B7280] mb-6">Be the first to share a travel experience!</p>
            {isAuthenticated ? (
              <Link
                to="/listings/create"
                className="bg-[#F97316] hover:bg-[#EA580C] text-white px-6 py-3 rounded-lg font-semibold"
              >
                + Post First Experience
              </Link>
            ) : (
              <Link
                to="/register"
                className="bg-[#F97316] hover:bg-[#EA580C] text-white px-6 py-3 rounded-lg font-semibold"
              >
                Get Started Free
              </Link>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && listings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalCount > 9 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              disabled={!prevPage}
              onClick={() => setCurrentPage((p) => p - 1)}
              className={!prevPage
                ? 'opacity-40 cursor-not-allowed border border-[#1F2937] text-[#6B7280] px-6 py-3 rounded-xl text-sm'
                : 'border border-[#1F2937] hover:border-[#F97316] text-[#D1D5DB] px-6 py-3 rounded-xl text-sm transition'}
            >
              ← Previous
            </button>
            <span className="bg-[#F97316] text-white px-6 py-3 rounded-xl text-sm font-medium">
              Page {currentPage}
            </span>
            <button
              disabled={!nextPage}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={!nextPage
                ? 'opacity-40 cursor-not-allowed border border-[#1F2937] text-[#6B7280] px-6 py-3 rounded-xl text-sm'
                : 'border border-[#1F2937] hover:border-[#F97316] text-[#D1D5DB] px-6 py-3 rounded-xl text-sm transition'}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
