import { ChevronLeft, ChevronRight, Flame, RotateCcw, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { QuestionCard } from '../components/QuestionCard'
import pastExamQuestions from '../data/pastExamQuestions.json'
import qualificationQuestions from '../data/qualificationQuestions.json'
import questions from '../data/questionBank'
import sgsExamQuestions from '../data/sgsExamQuestions.json'
import sgsExamData from '../data/sgsExams.json'
import { useProgress } from '../hooks/useProgress'
import { useQuestionSession } from '../hooks/useQuestionSession'
import { getDueReviewIds, getStreak, getTodayCount, localDate } from '../storage/progress'
import { filterPastExamQuestions, parseYears } from '../utils/pastExams'
import { filterQuestions, pickSessionQuestions } from '../utils/questions'
import { filterSgsQuestions, parseExamIds } from '../utils/sgsExams'

const MAX_SEGMENTS = 30

function buildSource(params, progress) {
  const category = params.get('category') || ''
  const topic = params.get('topic') || ''
  const collection = params.get('collection')
  const sourceType = params.get('source')
  const examIdsParam = params.get('examIds') || ''
  const documentIdsParam = params.get('documentIds') || ''
  const allQuestions = [...questions, ...pastExamQuestions, ...sgsExamQuestions, ...qualificationQuestions]
  let filtered

  if (collection) {
    let ids
    if (collection === 'wrong') ids = progress.wrongQuestionIds
    if (collection === 'favorites') ids = progress.favoriteQuestionIds
    if (collection === 'review') ids = [...new Set([...getDueReviewIds(progress), ...progress.unknownQuestionIds])]
    filtered = filterQuestions(allQuestions, { category, topic, ids })
  } else if (sourceType === 'past_exam') {
    filtered = filterPastExamQuestions(pastExamQuestions, { years: parseYears(params.get('years') || ''), category, topic })
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
    filtered = filterQuestions(questions, { category, topic })
  }

  const limit = Number(params.get('limit') || progress.settings.questionCount)
  return pickSessionQuestions(filtered, collection ? {} : progress.answeredById, limit)
}

function segmentColor(question, firstAnswer, current) {
  if (firstAnswer === undefined) return current ? 'bg-amber' : 'bg-ink/10 dark:bg-white/10'
  if (firstAnswer === 'unknown') return 'bg-amber/60'
  return firstAnswer === question.answer ? 'bg-mint' : 'bg-coral'
}

function SessionEnd({ result, progress, moreLink }) {
  const streak = getStreak(progress)
  const today = getTodayCount(progress)
  const goal = progress.settings.dailyGoal
  const reviewCount = new Set([...Object.keys(progress.review), ...progress.unknownQuestionIds]).size
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    return {
      key: localDate(date),
      label: date.toLocaleDateString('tr-TR', { weekday: 'short' }),
      done: Boolean(progress.dailyActivity[localDate(date)]),
      today: index === 6,
    }
  })

  return (
    <div className="page-enter mx-auto flex max-w-md flex-col gap-5 py-4 text-center">
      <span className="mx-auto grid size-24 place-items-center rounded-full border-2 border-amber/50 bg-amber/15 text-amber-700 dark:text-amber">
        <Flame size={44} />
      </span>
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-700 dark:text-amber">
          {today >= goal ? 'Günlük hedef tamam' : 'Oturum tamam'}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold">{streak} gün seri</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {today >= goal
            ? 'Bugünkü hedefini tamamladın. Yarın 10 soru daha.'
            : `Hedefe ${goal - today} soru kaldı. Bir tur daha ister misin?`}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'doğru', value: result.correct, color: 'text-emerald-700 dark:text-mint' },
          { label: 'yanlış', value: result.wrong, color: 'text-coral' },
          { label: 'öğrenildi', value: result.unknown, color: 'text-amber-700 dark:text-amber' },
        ].map((item) => (
          <div className="panel p-4" key={item.label}>
            <strong className={`block font-display text-2xl ${item.color}`}>{item.value}</strong>
            <span className="text-xs font-bold text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="panel p-4 text-left">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Bu hafta</p>
        <div className="mt-3 grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-slate-500">
          {week.map((day) => (
            <div className="flex flex-col items-center gap-1.5" key={day.key}>
              <span className={`size-8 rounded-xl ${day.done ? (day.today ? 'bg-amber' : 'bg-mint') : 'bg-ink/10 dark:bg-white/10'}`} />
              {day.label}
            </div>
          ))}
        </div>
      </div>
      {reviewCount > 0 && (
        <Link to="/solve?collection=review" className="panel flex items-center gap-3 p-4 text-left text-sm">
          <RotateCcw className="text-coral" size={20} />
          <span><strong>{reviewCount} soru</strong> tekrar listende. Önce onlarla başlayabilirsin.</span>
        </Link>
      )}
      <div className="flex flex-col gap-2">
        <Link to={moreLink} className="btn-primary">5 soru daha çöz</Link>
        <Link to="/" className="btn-secondary">Bugünlük yeter</Link>
      </div>
    </div>
  )
}

