import { Outlet, useLocation } from 'react-router-dom'
import { Navigation } from './Navigation'

export function AppLayout() {
  const focus = useLocation().pathname === '/solve'

  if (focus) {
    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-6xl px-4 pb-10 pt-5 sm:px-6">
          <Outlet />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pb-28 lg:pb-12">
        <div className="mx-auto max-w-6xl px-4 pb-6 pt-5 sm:px-6 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
