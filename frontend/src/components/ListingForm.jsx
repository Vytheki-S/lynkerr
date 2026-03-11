// Reusable form for Create and Edit listing pages
export default function ListingForm({ form, setForm, onSubmit, loading, submitLabel }) {
  return (
    <form onSubmit={onSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
      <input className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-orange-500 placeholder-gray-500"
        placeholder="Experience Title *" value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })} required />
      <input className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-orange-500 placeholder-gray-500"
        placeholder="Location (e.g. Bali, Indonesia) *" value={form.location}
        onChange={e => setForm({ ...form, location: e.target.value })} required />
      <input className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-orange-500 placeholder-gray-500"
        placeholder="Image URL *" value={form.image_url}
        onChange={e => setForm({ ...form, image_url: e.target.value })} required />
      <textarea className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-orange-500 placeholder-gray-500 resize-none h-36"
        placeholder="Describe your experience... *" value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })} required />
      <input className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-orange-500 placeholder-gray-500"
        placeholder="Price in USD (leave empty if free)" type="number" value={form.price}
        onChange={e => setForm({ ...form, price: e.target.value })} />
      <button type="submit" disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition mt-2 disabled:opacity-50">
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}
