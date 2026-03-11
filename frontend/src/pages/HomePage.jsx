import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getListings } from '../api/listingsApi'
import ListingCard from '../components/ListingCard'

function SkeletonCard() {
  return (
    <div className="bg-[#111111] border border-[#1F2937] animate-pulse rounded-2xl overflow-hidden">
      <div className="h-48 bg-[#1C1C1C]" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-[#1C1C1C] rounded w-3/4" />
        <div className="h-4 bg-[#1C1C1C] rounded w-1/2" />
        <div className="h-4 bg-[#1C1C1C] rounded w-full" />
        <div className="h-4 bg-[#1C1C1C] rounded w-2/3" />
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-[#1F2937]">
          <div className="h-4 bg-[#1C1C1C] rounded w-1/4" />
          <div className="h-4 bg-[#1C1C1C] rounded w-1/4" />
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  const [listings,    setListings]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [search,      setSearch]      = useState('')
  const [page,        setPage]        = useState(1)
  const [nextUrl,     setNextUrl]     = useState(null)
  const [prevUrl,     setPrevUrl]     = useState(null)
  const [totalCount,  setTotalCount]  = useState(0)

  // Debounce: 400ms after user stops typing → update search + reset page
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Fetch whenever search or page changes
  useEffect(() => {
    fetchListings()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page])

  const fetchListings = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getListings({ page, search })
      setListings(res.data.results)
      setNextUrl(res.data.next)
      setPrevUrl(res.data.previous)
      setTotalCount(res.data.count)
    } catch {
      setError('Failed to load listings. Please try again.')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search])

  function clearSearch() {
    setSearchInput('')
    setSearch('')
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* ── HERO ── */}
      <div className="bg-[#111111] border-b border-[#1F2937] py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge pill */}
          <div className="inline-flex items-center gap-2 bg-[#1C1C1C] border border-[#1F2937] rounded-full px-4 py-1.5 text-sm text-[#9CA3AF] mb-6">
            <span>🌍</span>
            <span>Travel Experience Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Discover <span className="text-[#F97316]">Travel Experiences</span>
          </h1>
          <p className="text-[#6B7280] text-lg mb-8">
            Connect with local guides and experience operators from around the world
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search experiences, locations..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-[#1C1C1C] border border-[#1F2937] focus:border-[#F97316] focus:outline-none text-white rounded-xl px-5 py-4 pr-12 w-full placeholder-[#6B7280] text-base"
              />
              {searchInput ? (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white text-lg"
                >
                  ✕
                </button>
              ) : (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] text-lg pointer-events-none">
                  🔍
                </span>
              )}
            </div>

            {/* Result count when searching */}
            {search && (
              <p className="text-[#6B7280] text-sm mt-3 text-center">
                {loading
                  ? 'Searching...'
                  : `Showing ${totalCount} result${totalCount !== 1 ? 's' : ''} for "${search}"`
                }
              </p>
            )}

            {/* Stats row when not searching */}
            {!search && (
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-[#6B7280]">
                <span className="flex items-center gap-1">
                  <span className="text-[#F97316] font-bold">{totalCount}+</span> Experiences
                </span>
                <span className="w-px h-4 bg-[#1F2937]" />
                <span>🌍 Worldwide</span>
                <span className="w-px h-4 bg-[#1F2937]" />
                <span>Free To Browse</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── FEED ── */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Feed header row */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-white font-bold text-xl">
            {search ? `Results for "${search}"` : 'All Experiences'}
            <span className="text-[#6B7280] font-normal text-base ml-2">({totalCount} listed)</span>
          </h2>
          {search && (
            <button
              onClick={clearSearch}
              className="text-[#F97316] text-sm hover:text-[#EA580C] transition"
            >
              Clear search ✕
            </button>
          )}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">⚠️</p>
            <p className="text-[#EF4444] text-lg mb-2">{error}</p>
            <p className="text-[#6B7280] text-sm mb-6">Check your connection and try again</p>
            <button
              onClick={fetchListings}
              className="bg-[#F97316] hover:bg-[#EA580C] text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && listings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">{search ? '🔍' : '🌍'}</p>
            <h3 className="text-white font-bold text-xl mb-2">
              {search ? `No results for "${search}"` : 'No experiences yet'}
            </h3>
            <p className="text-[#6B7280] mb-8">
              {search
                ? 'Try a different search term or location'
                : 'Be the first to share a travel experience!'}
            </p>
            {search ? (
              <button
                onClick={clearSearch}
                className="border border-[#1F2937] hover:border-[#F97316] text-[#D1D5DB] px-6 py-3 rounded-xl transition mr-3"
              >
                Clear Search
              </button>
            ) : isAuthenticated ? (
              <Link
                to="/listings/create"
                className="bg-[#F97316] hover:bg-[#EA580C] text-white px-8 py-3 rounded-xl font-semibold transition"
              >
                + Post First Experience
              </Link>
            ) : (
              <Link
                to="/register"
                className="bg-[#F97316] hover:bg-[#EA580C] text-white px-8 py-3 rounded-xl font-semibold transition"
              >
                Get Started Free
              </Link>
            )}
          </div>
        )}

        {/* Listings grid */}
        {!loading && listings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalCount > 9 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={prevUrl === null}
              className={
                prevUrl === null
                  ? 'px-6 py-3 rounded-xl border text-sm font-medium border-[#1F2937] text-[#6B7280] opacity-40 cursor-not-allowed'
                  : 'px-6 py-3 rounded-xl border text-sm font-medium border-[#1F2937] text-[#D1D5DB] hover:border-[#F97316] hover:text-[#F97316] transition'
              }
            >
              ← Previous
            </button>

            <div className="flex items-center gap-2">
              <span className="bg-[#F97316] text-white text-sm font-bold px-5 py-3 rounded-xl">
                Page {page}
              </span>
              {totalCount > 0 && (
                <span className="text-[#6B7280] text-sm">
                  of {Math.ceil(totalCount / 9)}
                </span>
              )}
            </div>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={nextUrl === null}
              className={
                nextUrl === null
                  ? 'px-6 py-3 rounded-xl border text-sm font-medium border-[#1F2937] text-[#6B7280] opacity-40 cursor-not-allowed'
                  : 'px-6 py-3 rounded-xl border text-sm font-medium border-[#1F2937] text-[#D1D5DB] hover:border-[#F97316] hover:text-[#F97316] transition'
              }
            >
              Next →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
