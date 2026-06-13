import { ArrowRight, CalendarDays, FileQuestion } from 'lucide-react'
import { Link } from 'react-router-dom'

export function SgsExamCard({ exam }) {
  return (
    <Link
      to={`/sgs-exams/${exam.id}`}
      className="panel group relative overflow-hidden p-5 transition hover:-translate-y-1 hover:border-mint/70"
    >
      <div className="absolute -right-8 -top-8 size-28 rounded-full bg-mint/10 transition group-hover:scale-110" />
      <div className="relative flex items-start justify-between gap-4">
        <span className="grid size-12 place-items-center rounded-2xl bg-ink text-mint dark:bg-mint dark:text-ink">
          <CalendarDays size={22} />
        </span>
        <ArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-coral" size={19} />
      </div>
      <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-coral">{exam.year} SGS</p>
      <h2 className="mt-1 font-display text-xl font-bold">{exam.date}</h2>
      <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-500">
        <FileQuestion size={16} /> {exam.questionCount} soru
      </p>
    </Link>
  )
}
