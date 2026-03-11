import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getListing, updateListing } from '../api/listingsApi'
import ListingForm from '../components/ListingForm'

export default function EditListingPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { user }   = useAuth()

  const [listing,  setListing]  = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    fetchListing()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchListing() {
    try {
      const res = await getListing(id)
      if (res.data.owner_username !== user.username) {
        navigate('/')
        return
      }
      setListing(res.data)
    } catch {
      navigate('/')
    } finally {
      setFetching(false)
    }
  }

  async function handleSubmit(formData) {
    setLoading(true)
    setError('')
    try {
      await updateListing(id, formData)
      navigate(`/listings/${id}`)
    } catch {
      setError('Failed to update listing. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316] mx-auto mb-4" />
          <p className="text-[#6B7280]">Loading listing...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-2xl mx-auto px-6 py-10">

        <Link
          to={`/listings/${id}`}
          className="text-[#F97316] hover:text-[#EA580C] text-sm transition mb-8 inline-block"
        >
          ← Back to listing
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">
            Edit <span className="text-[#F97316]">Experience</span>
          </h1>
          <p className="text-[#6B7280]">Update your listing details below</p>
        </div>

        <div className="bg-[#1C1C1C] border border-[#1F2937] rounded-xl px-5 py-4 mb-6">
          <p className="text-[#6B7280] text-xs mb-1">Editing:</p>
          <p className="text-white font-semibold">{listing.title}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-[#EF4444] rounded-xl px-5 py-4 mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="bg-[#111111] border border-[#1F2937] rounded-2xl p-8">
          <ListingForm
            initialValues={listing}
            onSubmit={handleSubmit}
            loading={loading}
            buttonText="💾 Save Changes"
          />
        </div>

      </div>
    </div>
  )
}
