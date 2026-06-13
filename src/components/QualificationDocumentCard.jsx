import { ArrowUpRight, CircleAlert, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

export function QualificationDocumentCard({ document }) {
  const content = (
    <>
      <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
        document.available ? 'bg-ink text-amber dark:bg-amber dark:text-ink' : 'bg-slate-200 text-slate-400 dark:bg-white/10'
      }`}>
        {document.available ? <FileText size={20} /> : <CircleAlert size={20} />}
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block font-display text-lg">{document.lesson}</strong>
        <span className="mt-1 block text-xs font-semibold text-slate-500">
          {document.available ? `${document.questionCount} açıklamalı soru · Kaynak PDF` : 'Kaynak bağlantısı kullanılamıyor'}
        </span>
      </span>
      {document.available && <ArrowUpRight className="shrink-0 text-coral" size={19} />}
    </>
  )

  if (!document.available) {
    return <div className="panel flex items-center gap-4 p-4 opacity-65">{content}</div>
  }

  return (
    <Link
      to={`/qualification-exams/${document.examId}/${document.id}`}
      className="panel flex items-center gap-4 p-4 transition hover:-translate-y-1 hover:border-amber/60"
    >
      {content}
    </Link>
  )
}
