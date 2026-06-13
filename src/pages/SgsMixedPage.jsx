import { Clock3, Layers3, Play } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { PastExamFilters } from '../components/PastExamFilters'
import sgsExamQuestions from '../data/sgsExamQuestions.json'
import sgsExamData from '../data/sgsExams.json'
import { filterSgsQuestions, getSgsFilterOptions } from '../utils/sgsExams'

export function SgsMixedPage() {
  const examIds = useMemo(() => sgsExamData.exams.map((exam) => exam.id), [])
  const [category, setCategory] = useState('')
  const [topic, setTopic] = useState('')
  const options = useMemo(
    () => getSgsFilterOptions(sgsExamQuestions, { examIds, category }),
    [category, examIds],
  )
  const filtered = useMemo(
    () => filterSgsQuestions(sgsExamQuestions, { examIds, category, topic }),
    [category, examIds, topic],
  )

  const solveUrl = (mode) => {
    const params = new URLSearchParams({
      source: 'sgs',
      examIds: examIds.join(','),
      mode,
      limit: String(filtered.length),
    })
    if (category) params.set('category', category)
    if (topic) params.set('topic', topic)
    return `/solve?${params}`
  }

  return (
    <div className="page-enter">
      <PageHeader
        eyebrow="Karma mod"
        title="Karma SGS çalışması"
        description="Tüm SGS sınavlarını bir araya getir; ders ve konu filtresiyle tek bir çalışma oluştur."
        action={<Link to="/sgs-exams" className="btn-secondary"><Layers3 size={18} /> Sınavları gör</Link>}
      />
      <PastExamFilters
        {...options}
        category={category}
        topic={topic}
        onCategoryChange={(value) => {
          setCategory(value)
          setTopic('')
        }}
        onTopicChange={setTopic}
      />
      <div className="panel mt-5 flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        <div className="flex-1">
          <strong className="font-display text-2xl">{filtered.length} karma soru</strong>
          <p className="mt-1 text-sm text-slate-500">{sgsExamData.exams.length} sınav · {category || 'Tüm dersler'} · {topic || 'Tüm konular'}</p>
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
