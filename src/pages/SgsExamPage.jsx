import { ArrowLeft, Play } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { PastExamFilters } from '../components/PastExamFilters'
import sgsExamQuestions from '../data/sgsExamQuestions.json'
import sgsExamData from '../data/sgsExams.json'
import { filterSgsQuestions, getSgsFilterOptions } from '../utils/sgsExams'

export function SgsExamPage() {
  const { examId } = useParams()
  const exam = sgsExamData.exams.find((item) => item.id === examId)
  const [category, setCategory] = useState('')
  const [topic, setTopic] = useState('')

  const options = useMemo(
    () => getSgsFilterOptions(sgsExamQuestions, { examIds: [examId], category }),
    [category, examId],
  )
  const filtered = useMemo(
    () => filterSgsQuestions(sgsExamQuestions, { examIds: [examId], category, topic }),
    [category, examId, topic],
  )

  if (!exam) {
    return <EmptyState title="Bu SGS sınavı bulunamadı" description="Arşivde bulunan sınavlardan birini seçebilirsin." actionLabel="SGS arşivine dön" actionTo="/sgs-exams" />
  }

  const solveUrl = () => {
    const params = new URLSearchParams({
      source: 'sgs',
      examIds: exam.id,
      limit: String(filtered.length),
    })
    if (category) params.set('category', category)
    if (topic) params.set('topic', topic)
    return `/solve?${params}`
  }

  return (
    <div className="page-enter">
      <Link to="/sgs-exams" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500">
        <ArrowLeft size={16} /> SGS sınavlarına dön
      </Link>
      <PageHeader
        eyebrow="Tek sınav çalışması"
        title={`${exam.date} SGS`}
        description="Kaynak sınavdaki 130 soruyu ders ve konu filtresiyle, cevabı ve açıklamayı anında görerek çöz."
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
          <strong className="font-display text-2xl">{filtered.length} soru hazır</strong>
          <p className="mt-1 text-sm text-slate-500">{category || 'Tüm dersler'} · {topic || 'Tüm konular'}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to={solveUrl()} className={`btn-primary ${filtered.length ? '' : 'pointer-events-none opacity-40'}`}>
            <Play size={18} fill="currentColor" /> Soruları çöz
          </Link>
        </div>
      </div>
    </div>
  )
}
