import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categoryMeta } from '../data/categories'

export function CategoryCard({ category, compact = false }) {
  const meta = categoryMeta[category.name]
  const Icon = meta.icon
  return (
    <Link to={`/categories/${encodeURIComponent(category.name)}`} className="card-press flex items-center gap-4 p-4">
      <span className={`grid shrink-0 place-items-center rounded-2xl ${compact ? 'size-11' : 'size-14'} ${meta.color}`}>
        <Icon size={compact ? 20 : 25} strokeWidth={2.6} />
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block text-lg font-black">{category.name}</strong>
        <span className="text-xs font-extrabold text-muted">
          {category.topicCount} konu · {category.count} soru
        </span>
      </span>
      <ChevronRight className="text-muted" size={20} strokeWidth={2.8} />
    </Link>
  )
}
