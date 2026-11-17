import { ArrowRight, Award, CalendarRange, Flame, GraduationCap, Play, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CategoryCard } from '../components/CategoryCard'
import questions from '../data/questionBank'
import qualificationData from '../data/qualificationExams.json'
import sgsExamData from '../data/sgsExams.json'
import { useProgress } from '../hooks/useProgress'
import { getAccuracy, getDueReviewIds, getStreak, getTodayCount } from '../storage/progress'
import { getCategorySummary } from '../utils/questions'

const RING = 2 * Math.PI * 40

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Günaydın'
  if (hour < 18) return 'İyi çalışmalar'
  return 'İyi akşamlar'
}

function GoalRing({ done, goal }) {
  const filled = Math.min(done / goal, 1) * RING
  return (
    <svg width="104" height="104" viewBox="0 0 96 96" role="img" aria-label={`Günlük hedef: ${goal} sorudan ${done} tanesi tamam`} className="shrink-0">
      <circle cx="48" cy="48" r="40" fill="none" strokeWidth="10" className="stroke-ink/10 dark:stroke-white/10" />
      <circle
        cx="48" cy="48" r="40" fill="none" strokeWidth="10" strokeLinecap="round"
        className="stroke-mint transition-all" strokeDasharray={`${filled} ${RING}`} transform="rotate(-90 48 48)"
      />
      <text x="48" y="47" textAnchor="middle" className="fill-current font-display text-[22px] font-bold">{Math.min(done, goal)}/{goal}</text>
      <text x="48" y="64" textAnchor="middle" className="fill-slate-500 text-[11px] font-bold">bugün</text>
    </svg>
  )
}

export function HomePage() {
  const { progress } = useProgress()
  const goal = progress.settings.dailyGoal
  const today = getTodayCount(progress)
  const streak = getStreak(progress)
  const accuracy = getAccuracy(progress)
  const dueIds = getDueReviewIds(progress)
  const reviewCount = new Set([...dueIds, ...progress.unknownQuestionIds]).size
  const remaining = Math.max(goal - today, 0)
  const continueTo = dueIds.length
    ? `/solve?collection=review&limit=${goal}`
    : `/solve?source=sgs&limit=${remaining || 5}`
  const sgsQuestionCount = sgsExamData.exams.reduce((sum, exam) => sum + exam.questionCount, 0)
  const qualificationDocumentCount = qualificationData.documents.filter((document) => document.available).length
  const categories = getCategorySummary(questions)

  const message = remaining
    ? <>{remaining} soru daha çözersen serin <b className="text-amber-700 dark:text-amber">{today ? streak : streak + 1} güne</b> çıkar.</>
    : <>Bugünkü hedef tamam. Serin <b className="text-amber-700 dark:text-amber">{streak} gün</b>, böyle devam.</>

  return (
    <div className="page-enter mx-auto flex max-w-3xl flex-col gap-5">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{greeting()}</p>
          <h1 className="mt-1 font-display text-3xl font-bold">Bugün {goal} soru yeter.</h1>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber/40 bg-amber/15 px-3 py-2 text-sm font-extrabold text-amber-700 dark:text-amber">
          <Flame size={16} /> {streak} gün
        </span>
      </header>

      <section className="panel flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
        <GoalRing done={today} goal={goal} />
        <div className="flex flex-1 flex-col gap-3">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{message}</p>
          <Link to={continueTo} className="btn-primary bg-amber text-ink hover:bg-amber/90 dark:bg-amber">
            <Play size={18} fill="currentColor" /> Kaldığın yerden devam
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <div className="panel p-4">
          <strong className="block font-display text-2xl">{progress.totals.answered}</strong>
          <span className="text-xs font-bold text-slate-500">çözülen soru</span>
        </div>
        <div className="panel p-4">
          <strong className="block font-display text-2xl">%{accuracy}</strong>
          <span className="text-xs font-bold text-slate-500">doğruluk</span>
        </div>
        <div className="panel p-4">
          <strong className="block font-display text-2xl text-coral">{reviewCount}</strong>
          <span className="text-xs font-bold text-slate-500">tekrar bekliyor</span>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">Ne çalışalım?</p>
        <Link to="/sgs-exams" className="flex items-center gap-4 rounded-3xl bg-mint p-4 text-ink shadow-lift transition hover:-translate-y-0.5">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink/10"><GraduationCap size={22} /></span>
          <span className="flex-1"><b className="block">SGS çıkmış sorular</b><span className="text-sm font-semibold">{sgsExamData.exams.length} sınav · {sgsQuestionCount.toLocaleString('tr-TR')} soru</span></span>
          <ArrowRight size={18} />
        </Link>
        <Link to="/qualification-exams" className="panel flex items-center gap-4 p-4 transition hover:-translate-y-0.5">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber/15 text-amber-700 dark:text-amber"><Award size={22} /></span>
          <span className="flex-1"><b className="block">SMMM Yeterlilik Sınavları</b><span className="text-sm font-semibold text-slate-500">{qualificationDocumentCount} kaynak belgeden açıklamalı sorular</span></span>
          <ArrowRight size={18} />
        </Link>
        <Link to="/past-exams" className="panel flex items-center gap-4 p-4 transition hover:-translate-y-0.5">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink/5 dark:bg-white/10"><CalendarRange size={22} /></span>
          <span className="flex-1"><b className="block">Çıkmış Sorular</b><span className="text-sm font-semibold text-slate-500">2020-2026 yıllık setler ve karma mod</span></span>
          <ArrowRight size={18} />
        </Link>
        <Link to="/solve?collection=review" className="panel flex items-center gap-4 p-4 transition hover:-translate-y-0.5">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-coral/15 text-coral"><RotateCcw size={22} /></span>
          <span className="flex-1"><b className="block">Tekrar listesi</b><span className="text-sm font-semibold text-slate-500">Yanlışlar ve “Bilmiyorum” dediklerin</span></span>
          <span className="font-extrabold text-coral">{reviewCount}</span>
        </Link>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">Konu testleri</p>
          <Link to="/categories" className="flex items-center gap-1 text-sm font-bold">Tümünü gör <ArrowRight size={16} /></Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((category) => <CategoryCard category={category} compact key={category.name} />)}
        </div>
      </section>
    </div>
  )
}
