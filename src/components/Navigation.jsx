import {
  BarChart3,
  Award,
  BookOpen,
  Heart,
  Home,
  Info,
  ListTree,
  CalendarRange,
  GraduationCap,
  Settings,
  XCircle,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const primary = [
  { to: '/', label: 'Ana Sayfa', icon: Home },
  { to: '/categories', label: 'Dersler', icon: ListTree },
  { to: '/past-exams', label: 'Çıkmış Sorular', icon: CalendarRange, desktopOnly: true },
  { to: '/sgs-exams', label: 'SGS Sınavları', icon: GraduationCap, desktopOnly: true },
  { to: '/qualification-exams', label: 'Yeterlilik', icon: Award, desktopOnly: true },
  { to: '/wrong', label: 'Yanlışlar', icon: XCircle },
  { to: '/favorites', label: 'Favoriler', icon: Heart },
  { to: '/statistics', label: 'İstatistik', icon: BarChart3 },
]

const secondary = [
  { to: '/settings', label: 'Ayarlar', icon: Settings },
  { to: '/about', label: 'Hakkında', icon: Info },
]

function NavItem({ item, mobile = false }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        mobile
          ? `flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-bold ${
              isActive ? 'bg-amber text-ink' : 'text-slate-500 dark:text-slate-400'
            }`
          : `flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition ${
              isActive
                ? 'bg-amber text-ink'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`
      }
    >
      <Icon size={mobile ? 20 : 19} />
      <span>{item.label}</span>
    </NavLink>
  )
}

export function Navigation() {
  const mobilePrimary = primary.filter((item) => !item.desktopOnly)

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col bg-ink p-6 text-white lg:flex">
        <NavLink to="/" className="mb-10 flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-amber text-ink">
            <BookOpen size={24} />
          </span>
          <span>
            <strong className="block font-display text-xl">SMMM</strong>
            <span className="text-xs font-semibold tracking-[0.16em] text-slate-400">SORU BANKASI</span>
          </span>
        </NavLink>
        <nav className="space-y-2" aria-label="Ana menü">
          {primary.map((item) => <NavItem item={item} key={item.to} />)}
        </nav>
        <nav className="mt-auto space-y-2 border-t border-white/10 pt-5" aria-label="Diğer">
          {secondary.map((item) => <NavItem item={item} key={item.to} />)}
        </nav>
        <p className="mt-6 text-xs leading-5 text-slate-500">Üyeliksiz. Çevrimdışı. Veriler yalnızca bu cihazda.</p>
      </aside>

      <header className="flex items-center justify-between px-4 pt-4 lg:hidden">
        <NavLink to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid size-9 place-items-center rounded-xl bg-ink text-amber dark:bg-amber dark:text-ink">
            <BookOpen size={18} />
          </span>
          SMMM Soru Bankası
        </NavLink>
        <NavLink to="/settings" aria-label="Ayarlar" className="grid size-10 place-items-center rounded-xl bg-white/70 dark:bg-white/10">
          <Settings size={20} />
        </NavLink>
      </header>

      <nav
        className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl border border-ink/10 bg-white/95 p-2 shadow-lift backdrop-blur dark:border-white/10 dark:bg-ink/95 lg:hidden"
        aria-label="Mobil menü"
      >
        {mobilePrimary.map((item) => <NavItem item={item} key={item.to} mobile />)}
      </nav>
    </>
  )
}
