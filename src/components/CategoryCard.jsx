import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categoryMeta } from '../data/categories'

export function CategoryCard({ category, compact = false }) {
  const meta = categoryMeta[category.name]
  const Icon = meta.icon
  return (
    <Link
      to={`/categories/${encodeURIComponent(category.name)}`}
      className="panel group flex items-center gap-4 p-5 transition hover:-translate-y-1 hover:border-amber/60"
    >
      <span className={`grid shrink-0 place-items-center rounded-2xl ${compact ? 'size-11' : 'size-14'} ${meta.color}`}>
        <Icon size={compact ? 20 : 25} />
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block text-lg">{category.name}</strong>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {category.topicCount} konu · {category.count} soru
        </span>
      </span>
      <ArrowUpRight className="text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-coral" size={20} />
    </Link>
  )
}
