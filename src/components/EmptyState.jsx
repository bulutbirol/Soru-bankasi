import { Inbox } from 'lucide-react'
import { Link } from 'react-router-dom'

export function EmptyState({ title, description, actionLabel = 'Derslere git', actionTo = '/categories' }) {
  return (
    <div className="panel grid min-h-72 place-items-center p-8 text-center">
      <div>
        <span className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-sun text-[#4a3300] shadow-[0_4px_0_rgb(var(--c-sun-deep))]">
          <Inbox size={28} strokeWidth={2.6} />
        </span>
        <h2 className="text-2xl font-black">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm font-bold leading-6 text-muted">{description}</p>
        <Link className="btn-primary mt-6" to={actionTo}>{actionLabel}</Link>
      </div>
    </div>
  )
}