function SolveSession() {
  const [params] = useSearchParams()
  const { progress, answer: recordAnswer, finishSession, toggleFavorite } = useProgress()
  const [source] = useState(() => buildSource(params, progress))
  const recordedAnswers = useRef(new Set())
  const recordedSession = useRef(false)
  const session = useQuestionSession(source, { shuffleOptions: progress.settings.shuffleOptions })
  const sourceType = params.get('source')
  const category = params.get('category') || ''

  const recordQuestionAnswer = useCallback((question, optionIndex) => {
    if (!question || optionIndex === undefined || recordedAnswers.current.has(question.id)) return
    recordedAnswers.current.add(question.id)
    recordAnswer({
      questionId: question.id,
      result: optionIndex === 'unknown' ? 'unknown' : optionIndex === question.answer ? 'correct' : 'wrong',
      category: question.category,
    })
  }, [recordAnswer])

  const handleAnswer = (optionIndex) => {
    recordQuestionAnswer(session.currentQuestion, optionIndex)
    session.answer(optionIndex)
  }

  useEffect(() => {
    if (!session.finished || recordedSession.current || !session.questions.length) return
    recordedSession.current = true
    finishSession({
      mode: 'learning',
      category: category || (sourceType === 'past_exam' ? 'Çıkmış Sorular' : sourceType === 'sgs' ? 'SGS' : sourceType === 'qualification' ? 'SMMM Yeterlilik' : 'Karma'),
      ...session.result,
    })
  }, [category, finishSession, session.finished, session.questions.length, session.result, sourceType])

  if (!source.length) {
    const collection = params.get('collection')
    return (
      <EmptyState
        title="Çözülecek soru kalmadı"
        description={collection === 'wrong' || collection === 'review' ? 'Tekrar listen temiz. Yeni sorular çözerek devam edebilirsin.' : 'Bu seçim için soru bulunamadı.'}
      />
    )
  }

  if (session.finished) {
    const more = new URLSearchParams(params)
    more.set('limit', '5')
    return <SessionEnd result={session.result} progress={progress} moreLink={`/solve?${more}`} />
  }

  const total = session.questions.length
  const done = Object.keys(session.firstAnswers).length
  const answered = session.currentAnswer !== undefined
  const last = session.currentIndex === total - 1

  return (
    <div className="page-enter mx-auto flex max-w-xl flex-col gap-4">
      <div className="flex items-center gap-3">
        <Link to="/" aria-label="Oturumu kapat" className="grid size-11 shrink-0 place-items-center rounded-2xl bg-ink/5 text-slate-500 dark:bg-white/10">
          <X size={20} />
        </Link>
        <div className="flex-1" role="img" aria-label={`${total} sorudan ${done} tanesi tamam`}>
          {total <= MAX_SEGMENTS ? (
            <div className="flex gap-1">
              {session.questions.map((question, index) => (
                <span
                  key={question.id}
                  className={`h-2 flex-1 rounded-full ${segmentColor(question, session.firstAnswers[question.id], index === session.currentIndex)}`}
                />
              ))}
            </div>
          ) : (
            <div className="h-2 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
              <div className="h-full rounded-full bg-amber transition-all" style={{ width: `${(done / total) * 100}%` }} />
            </div>
          )}
        </div>
        <span className="text-sm font-extrabold text-slate-500">{session.currentIndex + 1}/{total}</span>
      </div>
      <QuestionCard
        question={session.currentQuestion}
        selectedAnswer={session.currentAnswer}
        favorite={progress.favoriteQuestionIds.includes(session.currentQuestion.id)}
        onAnswer={handleAnswer}
        onToggleFavorite={() => toggleFavorite(session.currentQuestion.id)}
      />
      <div className="flex gap-2">
        <button type="button" onClick={session.prev} disabled={!session.canGoBack} className="btn-secondary flex-1 disabled:cursor-not-allowed disabled:opacity-40">
          <ChevronLeft size={18} /> Önceki soru
        </button>
        <button type="button" onClick={session.next} className={`flex-1 ${answered ? 'btn-primary' : 'btn-secondary'}`}>
          {last ? 'Sonucu gör' : answered ? 'Sonraki soru' : 'Boş bırak'} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

export function SolvePage() {
  const location = useLocation()
  return <SolveSession key={location.key} />
}
