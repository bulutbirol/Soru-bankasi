import { Capacitor } from '@capacitor/core'

function WebAdSensePlaceholder() {
  return (
    <div className="flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-ink/20 bg-white/30 px-4 text-center text-xs font-bold tracking-wider text-slate-400 dark:border-white/15 dark:bg-white/[0.03]">
      WEB REKLAM ALANI · ADSENSE ENTEGRASYON NOKTASI
    </div>
  )
}

function MobileAdMobPlaceholder() {
  return (
    <div className="flex min-h-16 items-center justify-center rounded-2xl border border-dashed border-ink/20 bg-white/30 px-4 text-center text-xs font-bold tracking-wider text-slate-400 dark:border-white/15 dark:bg-white/[0.03]">
      MOBİL REKLAM ALANI · ADMOB ENTEGRASYON NOKTASI
    </div>
  )
}

export function AdSlot() {
  return Capacitor.isNativePlatform() ? <MobileAdMobPlaceholder /> : <WebAdSensePlaceholder />
}
