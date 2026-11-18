import { Award, CalendarRange, Check, ChevronRight, Flame, GraduationCap, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CategoryCard } from '../components/CategoryCard'
import questions from '../data/questionBank'
import qualificationData from '../data/qualificationExams.json'
import sgsExamData from '../data/sgsExams.json'
import { useProgress } from '../hooks/useProgress'
import { getAccuracy, getDueReviewIds, getStreak, getTodayCount } from '../storage/progress'
import { getCategorySummary } from '../utils/questions'

function AreaLink({ to, icon: Icon, tone, title, subtitle, end }) {
  return (
    <Link to={to} className="card-press flex items-center gap-4 p-4">
      <span className={`grid size-[52px] shrink-0 place-items-center rounded-2xl ${tone}`}>
        <Icon size={24} strokeWidth={2.6} />
      </span>
      <span className="min-w-0 flex-1">
        <b className="block text-base font-black">{title}</b>
        <span className="text-sm font-bold text-muted">{subtitle}</span>
      </span>
      {end ?? <ChevronRight className="text-muted" size={20} strokeWidth={2.8} />}
    </Link>
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

  return (
    <div className="page-enter mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
      <div className="flex flex-col gap-4 lg:sticky lg:top-24">
        <div className="flex flex-wrap gap-2">
          <span className="chip border-sun/60 bg-sun-soft text-sun-ink"><Flame size={17} fill="currentColor" /> {streak} gün</span>
          <span className="chip border-brand/40 bg-brand-soft text-brand-ink"><Check size={17} strokeWidth={3} /> %{accuracy}</span>
          <span className="chip ml-auto border-danger/40 bg-danger-soft text-danger"><RotateCcw size={17} strokeWidth={3} /> {reviewCount}</span>
        </div>

        <section className="panel flex flex-col gap-4 p-5">
          <h1 className="text-2xl font-black">Bugün {goal} soru yeter.</h1>
          <div className="flex items-center gap-3">
            <div
              className="h-[18px] flex-1 overflow-hidden rounded-full bg-line"
              role="img"
              aria-label={`Günlük hedef: ${goal} sorudan ${Math.min(today, goal)} tanesi tamam`}
            >
              <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${Math.min(today / goal, 1) * 100}%` }} />
            </div>
            <span className="font-black text-brand-ink">{Math.min(today, goal)}/{goal}</span>
          </div>
          <p className="text-sm font-bold text-muted">
            {remaining
              ? `${remaining} soru daha çöz, serini ${today ? streak : streak + 1} güne çıkar!`
              : `Bugünkü görev tamam! Serin ${streak} gün.`}
          </p>
          <Link to={continueTo} className="btn-primary">Kaldığın yerden devam</Link>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <div className="panel p-4">
            <strong className="block text-2xl font-black">{progress.totals.answered}</strong>
            <span className="text-xs font-extrabold text-muted">çözülen soru</span>
          </div>
          <div className="panel p-4">
            <strong className="block text-2xl font-black">{progress.unknownQuestionIds.length}</strong>
            <span className="text-xs font-extrabold text-muted">öğrenilecek</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-black">Nereden çalışalım?</h2>
        <AreaLink to="/sgs-exams" icon={GraduationCap} tone="bg-brand text-white shadow-[0_3px_0_rgb(var(--c-brand-deep))]" title="SGS çıkmış sorular" subtitle={`${sgsExamData.exams.length} sınav · ${sgsQuestionCount.toLocaleString('tr-TR')} soru`} />
        <AreaLink to="/qualification-exams" icon={Award} tone="bg-sun text-[#4a3300] shadow-[0_3px_0_rgb(var(--c-sun-deep))]" title="SMMM Yeterlilik Sınavları" subtitle={`${qualificationDocumentCount} kaynak belgeden açıklamalı sorular`} />
        <AreaLink to="/past-exams" icon={CalendarRange} tone="bg-sky text-white shadow-[0_3px_0_rgb(var(--c-sky-deep))]" title="Çıkmış Sorular" subtitle="2020-2026 yıllık setler ve karma mod" />
        <AreaLink
          to="/solve?collection=review"
          icon={RotateCcw}
          tone="bg-danger text-white"
          title="Tekrar listesi"
          subtitle="Yanlışlar ve “Bilmiyorum” dediklerin"
          end={<span className="font-black text-danger">{reviewCount}</span>}
        />

        <div className="mt-4 flex items-end justify-between">
          <h2 className="text-lg font-black">Konu testleri</h2>
          <Link to="/categories" className="text-sm font-black text-sky">Tümünü gör</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((category) => <CategoryCard category={category} compact key={category.name} />)}
        </div>
      </div>
    </div>
  )
}
