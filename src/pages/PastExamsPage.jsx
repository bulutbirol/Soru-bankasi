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
        description="2020-2026 dönemlerinden esinlenen özgün çalışma sorularını yıl seçerek veya karma modda çöz."
      />

      <Link
        to="/past-exams/mixed"
        className="relative mb-7 flex overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-lift transition hover:-translate-y-1 sm:items-center sm:justify-between sm:p-8"
      >
        <div className="relative z-10">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-mint/15 px-3 py-1 text-xs font-extrabold text-mint">
            <Sparkles size={14} /> KARMA MOD
          </span>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Yılları karıştır, sınav refleksini ölç.</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Son 3 yıl, son 5 yıl veya tüm yıllar arasından ders ve konu filtreli çalışma oluştur.</p>
        </div>
        <Layers3 className="absolute -bottom-8 -right-5 text-amber/20 sm:static sm:text-amber" size={104} />
      </Link>

      <div className="mb-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-coral">Yıl seç</p>
        <h2 className="mt-1 font-display text-2xl font-bold">Tek yıl çalışmaları</h2>
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
            className="panel p-5 text-center font-bold transition hover:border-amber/60 hover:bg-amber/10"
            key={key}
          >
            {preset.label}
            <span className="mt-1 block text-xs font-semibold text-slate-500">{preset.years.length} yıl</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
