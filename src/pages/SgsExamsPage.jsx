import { Layers3, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { SgsExamCard } from '../components/SgsExamCard'
import sgsExamData from '../data/sgsExams.json'

export function SgsExamsPage() {
  const totalQuestions = sgsExamData.exams.reduce((sum, exam) => sum + exam.questionCount, 0)
  const years = sgsExamData.exams.map((exam) => exam.year)
  const yearRange = `${Math.min(...years)}-${Math.max(...years)}`

  return (
    <div className="page-enter">
      <PageHeader
        eyebrow="SGS arşivi"
        title="Staja Giriş Sınavları"
        description={`${sgsExamData.exams.length} ayrı sınav ve toplam ${totalQuestions} soru. Bir sınavı seçerek sırayla çöz veya tüm sınavları karma çalış.`}
      />

      <Link
        to="/sgs-exams/mixed"
        className="relative mb-7 flex overflow-hidden rounded-3xl bg-brand p-6 text-white shadow-[0_6px_0_rgb(var(--c-brand-deep))] transition active:translate-y-1 active:shadow-none sm:items-center sm:justify-between sm:p-8"
      >
        <div className="relative z-10">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold text-white/90">
            <Sparkles size={14} /> KARMA SGS
          </span>
          <h2 className="text-2xl font-black sm:text-3xl">Tüm sınavları tek çalışma oturumunda birleştir.</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/90">Ders ve konu filtreleriyle {yearRange} sınavlarından kendi soru setini oluştur.</p>
        </div>
        <Layers3 className="absolute -bottom-8 -right-5 text-white/25 sm:static sm:text-white" size={104} />
      </Link>

      <div className="mb-4">
        <p className="text-sm font-black text-danger">Sınav seç</p>
        <h2 className="mt-1 text-2xl font-black">Tek sınav çalışmaları</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sgsExamData.exams.map((exam) => <SgsExamCard exam={exam} key={exam.id} />)}
      </div>
    </div>
  )
}
