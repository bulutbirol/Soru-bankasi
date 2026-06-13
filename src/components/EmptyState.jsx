import { Inbox } from 'lucide-react'
import { Link } from 'react-router-dom'

export function EmptyState({ title, description, actionLabel = 'Derslere git', actionTo = '/categories' }) {
  return (
    <div className="panel grid min-h-72 place-items-center p-8 text-center">
      <div>
        <span className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-amber/20 text-amber-700 dark:text-amber">
          <Inbox size={28} />
        </span>
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
        <Link className="btn-primary mt-6" to={actionTo}>{actionLabel}</Link>
      </div>
    </div>
  )
}
