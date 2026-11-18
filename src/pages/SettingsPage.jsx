import { Moon, RotateCcw, Shuffle, Sun, Timer } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useProgress } from '../hooks/useProgress'

export function SettingsPage() {
  const { progress, updateSettings, reset } = useProgress()
  const settings = progress.settings

  const handleReset = () => {
    if (window.confirm('Tüm ilerleme, yanlışlar, favoriler ve istatistikler silinsin mi?')) reset()
  }

  return (
    <div className="page-enter">
      <PageHeader eyebrow="Kişiselleştir" title="Çalışma düzenin sana uysun." description="Ayarlar yalnızca bu cihazda saklanır." />
      <div className="space-y-4">
        <section className="panel p-6">
          <h2 className="text-xl font-black">Görünüm</h2>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { value: 'light', label: 'Açık', icon: Sun },
              { value: 'dark', label: 'Koyu', icon: Moon },
              { value: 'system', label: 'Sistem', icon: Shuffle },
            ].map((theme) => (
              <button
                type="button"
                key={theme.value}
                onClick={() => updateSettings({ theme: theme.value })}
                className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border font-bold ${
                  settings.theme === theme.value ? 'border-sun bg-sun-soft' : 'border-line '
                }`}
              >
                <theme.icon size={21} /> {theme.label}
              </button>
            ))}
          </div>
        </section>

        <section className="panel divide-y divide-line p-6">
          <SettingRow icon={Shuffle} label="Seçenekleri karıştır" description="Her oturumda seçenek sırasını değiştir.">
            <input
              type="checkbox"
              checked={settings.shuffleOptions}
              onChange={(event) => updateSettings({ shuffleOptions: event.target.checked })}
              className="size-5 accent-[rgb(var(--c-brand))]"
            />
          </SettingRow>
          <SettingRow icon={Timer} label="Varsayılan soru sayısı" description="Konu ve hızlı pratik oturumları için.">
            <select
              value={settings.questionCount}
              onChange={(event) => updateSettings({ questionCount: Number(event.target.value) })}
              className="rounded-xl border border-line bg-transparent px-3 py-2 font-bold"
            >
              {[5, 10, 20, 30].map((value) => <option value={value} key={value}>{value}</option>)}
            </select>
          </SettingRow>
          <SettingRow
            icon={Timer}
            label="Otomatik sınav süresi"
            description="Süre, resmî 130 soru / 165 dakika oranına göre soru sayısıyla birlikte artar."
          >
            <span className="rounded-xl bg-line/60 px-3 py-2 text-xs font-bold">Otomatik</span>
          </SettingRow>
        </section>

        <section className="panel border-danger p-6">
          <h2 className="text-xl font-black text-danger">Verileri sıfırla</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Bu işlem cihazdaki bütün çalışma geçmişini kalıcı olarak kaldırır. Sorular silinmez.</p>
          <button type="button" onClick={handleReset} className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-danger px-5 py-3 font-bold text-white">
            <RotateCcw size={18} /> İlerlemeyi sıfırla
          </button>
        </section>
      </div>
    </div>
  )
}

function SettingRow({ icon: Icon, label, description, children }) {
  return (
    <div className="flex items-center gap-4 py-5 first:pt-0 last:pb-0">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-line/60"><Icon size={20} /></span>
      <div className="flex-1">
        <strong className="block">{label}</strong>
        <span className="text-xs leading-5 text-muted">{description}</span>
      </div>
      {children}
    </div>
  )
}
