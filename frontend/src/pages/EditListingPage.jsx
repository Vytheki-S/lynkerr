import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ListingForm from '../components/ListingForm'
import { getListing, updateListing } from '../api/listingsApi'
import { useAuth } from '../context/AuthContext'

export default function EditListingPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', location: '', image_url: '', description: '', price: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getListing(id).then(res => {
      const l = res.data
      if (user?.username !== l.creator_name) navigate('/')
      setForm({ title: l.title, location: l.location, image_url: l.image_url, description: l.description, price: l.price || '' })
    })
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateListing(id, form)
      navigate(`/listings/${id}`)
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
        <h1 className="text-3xl font-black text-white mb-2">Edit <span className="text-orange-500">Experience</span></h1>
        <p className="text-gray-400 mb-8">Update your listing details</p>
        <ListingForm form={form} setForm={setForm} onSubmit={handleSubmit} loading={loading} submitLabel="💾 Save Changes" />
      </div>
    </div>
  )
}
