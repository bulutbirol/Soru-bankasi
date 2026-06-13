import { ArrowLeft, Clock3, Play } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { PastExamFilters } from '../components/PastExamFilters'
import pastExamQuestions from '../data/pastExamQuestions.json'
import {
  PAST_EXAM_YEARS,
  filterPastExamQuestions,
  getPastExamFilterOptions,
} from '../utils/pastExams'

export function PastExamYearPage() {
  const { year: yearParam } = useParams()
  const year = Number(yearParam)
  const [category, setCategory] = useState('')
  const [topic, setTopic] = useState('')
  const valid = PAST_EXAM_YEARS.includes(year)

  const options = useMemo(
    () => getPastExamFilterOptions(pastExamQuestions, { years: [year], category }),
    [category, year],
  )
  const filtered = useMemo(
    () => filterPastExamQuestions(pastExamQuestions, { years: [year], category, topic }),
    [category, topic, year],
  )

  if (!valid) {
    return <EmptyState title="Bu sınav yılı bulunamadı" description="2020 ile 2026 arasındaki yıllardan birini seçebilirsin." actionLabel="Çıkmış sorulara dön" actionTo="/past-exams" />
  }

  const solveUrl = (mode) => {
    const params = new URLSearchParams({
      source: 'past_exam',
      years: String(year),
      mode,
      limit: String(filtered.length),
    })
    if (category) params.set('category', category)
    if (topic) params.set('topic', topic)
    return `/solve?${params}`
  }

  const changeCategory = (value) => {
    setCategory(value)
    setTopic('')
  }

  return (
    <div className="page-enter">
      <Link to="/past-exams" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500">
        <ArrowLeft size={16} /> Yıllara dön
      </Link>
      <PageHeader
        eyebrow="Tek yıl çalışması"
        title={`${year} Çıkmış Soruları`}
        description="Ders ve konu filtrelerini kullanarak bu yıla özel bir çalışma oluştur."
      />
      <PastExamFilters
        {...options}
        category={category}
        topic={topic}
        onCategoryChange={changeCategory}
        onTopicChange={setTopic}
      />
      <div className="panel mt-5 flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        <div className="flex-1">
          <strong className="font-display text-2xl">{filtered.length} soru hazır</strong>
          <p className="mt-1 text-sm text-slate-500">{category || 'Tüm dersler'} · {topic || 'Tüm konular'}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to={solveUrl('practice')} className={`btn-primary ${filtered.length ? '' : 'pointer-events-none opacity-40'}`}>
            <Play size={18} fill="currentColor" /> Pratik çöz
          </Link>
          <Link to={solveUrl('exam')} className={`btn-secondary ${filtered.length ? '' : 'pointer-events-none opacity-40'}`}>
            <Clock3 size={18} /> Süreli çöz
          </Link>
        </div>
      </div>
    </div>
  )
}
