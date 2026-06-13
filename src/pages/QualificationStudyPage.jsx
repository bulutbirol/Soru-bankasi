import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { QualificationQuestionCard } from '../components/QualificationQuestionCard'
import qualificationQuestions from '../data/qualificationQuestions.json'
import { useProgress } from '../hooks/useProgress'

export function QualificationStudyPage() {
  const [params] = useSearchParams()
  const [currentIndex, setCurrentIndex] = useState(0)
  const {
    progress,
    completeQualificationQuestion,
    toggleFavorite,
  } = useProgress()

  const selectedQuestions = useMemo(() => {
    const ids = (params.get('ids') || '').split(',').filter(Boolean)
    return ids.length
      ? qualificationQuestions.filter((question) => ids.includes(question.id))
      : qualificationQuestions
  }, [params])

  if (!selectedQuestions.length) {
    return (
      <EmptyState
        title="İçe aktarılmış klasik soru bulunamadı"
        description="Yeniden kullanım izni bulunan Yeterlilik PDF'leri eklendiğinde klasik soru çalışma alanı burada açılacak."
        actionLabel="Yeterlilik arşivine dön"
        actionTo="/qualification-exams"
      />
    )
  }

  const question = selectedQuestions[currentIndex]
  const completed = progress.completedQualificationIds.includes(question.id)
  const favorite = progress.favoriteQuestionIds.includes(question.id)

  return (
    <div className="page-enter mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-bold">Klasik soru {currentIndex + 1} / {selectedQuestions.length}</p>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
          <div className="h-full bg-coral" style={{ width: `${((currentIndex + 1) / selectedQuestions.length) * 100}%` }} />
        </div>
      </div>
      <QualificationQuestionCard
        question={question}
        completed={completed}
        favorite={favorite}
        onComplete={() => completeQualificationQuestion(question.id)}
        onToggleFavorite={() => toggleFavorite(question.id)}
      />
      <div className="mt-5 flex justify-between gap-3">
        <button
          type="button"
          className="btn-secondary"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((index) => index - 1)}
        >
          <ChevronLeft size={18} /> Önceki
        </button>
        <button
          type="button"
          className="btn-primary"
          disabled={currentIndex === selectedQuestions.length - 1}
          onClick={() => setCurrentIndex((index) => index + 1)}
        >
          Sonraki <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
