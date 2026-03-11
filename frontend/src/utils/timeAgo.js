export function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000)

  if (seconds < 60) return 'just now'

  const minutes = Math.floor(seconds / 60)
  if (seconds < 3600) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`

  const hours = Math.floor(seconds / 3600)
  if (seconds < 86400) return `${hours} hour${hours !== 1 ? 's' : ''} ago`

  const days = Math.floor(seconds / 86400)
  if (seconds < 2592000) return `${days} day${days !== 1 ? 's' : ''} ago`

  const months = Math.floor(seconds / 2592000)
  return `${months} month${months !== 1 ? 's' : ''} ago`
}
