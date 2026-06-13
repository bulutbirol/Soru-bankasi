import { ArrowLeft, Clock3, Play } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import questions from '../data/questionBank'
import { getTopics } from '../utils/questions'

export function TopicsPage() {
  const { category } = useParams()
  const decodedCategory = decodeURIComponent(category)
  const topics = getTopics(questions, decodedCategory)

  if (!topics.length) {
    return <EmptyState title="Ders bulunamadı" description="Bu ders için henüz yerel soru verisi bulunmuyor." />
  }

  return (
    <div className="page-enter">
      <Link to="/categories" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500">
        <ArrowLeft size={16} /> Derslere dön
      </Link>
      <PageHeader
        eyebrow="Konu seçimi"
        title={decodedCategory}
        description="Bir konu seçerek odaklı pratik yap veya doğrudan süreli sınava geç."
        action={
          <Link to={`/solve?mode=exam&category=${encodeURIComponent(decodedCategory)}`} className="btn-secondary">
            <Clock3 size={18} /> Ders sınavı
          </Link>
        }
      />
      <div className="space-y-3">
        {topics.map((topic, index) => (
          <div className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center" key={topic.name}>
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink font-display text-lg font-bold text-amber dark:bg-amber dark:text-ink">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex-1">
              <h2 className="text-lg font-bold">{topic.name}</h2>
              <p className="mt-1 text-xs font-semibold text-slate-500">{topic.count} örnek soru</p>
            </div>
            <Link
              to={`/solve?mode=practice&category=${encodeURIComponent(decodedCategory)}&topic=${encodeURIComponent(topic.name)}`}
              className="btn-primary"
            >
              <Play size={17} fill="currentColor" /> Çözmeye başla
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
