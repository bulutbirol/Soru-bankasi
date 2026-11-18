import { CalendarDays, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function SgsExamCard({ exam }) {
  return (
    <Link to={`/sgs-exams/${exam.id}`} className="card-press flex items-center gap-4 p-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand text-white shadow-[0_3px_0_rgb(var(--c-brand-deep))]">
        <CalendarDays size={22} strokeWidth={2.6} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-black text-brand-ink">{exam.year} SGS</span>
        <strong className="block text-lg font-black">{exam.date}</strong>
        <span className="text-xs font-extrabold text-muted">{exam.questionCount} soru</span>
      </span>
      <ChevronRight className="text-muted" size={20} strokeWidth={2.8} />
    </Link>
  )
}
