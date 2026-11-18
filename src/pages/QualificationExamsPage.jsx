import { FileSearch, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { QualificationExamCard } from '../components/QualificationExamCard'
import qualificationData from '../data/qualificationExams.json'
import { getQualificationExams } from '../utils/qualificationExams'

export function QualificationExamsPage() {
  const exams = getQualificationExams(qualificationData.documents)
  const availableCount = qualificationData.documents.filter((document) => document.available).length
  const questionCount = qualificationData.documents.reduce((total, document) => total + document.questionCount, 0)
  const years = exams.map((exam) => exam.year)

  return (
    <div className="page-enter">
      <PageHeader
        eyebrow="Yeterlilik arşivi"
        title="SMMM Yeterlilik Sınavları"
        description={`${Math.min(...years)}-${Math.max(...years)} dönemlerinden ${availableCount} kaynak belgeye göre hazırlanmış ${questionCount} özgün ve açıklamalı soruya ulaş.`}
      />

      <div className="mb-7 grid gap-4 md:grid-cols-2">
        <Link
          to="/qualification-exams/mixed"
          className="relative overflow-hidden rounded-3xl bg-brand p-6 text-white shadow-[0_6px_0_rgb(var(--c-brand-deep))] transition active:translate-y-1 active:shadow-none"
        >
          <Layers3 className="text-white" size={26} />
          <p className="mt-7 text-sm font-black text-white/90">Tüm arşiv</p>
          <h2 className="mt-1 text-2xl font-black">Karma Yeterlilik çalışması</h2>
          <p className="mt-3 text-sm leading-6 text-white/90">Yıl ve ders seçerek açıklamalı sorulardan kendi çalışma setini oluştur.</p>
        </Link>
        <div className="panel p-6">
          <FileSearch className="text-danger" size={26} />
          <p className="mt-7 text-sm font-black text-danger">Kaynak doğrulama</p>
          <h2 className="mt-1 text-2xl font-black">{questionCount} öğrenme sorusu</h2>
          <p className="mt-3 text-sm leading-6 text-muted">Her soruda beş seçenek, doğru cevap ve öğrenmeyi destekleyen kısa açıklama bulunur.</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-black text-danger">Dönem seç</p>
        <h2 className="mt-1 text-2xl font-black">Yeterlilik sınav dönemleri</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {exams.map((exam) => <QualificationExamCard exam={exam} key={exam.id} />)}
      </div>
    </div>
  )
}
