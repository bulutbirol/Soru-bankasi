import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/AppLayout'
import { AboutPage } from '../pages/AboutPage'
import { CategoriesPage } from '../pages/CategoriesPage'
import { CollectionPage } from '../pages/CollectionPage'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PastExamMixedPage } from '../pages/PastExamMixedPage'
import { PastExamsPage } from '../pages/PastExamsPage'
import { PastExamYearPage } from '../pages/PastExamYearPage'
import { SettingsPage } from '../pages/SettingsPage'
import { SgsExamPage } from '../pages/SgsExamPage'
import { SgsExamsPage } from '../pages/SgsExamsPage'
import { SgsMixedPage } from '../pages/SgsMixedPage'
import { SolvePage } from '../pages/SolvePage'
import { StatisticsPage } from '../pages/StatisticsPage'
import { TopicsPage } from '../pages/TopicsPage'

export function AppRoutes() {
  return (
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
  )
}
