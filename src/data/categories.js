import {
  BookOpenCheck,
  BriefcaseBusiness,
  Calculator,
  Landmark,
  Scale,
  TrendingUp,
} from 'lucide-react'

export const categoryMeta = {
  Muhasebe: { icon: Calculator, color: 'bg-amber/20 text-amber-700 dark:text-amber' },
  Vergi: { icon: Landmark, color: 'bg-coral/15 text-coral' },
  Hukuk: { icon: Scale, color: 'bg-sky-500/15 text-sky-700 dark:text-sky-300' },
  Denetim: { icon: BookOpenCheck, color: 'bg-mint/20 text-emerald-700 dark:text-mint' },
  Maliye: { icon: BriefcaseBusiness, color: 'bg-violet-500/15 text-violet-700 dark:text-violet-300' },
  Ekonomi: { icon: TrendingUp, color: 'bg-blue-500/15 text-blue-700 dark:text-blue-300' },
}
