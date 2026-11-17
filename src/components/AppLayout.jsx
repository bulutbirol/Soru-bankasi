import { Outlet, useLocation } from 'react-router-dom'
import { Navigation } from './Navigation'

export function AppLayout() {
  const focus = useLocation().pathname === '/solve'

  if (focus) {
    return (
      <div className="min-h-screen text-ink dark:text-slate-100">
        <main className="mx-auto max-w-6xl px-4 pb-10 pt-5 sm:px-6">
          <Outlet />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-ink dark:text-slate-100">
      <Navigation />
      <main className="pb-28 lg:ml-72 lg:pb-10">
        <div className="mx-auto max-w-6xl px-4 pb-6 pt-5 sm:px-6 lg:px-8 lg:pt-9">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
