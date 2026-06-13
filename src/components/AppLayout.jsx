import { Outlet } from 'react-router-dom'
import { AdSlot } from './ads/AdSlot'
import { Navigation } from './Navigation'

export function AppLayout() {
  return (
    <div className="min-h-screen text-ink dark:text-slate-100">
      <Navigation />
      <main className="pb-28 lg:ml-72 lg:pb-10">
        <div className="mx-auto max-w-6xl px-4 pb-6 pt-5 sm:px-6 lg:px-8 lg:pt-9">
          <Outlet />
          <div className="mt-8">
            <AdSlot />
          </div>
        </div>
      </main>
    </div>
  )
}
