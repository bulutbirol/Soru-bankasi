import { ChevronRight, CircleAlert, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

export function QualificationDocumentCard({ document }) {
  const content = (
    <>
      <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
        document.available ? 'bg-sun text-[#4a3300] shadow-[0_3px_0_rgb(var(--c-sun-deep))]' : 'bg-line text-muted'
      }`}>
        {document.available ? <FileText size={20} strokeWidth={2.6} /> : <CircleAlert size={20} strokeWidth={2.6} />}
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block text-lg font-black">{document.lesson}</strong>
        <span className="mt-0.5 block text-xs font-extrabold text-muted">
          {document.available ? `${document.questionCount} açıklamalı soru · Kaynak PDF` : 'Kaynak bağlantısı kullanılamıyor'}
        </span>
      </span>
      {document.available && <ChevronRight className="shrink-0 text-muted" size={20} strokeWidth={2.8} />}
    </>
  )

  if (!document.available) {
    return <div className="panel flex items-center gap-4 p-4 opacity-60">{content}</div>
  }

  return (
    <Link to={`/qualification-exams/${document.examId}/${document.id}`} className="card-press flex items-center gap-4 p-4">
      {content}
    </Link>
  )
}
