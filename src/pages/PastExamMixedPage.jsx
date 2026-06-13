import { Clock3, Layers3, Play } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { PastExamFilters } from '../components/PastExamFilters'
import pastExamQuestions from '../data/pastExamQuestions.json'
import {
  PAST_EXAM_PRESETS,
  filterPastExamQuestions,
  getPastExamFilterOptions,
} from '../utils/pastExams'

export function PastExamMixedPage() {
  const [searchParams] = useSearchParams()
  const initialPreset = PAST_EXAM_PRESETS[searchParams.get('preset')] ? searchParams.get('preset') : 'last3'
  const [presetKey, setPresetKey] = useState(initialPreset)
  const [category, setCategory] = useState('')
  const [topic, setTopic] = useState('')
  const preset = PAST_EXAM_PRESETS[presetKey]

  const options = useMemo(
    () => getPastExamFilterOptions(pastExamQuestions, { years: preset.years, category }),
    [category, preset.years],
  )
  const filtered = useMemo(
    () => filterPastExamQuestions(pastExamQuestions, { years: preset.years, category, topic }),
    [category, preset.years, topic],
  )

  const solveUrl = (mode) => {
    const params = new URLSearchParams({
      source: 'past_exam',
      years: preset.years.join(','),
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
      <PageHeader
        eyebrow="Karma mod"
        title="Karma çıkmış sorular"
        description="Yıl aralığını, dersi ve konuyu seç; farklı dönemlerden tek bir çalışma oluştur."
        action={<Link to="/past-exams" className="btn-secondary"><Layers3 size={18} /> Yılları gör</Link>}
      />

      <div className="mb-4 grid grid-cols-3 gap-2">
        {Object.entries(PAST_EXAM_PRESETS).map(([key, item]) => (
          <button
            type="button"
            onClick={() => {
              setPresetKey(key)
              setCategory('')
              setTopic('')
            }}
            className={`min-h-16 rounded-2xl border px-3 text-sm font-bold transition ${
              presetKey === key ? 'border-amber bg-amber text-ink' : 'border-ink/10 bg-white/60 dark:border-white/10 dark:bg-white/5'
            }`}
            key={key}
          >
            {item.label}
          </button>
        ))}
      </div>

      <PastExamFilters
        {...options}
        category={category}
        topic={topic}
        onCategoryChange={changeCategory}
        onTopicChange={setTopic}
      />

      <div className="panel mt-5 flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        <div className="flex-1">
          <strong className="font-display text-2xl">{filtered.length} karma soru</strong>
          <p className="mt-1 text-sm text-slate-500">{preset.years.at(-1)}-{preset.years[0]} · {category || 'Tüm dersler'} · {topic || 'Tüm konular'}</p>
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
