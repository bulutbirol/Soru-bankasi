import { ArrowUpRight, CalendarDays, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'

export function YearCard({ summary }) {
  return (
    <Link
      to={`/past-exams/${summary.year}`}
      className="panel group relative overflow-hidden p-5 transition hover:-translate-y-1 hover:border-amber/60"
    >
      <div className="absolute -right-8 -top-8 size-28 rounded-full border-[18px] border-amber/10" />
      <div className="relative flex items-start justify-between">
        <span className="grid size-12 place-items-center rounded-2xl bg-ink text-amber dark:bg-amber dark:text-ink">
          <CalendarDays size={21} />
        </span>
        <ArrowUpRight className="text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-coral" size={20} />
      </div>
      <strong className="relative mt-6 block font-display text-3xl">{summary.year}</strong>
      <div className="relative mt-2 flex items-center gap-2 text-xs font-bold text-slate-500">
        <Layers3 size={14} />
        <span>{summary.count} soru · {summary.categoryCount} ders · {summary.periodCount} dönem</span>
      </div>
    </Link>
  )
}
