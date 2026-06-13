import { EmptyState } from '../components/EmptyState'

export function NotFoundPage() {
  return <EmptyState title="Bu sayfa bulunamadı" description="Bağlantı değişmiş veya sayfa kaldırılmış olabilir." actionLabel="Ana sayfaya dön" actionTo="/" />
}
