import { Heart, Play, Trash2, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import pastExamQuestions from '../data/pastExamQuestions.json'
import qualificationQuestions from '../data/qualificationQuestions.json'
import questions from '../data/questionBank'
import sgsExamQuestions from '../data/sgsExamQuestions.json'
import { useProgress } from '../hooks/useProgress'
import { getCollectionItems } from '../utils/collections'

export function CollectionPage({ type }) {
  const { progress, toggleFavorite, clearWrongQuestions } = useProgress()
  const isWrong = type === 'wrong'
  const ids = isWrong ? progress.wrongQuestionIds : progress.favoriteQuestionIds
  const quizQuestions = [...questions, ...pastExamQuestions, ...sgsExamQuestions, ...qualificationQuestions]
  const items = getCollectionItems(ids, quizQuestions, qualificationQuestions)
  const title = isWrong ? 'Yanlış cevapların' : 'Favori soruların'
  const handleClearWrongQuestions = () => {
    if (window.confirm('Yanlışlar listesindeki tüm sorular temizlensin mi?')) {
      clearWrongQuestions()
    }
  }

  if (!items.length) {
    return (
      <EmptyState
        title={isWrong ? 'Yanlış listen temiz' : 'Henüz favorin yok'}
        description={isWrong ? 'Yanlış yaptığın sorular burada birikir ve doğru çözdüğünde listeden çıkar.' : 'Çözerken kalp simgesine dokunduğun soruları burada bulacaksın.'}
      />
    )
  }

  return (
    <div className="page-enter">
      <PageHeader
        eyebrow={isWrong ? 'Tekrar alanı' : 'Kaydedilenler'}
        title={title}
        description={`${items.length} soru cihazında kayıtlı.`}
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            {isWrong && (
              <button
                type="button"
                onClick={handleClearWrongQuestions}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-coral/30 px-5 py-3 font-bold text-coral transition hover:bg-coral/10"
              >
                <Trash2 size={18} /> Yanlışları temizle
              </button>
            )}
            {items.length > 0 && (
              <Link to={`/solve?collection=${type}&limit=${items.length}`} className="btn-primary">
                <Play size={18} fill="currentColor" /> Test sorularını çöz
              </Link>
            )}
          </div>
        }
      />
      <div className="space-y-3">
        {items.map((question) => (
          <div className="panel flex items-start gap-4 p-5" key={question.id}>
            <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${isWrong ? 'bg-coral/15 text-coral' : 'bg-amber/20 text-amber-700 dark:text-amber'}`}>
              {isWrong ? <XCircle size={21} /> : <Heart size={21} fill="currentColor" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-500">
                {question.category} · {question.topic}
              </p>
              <h2 className="mt-1 font-bold leading-6">{question.question}</h2>
              {question.questionImage && (
                <img src={question.questionImage} alt="" className="mt-3 max-h-44 rounded-xl bg-white object-contain" />
              )}
            </div>
            {!isWrong && (
              <button type="button" onClick={() => toggleFavorite(question.id)} aria-label="Favorilerden çıkar" className="text-coral">
                <XCircle size={20} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
