// TODO: implement full feed page with search and pagination
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ListingCard from '../components/ListingCard'
import { getListings } from '../api/listingsApi'

export default function HomePage() {
  const [listings, setListings] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await getListings(page, search)
        setListings(res.data.results)
        setTotalPages(Math.ceil(res.data.count / 9))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [page, search])

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <div className="bg-gradient-to-b from-gray-900 to-[#0A0A0A] py-16 px-4 text-center">
        <h1 className="text-5xl font-black text-white mb-4">Discover <span className="text-orange-500">Unique</span> Experiences</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">Find extraordinary local experiences from guides around the world</p>
        <div className="max-w-xl mx-auto relative">
          <input type="text" placeholder="Search by title or location..."
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-orange-500 placeholder-gray-500"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <p className="text-gray-400 text-center py-20">Loading experiences...</p>
        ) : listings.length === 0 ? (
          <p className="text-gray-400 text-center py-20">No experiences found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-12">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-6 py-2 border border-gray-700 text-gray-400 rounded-lg hover:border-orange-500 hover:text-orange-500 transition text-sm disabled:opacity-30">
              Previous
            </button>
            <span className="px-6 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium">{page}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-6 py-2 border border-gray-700 text-gray-400 rounded-lg hover:border-orange-500 hover:text-orange-500 transition text-sm disabled:opacity-30">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
