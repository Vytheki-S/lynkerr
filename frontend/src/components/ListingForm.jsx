import { useState, useEffect } from 'react'

const CATEGORIES = [
  { value: 'adventure', label: 'Adventure' },
  { value: 'culture',   label: 'Culture' },
  { value: 'food',      label: 'Food' },
  { value: 'nature',    label: 'Nature' },
  { value: 'hiking',    label: 'Hiking' },
  { value: 'night',     label: 'Night' },
  { value: 'water',     label: 'Water' },
  { value: 'history',   label: 'History' },
]

export default function ListingForm({ initialValues = {}, onSubmit, loading, buttonText = 'Save' }) {
  const [form, setForm] = useState({
    title:       initialValues.title       || '',
    location:    initialValues.location    || '',
    image_url:   initialValues.image_url   || '',
    description: initialValues.description || '',
    price:       initialValues.price       || '',
    category:    initialValues.category    || 'adventure',
    rating:      initialValues.rating      || '',
  })
  const [errors, setErrors] = useState({})
  const [imageMode, setImageMode] = useState('url')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    setForm({
      title:       initialValues.title       || '',
      location:    initialValues.location    || '',
      image_url:   initialValues.image_url   || '',
      description: initialValues.description || '',
      price:       initialValues.price       || '',
      category:    initialValues.category    || 'adventure',
      rating:      initialValues.rating      || '',
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues])

  function validate() {
    const errs = {}
    if (!form.title.trim())                      errs.title       = 'Title is required'
    else if (form.title.length > 200)            errs.title       = 'Max 200 characters'
    if (!form.location.trim())                   errs.location    = 'Location is required'
    else if (form.location.length > 200)         errs.location    = 'Max 200 characters'
    if (!form.image_url.trim())                  errs.image_url   = 'Image is required'
    if (!form.description.trim())                errs.description = 'Description is required'
    if (form.price !== '' && isNaN(form.price))  errs.price       = 'Price must be a number'
    if (form.rating !== '' && (isNaN(form.rating) || form.rating < 0 || form.rating > 5))
                                                   errs.rating      = 'Rating must be 0–5'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 10000000) {
      alert('Image must be under 10MB')
      return
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)

    setUploading(true)
    setErrors(prev => ({ ...prev, image_url: undefined }))

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      )
      const data = await res.json()
      if (data.secure_url) {
        setForm(prev => ({ ...prev, image_url: data.secure_url }))
      } else {
        const reason = data?.error?.message || 'Unknown error'
        console.error('Cloudinary upload error:', reason, data)
        setErrors(prev => ({
          ...prev,
          image_url: reason.toLowerCase().includes('preset')
            ? 'Upload preset not found. Create an unsigned preset named "lynkerr_uploads" in your Cloudinary dashboard.'
            : `Upload failed: ${reason}`
        }))
      }
    } catch {
      setErrors(prev => ({ ...prev, image_url: 'Upload failed. Check your connection.' }))
    } finally {
      setUploading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    const submitData = {
      title:       form.title,
      location:    form.location,
      image_url:   form.image_url,
      description: form.description,
      category:    form.category,
    }
    if (form.price  !== '') submitData.price  = form.price
    if (form.rating !== '') submitData.rating = form.rating
    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-6">

        {/* Title */}
        <div>
          <label className="text-[#D1D5DB] text-sm font-medium mb-2 block">
            Experience Title *
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Sunset Boat Tour"
            maxLength={200}
            className="bg-[#1C1C1C] border border-[#1F2937] focus:border-[#F97316] focus:outline-none text-white rounded-lg px-4 py-3 w-full transition-colors placeholder-[#6B7280]"
          />
          <p className="text-[#6B7280] text-xs mt-1 text-right">{form.title.length}/200</p>
          {errors.title && <p className="text-[#EF4444] text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="text-[#D1D5DB] text-sm font-medium mb-2 block">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Bali, Indonesia"
            maxLength={200}
            className="bg-[#1C1C1C] border border-[#1F2937] focus:border-[#F97316] focus:outline-none text-white rounded-lg px-4 py-3 w-full transition-colors placeholder-[#6B7280]"
          />
          {errors.location && <p className="text-[#EF4444] text-xs mt-1">{errors.location}</p>}
        </div>

        {/* Image — hybrid URL / Upload */}
        <div>
          <label className="text-[#D1D5DB] text-sm font-medium mb-2 block">
            Image *
          </label>

          {/* Toggle buttons */}
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setImageMode('url')}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                imageMode === 'url'
                  ? 'bg-[#F97316] text-white'
                  : 'border border-[#1F2937] text-[#6B7280] hover:border-[#F97316]'
              }`}
            >
              Paste URL
            </button>
            <button
              type="button"
              onClick={() => setImageMode('upload')}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                imageMode === 'upload'
                  ? 'bg-[#F97316] text-white'
                  : 'border border-[#1F2937] text-[#6B7280] hover:border-[#F97316]'
              }`}
            >
              Upload File
            </button>
          </div>

          {imageMode === 'url' ? (
            <input
              type="url"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="bg-[#1C1C1C] border border-[#1F2937] focus:border-[#F97316] focus:outline-none text-white rounded-lg px-4 py-3 w-full transition-colors placeholder-[#6B7280]"
            />
          ) : (
            <>
              <label
                htmlFor="image-upload"
                className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                  uploading
                    ? 'border-[#F97316] opacity-70 cursor-wait'
                    : 'border-[#1F2937] hover:border-[#F97316]'
                }`}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F97316] mx-auto mb-3" />
                    <p className="text-[#F97316] text-sm font-medium">Uploading to Cloudinary...</p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-3">📸</div>
                    <p className="text-[#D1D5DB] text-sm font-medium mb-1">Click to upload image</p>
                    <p className="text-[#6B7280] text-xs">JPG, PNG, WebP — up to 10MB</p>
                  </>
                )}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={handleImageUpload}
              />
            </>
          )}

          {/* Preview — shown for both modes when image_url is set */}
          {form.image_url && (
            <div className="mt-3 rounded-xl overflow-hidden h-48 bg-[#1C1C1C]">
              <img
                src={form.image_url}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/400x300/111111/F97316?text=Invalid+Image' }}
              />
            </div>
          )}
          {errors.image_url && <p className="text-[#EF4444] text-xs mt-1">{errors.image_url}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="text-[#D1D5DB] text-sm font-medium mb-2 block">
            Description *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your experience in detail..."
            rows={5}
            className="bg-[#1C1C1C] border border-[#1F2937] focus:border-[#F97316] focus:outline-none text-white rounded-lg px-4 py-3 w-full transition-colors placeholder-[#6B7280] resize-none"
          />
          {errors.description && <p className="text-[#EF4444] text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="text-[#D1D5DB] text-sm font-medium mb-2 block">
            Price in USD (leave empty if free)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">$</span>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="45.00"
              min={0}
              step={0.01}
              className="bg-[#1C1C1C] border border-[#1F2937] focus:border-[#F97316] focus:outline-none text-white rounded-lg px-4 py-3 pl-8 w-full transition-colors placeholder-[#6B7280]"
            />
          </div>
          {errors.price && <p className="text-[#EF4444] text-xs mt-1">{errors.price}</p>}
        </div>

        {/* Category + Rating — side by side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[#D1D5DB] text-sm font-medium mb-2 block">
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="bg-[#1C1C1C] border border-[#1F2937] focus:border-[#F97316] focus:outline-none text-white rounded-lg px-4 py-3 w-full transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[#D1D5DB] text-sm font-medium mb-2 block">
              Rating (0–5, optional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400">★</span>
              <input
                type="number"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                placeholder="4.5"
                min={0}
                max={5}
                step={0.1}
                className="bg-[#1C1C1C] border border-[#1F2937] focus:border-[#F97316] focus:outline-none text-white rounded-lg px-4 py-3 pl-8 w-full transition-colors placeholder-[#6B7280]"
              />
            </div>
            {errors.rating && <p className="text-[#EF4444] text-xs mt-1">{errors.rating}</p>}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#F97316] hover:bg-[#EA580C] text-white w-full py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Saving...' : buttonText}
        </button>

      </div>
    </form>
  )
}
