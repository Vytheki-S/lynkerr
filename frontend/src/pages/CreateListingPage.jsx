import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createListing } from '../api/listingsApi'
import ListingForm from '../components/ListingForm'

export default function CreateListingPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(formData) {
    setLoading(true)
    setError('')
    try {
      await createListing(formData)
      navigate('/')
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') {
        const firstKey = Object.keys(data)[0]
        const msg = data[firstKey]
        setError(Array.isArray(msg) ? msg[0] : msg)
      } else {
        setError('Failed to create listing. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-2xl mx-auto px-6 py-10">

        <Link to="/" className="text-[#6B7280] hover:text-[#F97316] text-sm transition mb-8 inline-block">
          ← Back to feed
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">
            Share Your <span className="text-[#F97316]">Experience</span>
          </h1>
          <p className="text-[#6B7280]">Fill in the details and publish your listing to the world</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-[#EF4444] rounded-xl px-5 py-4 mb-6 text-sm flex items-center gap-3">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="bg-[#1C1C1C] border border-[#1F2937] rounded-xl px-5 py-3 mb-6 flex items-start gap-2 text-sm">
          <span>💡</span>
          <span className="text-[#9CA3AF]">Tip: Use a high quality image URL for maximum engagement</span>
        </div>

        <div className="bg-[#111111] border border-[#1F2937] rounded-2xl p-8">
          <ListingForm
            initialValues={{}}
            onSubmit={handleSubmit}
            loading={loading}
            buttonText="🚀 Publish Experience"
          />
        </div>

      </div>
    </div>
  )
}
