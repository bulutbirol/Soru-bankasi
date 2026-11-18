import { CalendarDays, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function YearCard({ summary }) {
  return (
    <Link to={`/past-exams/${summary.year}`} className="card-press flex items-center gap-4 p-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sky text-white shadow-[0_3px_0_rgb(var(--c-sky-deep))]">
        <CalendarDays size={22} strokeWidth={2.6} />
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block text-2xl font-black">{summary.year}</strong>
        <span className="text-xs font-extrabold text-muted">{summary.count} soru · {summary.categoryCount} ders · {summary.periodCount} dönem</span>
      </span>
      <ChevronRight className="text-muted" size={20} strokeWidth={2.8} />
    </Link>
  )
}
