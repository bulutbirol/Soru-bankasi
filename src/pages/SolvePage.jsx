import { CheckCircle2, ChevronRight, Home, XCircle } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { QuestionCard } from '../components/QuestionCard'
import pastExamQuestions from '../data/pastExamQuestions.json'
import qualificationQuestions from '../data/qualificationQuestions.json'
import questions from '../data/questionBank'
import sgsExamQuestions from '../data/sgsExamQuestions.json'
import sgsExamData from '../data/sgsExams.json'
import { useProgress } from '../hooks/useProgress'
import { useQuestionSession } from '../hooks/useQuestionSession'
import { filterPastExamQuestions, parseYears } from '../utils/pastExams'
import { filterQuestions } from '../utils/questions'
import { filterSgsQuestions, parseExamIds } from '../utils/sgsExams'

export function SolvePage() {
  const [params] = useSearchParams()
  const mode = 'learning'
  const category = params.get('category') || ''
  const topic = params.get('topic') || ''
  const collection = params.get('collection')
  const sourceType = params.get('source')
  const yearsParam = params.get('years') || ''
  const examIdsParam = params.get('examIds') || ''
  const documentIdsParam = params.get('documentIds') || ''
  const { progress, answer: recordAnswer, finishSession, toggleFavorite } = useProgress()
  const recordedAnswers = useRef(new Set())
  const recordedSession = useRef(false)

  const source = useMemo(() => {
    let ids
    if (collection === 'wrong') ids = progress.wrongQuestionIds
    if (collection === 'favorites') ids = progress.favoriteQuestionIds
    const allQuestions = [...questions, ...pastExamQuestions, ...sgsExamQuestions, ...qualificationQuestions]
    let filtered

    if (collection) {
      filtered = filterQuestions(allQuestions, { category, topic, ids })
    } else if (sourceType === 'past_exam') {
      filtered = filterPastExamQuestions(pastExamQuestions, {
        years: parseYears(yearsParam),
        category,
        topic,
      })
    } else if (sourceType === 'sgs') {
      filtered = filterSgsQuestions(sgsExamQuestions, {
        examIds: parseExamIds(examIdsParam, sgsExamData.exams.map((exam) => exam.id)),
        category,
        topic,
      })
    } else if (sourceType === 'qualification') {
      const documentIds = documentIdsParam.split(',').filter(Boolean)
      const examIds = examIdsParam.split(',').filter(Boolean)
      filtered = qualificationQuestions.filter((question) => (
        (!documentIds.length || documentIds.includes(question.documentId))
        && (!examIds.length || examIds.includes(question.examId))
        && (!category || question.category === category)
        && (!topic || question.topic === topic)
      ))
    } else {
      filtered = filterQuestions(questions, { category, topic, ids })
    }

    const requested = Number(params.get('limit') || progress.settings.questionCount)
    return filtered.slice(0, Math.max(1, requested))
  }, [category, collection, documentIdsParam, examIdsParam, params, progress.favoriteQuestionIds, progress.settings.questionCount, progress.wrongQuestionIds, sourceType, topic, yearsParam])

  const session = useQuestionSession(source, {
    shuffleOptions: progress.settings.shuffleOptions,
  })

  const recordQuestionAnswer = useCallback((question, optionIndex) => {
    if (!question || optionIndex === undefined || recordedAnswers.current.has(question.id)) return
    recordedAnswers.current.add(question.id)
    recordAnswer({
      questionId: question.id,
      correct: optionIndex === question.answer,
      category: question.category,
    })
  }, [recordAnswer])

  const handleNext = () => {
    recordQuestionAnswer(session.currentQuestion, session.currentAnswer)
    session.next()
  }

  const handleFinish = () => {
    recordQuestionAnswer(session.currentQuestion, session.currentAnswer)
    session.finish()
  }

  useEffect(() => {
    if (!session.finished || recordedSession.current || !session.questions.length) return
    session.questions.forEach((question) => {
      recordQuestionAnswer(question, session.answers[question.id])
    })
    recordedSession.current = true
    finishSession({
      mode,
      category: category || (sourceType === 'past_exam' ? 'Çıkmış Sorular' : sourceType === 'sgs' ? 'SGS' : sourceType === 'qualification' ? 'SMMM Yeterlilik' : 'Karma'),
      ...session.result,
    })
  }, [category, finishSession, mode, recordQuestionAnswer, session.answers, session.finished, session.questions, session.result, sourceType])

  if (!source.length) {
    return (
      <EmptyState
        title="Çözülecek soru kalmadı"
        description={collection === 'wrong' ? 'Yanlış listen temiz. Yeni sorular çözerek tekrar listeni oluşturabilirsin.' : 'Bu seçim için soru bulunamadı.'}
      />
    )
  }

  if (session.finished) {
    return (
      <div className="page-enter mx-auto max-w-2xl">
        <div className="panel overflow-hidden text-center">
          <div className="bg-ink p-8 text-white">
            <span className="mx-auto grid size-20 place-items-center rounded-full bg-amber font-display text-3xl font-bold text-ink">
              %{session.result.percentage}
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold">Çalışma tamamlandı</h1>
            <p className="mt-2 text-sm text-slate-300">Çalışma sonucun cihazına kaydedildi.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 p-5 sm:p-8">
            {[
              { label: 'Doğru', value: session.result.correct, color: 'text-emerald-600' },
              { label: 'Yanlış', value: session.result.wrong, color: 'text-coral' },
              { label: 'Boş', value: session.result.empty, color: 'text-slate-500' },
            ].map((item) => (
              <div className="rounded-2xl bg-ink/5 p-4 dark:bg-white/5" key={item.label}>
                <strong className={`block text-2xl ${item.color}`}>{item.value}</strong>
                <span className="text-xs font-bold text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 px-5 pb-7 sm:flex-row sm:justify-center">
            <Link to="/" className="btn-secondary"><Home size={18} /> Ana sayfa</Link>
            <Link to="/wrong" className="btn-primary"><XCircle size={18} /> Yanlışları incele</Link>
          </div>
        </div>
      </div>
    )
  }

  const answered = session.currentAnswer !== undefined
  return (
    <div className="page-enter mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-coral">Çalışma modu</p>
          <p className="mt-1 text-sm font-bold">Soru {session.currentIndex + 1} / {session.questions.length}</p>
        </div>
      </div>
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
        <div className="h-full rounded-full bg-amber transition-all" style={{ width: `${session.progress}%` }} />
      </div>
      <QuestionCard
        question={session.currentQuestion}
        selectedAnswer={session.currentAnswer}
        favorite={progress.favoriteQuestionIds.includes(session.currentQuestion.id)}
        onAnswer={session.answer}
        onToggleFavorite={() => toggleFavorite(session.currentQuestion.id)}
      />
      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={handleFinish} className="btn-secondary">
          <CheckCircle2 size={18} /> Testi bitir
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!answered}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          {session.currentIndex === session.questions.length - 1 ? 'Sonucu gör' : 'Sonraki soru'} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
