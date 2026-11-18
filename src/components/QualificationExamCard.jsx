import { BookMarked, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function QualificationExamCard({ exam }) {
  const availableCount = exam.documents.filter((document) => document.available).length

  return (
    <Link to={`/qualification-exams/${exam.id}`} className="card-press flex items-center gap-4 p-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sun text-[#4a3300] shadow-[0_3px_0_rgb(var(--c-sun-deep))]">
        <BookMarked size={22} strokeWidth={2.6} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-black text-sun-ink">{exam.year} · {exam.period}. dönem</span>
        <strong className="block text-lg font-black">{exam.label.replace('SMMM Yeterlilik', 'Yeterlilik')}</strong>
        <span className="text-xs font-extrabold text-muted">{availableCount} erişilebilir ders belgesi</span>
      </span>
      <ChevronRight className="text-muted" size={20} strokeWidth={2.8} />
    </Link>
  )
}
