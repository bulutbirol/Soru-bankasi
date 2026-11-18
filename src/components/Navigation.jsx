import {
  Award,
  BarChart3,
  CalendarRange,
  GraduationCap,
  Heart,
  Home,
  Info,
  ListTree,
  RotateCcw,
  Settings,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const desktop = [
  { to: '/', label: 'Bugün', icon: Home },
  { to: '/sgs-exams', label: 'SGS', icon: GraduationCap },
  { to: '/qualification-exams', label: 'Yeterlilik', icon: Award },
  { to: '/past-exams', label: 'Çıkmış Sorular', icon: CalendarRange },
  { to: '/categories', label: 'Dersler', icon: ListTree },
  { to: '/wrong', label: 'Tekrar', icon: RotateCcw },
  { to: '/favorites', label: 'Favoriler', icon: Heart },
  { to: '/statistics', label: 'Gelişim', icon: BarChart3 },
]

const mobile = [
  { to: '/', label: 'Bugün', icon: Home },
  { to: '/sgs-exams', label: 'Sınavlar', icon: GraduationCap },
  { to: '/categories', label: 'Dersler', icon: ListTree },
  { to: '/wrong', label: 'Tekrar', icon: RotateCcw },
  { to: '/statistics', label: 'Gelişim', icon: BarChart3 },
]

const activeClass = 'border-brand bg-brand-soft text-brand-ink'
const idleClass = 'border-transparent text-muted hover:text-fg'

function Logo() {
  return (
    <NavLink to="/" className="flex items-center gap-2.5 font-black">
      <span className="grid size-10 place-items-center rounded-2xl bg-brand text-lg text-white shadow-[0_3px_0_rgb(var(--c-brand-deep))]">S</span>
      <span className="whitespace-nowrap leading-tight">SMMM<span className="block text-xs font-extrabold text-muted">Soru Bankası</span></span>
    </NavLink>
  )
}

export function Navigation() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b-2 border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Logo />
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Ana menü">
            {desktop.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `flex items-center gap-2 whitespace-nowrap rounded-2xl border-2 px-3 py-2 text-sm font-extrabold transition ${isActive ? activeClass : idleClass}`}
              >
                <item.icon size={17} strokeWidth={2.6} />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <nav className="ml-auto flex items-center gap-1" aria-label="Diğer">
            <NavLink to="/about" aria-label="Hakkında" className="grid size-11 place-items-center rounded-2xl text-muted hover:text-fg">
              <Info size={20} strokeWidth={2.6} />
            </NavLink>
            <NavLink to="/settings" aria-label="Ayarlar" className="grid size-11 place-items-center rounded-2xl text-muted hover:text-fg">
              <Settings size={20} strokeWidth={2.6} />
            </NavLink>
          </nav>
        </div>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 gap-1 border-t-2 border-line bg-bg px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 lg:hidden"
        aria-label="Mobil menü"
      >
        {mobile.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `flex flex-col items-center gap-0.5 rounded-2xl border-2 py-1.5 text-[11px] font-black ${isActive ? activeClass : idleClass}`}
          >
            <item.icon size={21} strokeWidth={2.6} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}
