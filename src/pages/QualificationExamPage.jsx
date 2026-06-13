import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { QualificationDocumentCard } from '../components/QualificationDocumentCard'
import qualificationData from '../data/qualificationExams.json'
import { getQualificationExams } from '../utils/qualificationExams'

export function QualificationExamPage() {
  const { examId } = useParams()
  const exam = getQualificationExams(qualificationData.documents)
    .find((item) => item.id === examId)

  if (!exam) {
    return (
      <EmptyState
        title="Bu Yeterlilik dönemi bulunamadı"
        description="Arşivde bulunan dönemlerden birini seçebilirsin."
        actionLabel="Yeterlilik arşivine dön"
        actionTo="/qualification-exams"
      />
    )
  }

  const availableCount = exam.documents.filter((document) => document.available).length

  return (
    <div className="page-enter">
      <Link to="/qualification-exams" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500">
        <ArrowLeft size={16} /> Yeterlilik arşivine dön
      </Link>
      <PageHeader
        eyebrow={`${exam.year} · ${exam.period}. dönem`}
        title={`${exam.year}/${exam.period} Yeterlilik`}
        description={`${availableCount} ders belgesi doğrulandı. Dersi seçerek kaynak ve içerik durumunu incele.`}
      />
      <div className="grid gap-3 md:grid-cols-2">
        {exam.documents.map((document) => (
          <QualificationDocumentCard document={document} key={document.id} />
        ))}
      </div>
    </div>
  )
}
