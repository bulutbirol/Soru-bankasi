import { BarChart3, CheckCircle2, Target, Trophy } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useProgress } from '../hooks/useProgress'
import { getAccuracy } from '../storage/progress'
import { formatDate } from '../utils/format'

export function StatisticsPage() {
  const { progress } = useProgress()
  const accuracy = getAccuracy(progress)
  const categoryEntries = Object.entries(progress.byCategory)
  const lastSevenDays = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - offset))
    const key = date.toISOString().slice(0, 10)
    return {
      key,
      label: new Intl.DateTimeFormat('tr-TR', { weekday: 'short' }).format(date).slice(0, 2),
      value: progress.dailyActivity[key] || 0,
    }
  })
  const maxActivity = Math.max(1, ...lastSevenDays.map((day) => day.value))

  return (
    <div className="page-enter">
      <PageHeader
        eyebrow="Yerel performans"
        title="Rakamlar çalışma ritmini anlatsın."
        description="Bu istatistiklerin tamamı yalnızca cihazında saklanır."
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Çözülen', value: progress.totals.answered, icon: BarChart3 },
          { label: 'Doğru', value: progress.totals.correct, icon: CheckCircle2 },
          { label: 'Doğruluk', value: `%${accuracy}`, icon: Target },
          { label: 'Tamamlanan test', value: progress.totals.exams, icon: Trophy },
        ].map((item) => (
          <div className="panel p-5" key={item.label}>
            <item.icon className="text-danger" size={22} />
            <strong className="mt-4 block text-3xl">{item.value}</strong>
            <span className="text-xs font-bold text-muted">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-5">
        <section className="panel p-6 lg:col-span-3">
          <h2 className="text-xl font-black">Son 7 gün</h2>
          <div className="mt-7 flex h-48 items-end gap-3">
            {lastSevenDays.map((day) => (
              <div className="flex h-full flex-1 flex-col items-center justify-end gap-2" key={day.key}>
                <span className="text-xs font-bold">{day.value}</span>
                <div
                  className="w-full max-w-12 rounded-t-xl bg-sun transition-all"
                  style={{ height: `${Math.max(6, (day.value / maxActivity) * 130)}px` }}
                />
                <span className="text-[11px] font-bold uppercase text-muted">{day.label}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="panel p-6 lg:col-span-2">
          <h2 className="text-xl font-black">Ders başarısı</h2>
          <div className="mt-5 space-y-5">
            {categoryEntries.length ? categoryEntries.map(([name, stats]) => {
              const percent = Math.round((stats.correct / stats.answered) * 100)
              return (
                <div key={name}>
                  <div className="mb-2 flex justify-between text-xs font-bold">
                    <span>{name}</span><span>%{percent}</span>
                  </div>
                  <div className="h-2 rounded-full bg-line/60">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              )
            }) : <p className="text-sm leading-6 text-muted">Ders bazlı grafikler ilk cevaplarından sonra burada oluşacak.</p>}
          </div>
        </section>
      </div>

      {progress.recentSessions.length > 0 && (
        <section className="panel mt-5 p-6">
          <h2 className="text-xl font-black">Son çalışmalar</h2>
          <div className="mt-4 divide-y divide-line">
            {progress.recentSessions.slice(0, 5).map((session, index) => (
              <div className="flex items-center justify-between gap-4 py-4" key={`${session.completedAt}-${index}`}>
                <div>
                  <strong className="block">{session.category}</strong>
                  <span className="text-xs text-muted">{formatDate(session.completedAt)} · Çalışma</span>
                </div>
                <span className="rounded-xl bg-brand px-3 py-2 font-black text-white">%{session.percentage}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
