import {
  BookOpenCheck,
  BriefcaseBusiness,
  Calculator,
  Landmark,
  Scale,
  TrendingUp,
} from 'lucide-react'

export const categoryMeta = {
  Muhasebe: { icon: Calculator, color: 'bg-brand text-white shadow-[0_3px_0_rgb(var(--c-brand-deep))]' },
  Vergi: { icon: Landmark, color: 'bg-danger text-white' },
  Hukuk: { icon: Scale, color: 'bg-sky text-white shadow-[0_3px_0_rgb(var(--c-sky-deep))]' },
  Denetim: { icon: BookOpenCheck, color: 'bg-sun text-[#4a3300] shadow-[0_3px_0_rgb(var(--c-sun-deep))]' },
  Maliye: { icon: BriefcaseBusiness, color: 'bg-violet-500 text-white shadow-[0_3px_0_#6d28d9]' },
  Ekonomi: { icon: TrendingUp, color: 'bg-teal-500 text-white shadow-[0_3px_0_#0f766e]' },
}
