import { Layers3, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { YearCard } from '../components/YearCard'
import pastExamQuestions from '../data/pastExamQuestions.json'
import {
  PAST_EXAM_PRESETS,
  PAST_EXAM_YEARS,
  getPastExamYearSummary,
} from '../utils/pastExams'

export function PastExamsPage() {
  return (
    <div className="page-enter">
      <PageHeader
        eyebrow="Çıkmış sorular"
        title="Yıllara göre çıkmış sorular"
        description="2020-2026 dönemlerinin her biri için 100 özgün çalışma sorusunu yıl seçerek veya toplam 700 soruluk karma modda çöz."
      />

      <Link
        to="/past-exams/mixed"
        className="relative mb-7 flex overflow-hidden rounded-3xl bg-brand p-6 text-white shadow-[0_6px_0_rgb(var(--c-brand-deep))] transition active:translate-y-1 active:shadow-none sm:items-center sm:justify-between sm:p-8"
      >
        <div className="relative z-10">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold text-white/90">
            <Sparkles size={14} /> KARMA MOD
          </span>
          <h2 className="text-2xl font-black sm:text-3xl">Yılları karıştır, sınav refleksini ölç.</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/90">Son 3 yıl, son 5 yıl veya tüm yıllar arasından ders ve konu filtreli çalışma oluştur.</p>
        </div>
        <Layers3 className="absolute -bottom-8 -right-5 text-white/25 sm:static sm:text-white" size={104} />
      </Link>

      <div className="mb-4">
        <p className="text-sm font-black text-danger">Yıl seç</p>
        <h2 className="mt-1 text-2xl font-black">Tek yıl çalışmaları</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {PAST_EXAM_YEARS.map((year) => (
          <YearCard summary={getPastExamYearSummary(pastExamQuestions, year)} key={year} />
        ))}
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {Object.entries(PAST_EXAM_PRESETS).map(([key, preset]) => (
          <Link
            to={`/past-exams/mixed?preset=${key}`}
            className="panel p-5 text-center font-bold transition hover:border-sun hover:bg-sun-soft"
            key={key}
          >
            {preset.label}
            <span className="mt-1 block text-xs font-semibold text-muted">{preset.years.length} yıl</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
