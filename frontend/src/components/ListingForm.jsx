import { useState, useEffect } from 'react'

export default function ListingForm({ initialValues = {}, onSubmit, loading, buttonText = 'Save' }) {
  const [form, setForm] = useState({
    title:       initialValues.title       || '',
    location:    initialValues.location    || '',
    image_url:   initialValues.image_url   || '',
    description: initialValues.description || '',
    price:       initialValues.price       || '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setForm({
      title:       initialValues.title       || '',
      location:    initialValues.location    || '',
      image_url:   initialValues.image_url   || '',
      description: initialValues.description || '',
      price:       initialValues.price       || '',
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues])

  function validate() {
    const errs = {}
    if (!form.title.trim())                      errs.title       = 'Title is required'
    else if (form.title.length > 200)            errs.title       = 'Max 200 characters'
    if (!form.location.trim())                   errs.location    = 'Location is required'
    else if (form.location.length > 200)         errs.location    = 'Max 200 characters'
    if (!form.image_url.trim())                  errs.image_url   = 'Image URL is required'
    if (!form.description.trim())                errs.description = 'Description is required'
    if (form.price !== '' && isNaN(form.price))  errs.price       = 'Price must be a number'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    const submitData = {
      title:       form.title,
      location:    form.location,
      image_url:   form.image_url,
      description: form.description,
    }
    if (form.price !== '') submitData.price = form.price
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

        {/* Image URL */}
        <div>
          <label className="text-[#D1D5DB] text-sm font-medium mb-2 block">
            Image URL *
          </label>
          <input
            type="url"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="bg-[#1C1C1C] border border-[#1F2937] focus:border-[#F97316] focus:outline-none text-white rounded-lg px-4 py-3 w-full transition-colors placeholder-[#6B7280]"
          />
          {form.image_url && (
            <div className="mt-3 rounded-xl overflow-hidden h-48 bg-[#1C1C1C]">
              <img
                src={form.image_url}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/400x300/111111/F97316?text=Invalid+URL' }}
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
