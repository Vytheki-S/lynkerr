import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ListingForm from '../components/ListingForm'
import { createListing } from '../api/listingsApi'

export default function CreateListingPage() {
  const [form, setForm] = useState({ title: '', location: '', image_url: '', description: '', price: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createListing(form)
      navigate('/')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-white mb-2">New <span className="text-orange-500">Experience</span></h1>
        <p className="text-gray-400 mb-8">Share your experience with travelers worldwide</p>
        <ListingForm form={form} setForm={setForm} onSubmit={handleSubmit} loading={loading} submitLabel="🚀 Publish Experience" />
      </div>
    </div>
  )
}
