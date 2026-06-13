export function formatTime(seconds) {
  const minutes = Math.floor(Math.max(seconds, 0) / 60)
  const remainder = Math.max(seconds, 0) % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

export function formatDate(value) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
