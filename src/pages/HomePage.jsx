import { ArrowRight, CalendarRange, Clock3, Flame, GraduationCap, Layers3, Play, RotateCcw, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CategoryCard } from '../components/CategoryCard'
import questions from '../data/questionBank'
import sgsExamData from '../data/sgsExams.json'
import { useProgress } from '../hooks/useProgress'
import { getCategorySummary } from '../utils/questions'

export function HomePage() {
  const { progress } = useProgress()
  const categories = getCategorySummary(questions)
  const accuracy = progress.totals.answered
    ? Math.round((progress.totals.correct / progress.totals.answered) * 100)
    : 0
  const today = new Date().toISOString().slice(0, 10)
  const sgsYears = sgsExamData.exams.map((exam) => exam.year)
  const firstSgsYear = Math.min(...sgsYears)
  const lastSgsYear = Math.max(...sgsYears)
  const sgsQuestionCount = sgsExamData.exams.reduce((sum, exam) => sum + exam.questionCount, 0)

  return (
    <div className="page-enter">
      <section className="relative overflow-hidden rounded-[2rem] bg-ink p-6 text-white shadow-lift sm:p-10">
        <div className="absolute -right-12 -top-16 size-64 rounded-full border-[40px] border-amber/15" />
        <div className="absolute bottom-0 right-1/4 h-28 w-px rotate-12 bg-white/10" />
        <div className="relative max-w-2xl">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-mint">Bugünün çalışma alanı</p>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
            SMMM yolculuğun, <span className="text-amber">kendi ritminde.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            Üyelik yok, dikkat dağıtan akış yok. Konunu seç, özgün soruları çöz ve gelişimini yalnızca cihazında tut.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/solve?mode=practice&limit=10" className="btn-primary bg-amber text-ink hover:bg-amber/90">
              <Play size={18} fill="currentColor" /> Hızlı pratik
            </Link>
            <Link to="/solve?mode=exam&limit=20" className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/15">
              <Clock3 size={18} /> Süreli sınav
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-3 gap-3">
        {[
          { label: 'Bugün', value: progress.dailyActivity[today] || 0, icon: Flame, suffix: 'soru' },
          { label: 'Doğruluk', value: accuracy, icon: Target, suffix: '%' },
          { label: 'Tekrar', value: progress.wrongQuestionIds.length, icon: RotateCcw, suffix: 'soru' },
        ].map((stat) => (
          <div className="panel p-4 sm:p-5" key={stat.label}>
            <stat.icon className="mb-3 text-coral" size={20} />
            <strong className="block text-xl sm:text-2xl">{stat.value}<span className="ml-1 text-xs text-slate-400">{stat.suffix}</span></strong>
            <span className="text-xs font-bold text-slate-500">{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="mt-7 grid gap-4 lg:grid-cols-3">
        <Link
          to="/past-exams"
          className="panel group relative overflow-hidden p-6 transition hover:-translate-y-1 hover:border-amber/60 lg:col-span-2"
        >
          <div className="absolute -right-10 -top-10 size-40 rounded-full border-[28px] border-amber/10" />
          <span className="grid size-12 place-items-center rounded-2xl bg-ink text-amber dark:bg-amber dark:text-ink">
            <CalendarRange size={22} />
          </span>
          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.2em] text-coral">Yeni çalışma alanı</p>
          <h2 className="mt-1 font-display text-2xl font-bold">Çıkmış Sorular</h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400">
            2020-2026 yıllarını tek tek incele veya farklı dönemleri karma bir oturumda çöz.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold">
            Yılları keşfet <ArrowRight className="transition group-hover:translate-x-1" size={16} />
          </span>
        </Link>
        <Link
          to="/past-exams/mixed"
          className="rounded-3xl bg-amber p-6 text-ink shadow-lift transition hover:-translate-y-1"
        >
          <Layers3 size={25} />
          <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.18em]">Karma mod</p>
          <h2 className="mt-1 font-display text-2xl font-bold">Son 3, son 5 veya tüm yıllar</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-ink/70">Ders ve konu filtresiyle kendi geçmiş sınav setini oluştur.</p>
        </Link>
      </section>

      <section className="mt-4">
        <Link
          to="/sgs-exams"
          className="group flex flex-col gap-5 overflow-hidden rounded-3xl bg-mint p-6 text-ink shadow-lift transition hover:-translate-y-1 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink text-mint">
              <GraduationCap size={24} />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-900/70">Gerçek sınav arşivi</p>
              <h2 className="mt-1 font-display text-2xl font-bold">SGS Staja Giriş Sınavları</h2>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-ink/70">
                {firstSgsYear} ve {lastSgsYear} dönemlerindeki {sgsExamData.exams.length} sınavı ayrı ayrı aç veya {sgsQuestionCount.toLocaleString('tr-TR')} soruyu karma modda çöz.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-extrabold">
            SGS arşivini aç <ArrowRight className="transition group-hover:translate-x-1" size={17} />
          </span>
        </Link>
      </section>

      <section className="mt-9">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-coral">Dersler</p>
            <h2 className="mt-1 font-display text-2xl font-bold">Nereden devam edeceksin?</h2>
          </div>
          <Link to="/categories" className="hidden items-center gap-1 text-sm font-bold sm:flex">Tümünü gör <ArrowRight size={16} /></Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => <CategoryCard category={category} compact key={category.name} />)}
        </div>
      </section>
    </div>
  )
}
