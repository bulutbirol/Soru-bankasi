import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/AppLayout'
import { CategoriesPage } from '../pages/CategoriesPage'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { TopicsPage } from '../pages/TopicsPage'

const lazyPage = (loader, name) =>
  lazy(() => loader().then((module) => ({ default: module[name] })))

const AboutPage = lazyPage(() => import('../pages/AboutPage'), 'AboutPage')
const CollectionPage = lazyPage(() => import('../pages/CollectionPage'), 'CollectionPage')
const PastExamMixedPage = lazyPage(() => import('../pages/PastExamMixedPage'), 'PastExamMixedPage')
const PastExamsPage = lazyPage(() => import('../pages/PastExamsPage'), 'PastExamsPage')
const PastExamYearPage = lazyPage(() => import('../pages/PastExamYearPage'), 'PastExamYearPage')
const SettingsPage = lazyPage(() => import('../pages/SettingsPage'), 'SettingsPage')
const SgsExamPage = lazyPage(() => import('../pages/SgsExamPage'), 'SgsExamPage')
const SgsExamsPage = lazyPage(() => import('../pages/SgsExamsPage'), 'SgsExamsPage')
const SgsMixedPage = lazyPage(() => import('../pages/SgsMixedPage'), 'SgsMixedPage')
const SolvePage = lazyPage(() => import('../pages/SolvePage'), 'SolvePage')
const StatisticsPage = lazyPage(() => import('../pages/StatisticsPage'), 'StatisticsPage')

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="panel p-6 text-sm font-bold">Sayfa yükleniyor...</div>}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/:category" element={<TopicsPage />} />
          <Route path="past-exams" element={<PastExamsPage />} />
          <Route path="past-exams/mixed" element={<PastExamMixedPage />} />
          <Route path="past-exams/:year" element={<PastExamYearPage />} />
          <Route path="sgs-exams" element={<SgsExamsPage />} />
          <Route path="sgs-exams/mixed" element={<SgsMixedPage />} />
          <Route path="sgs-exams/:examId" element={<SgsExamPage />} />
          <Route path="solve" element={<SolvePage />} />
          <Route path="wrong" element={<CollectionPage type="wrong" />} />
          <Route path="favorites" element={<CollectionPage type="favorites" />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
