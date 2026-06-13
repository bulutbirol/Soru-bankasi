import { SeoManager } from './components/SeoManager'
import { ProgressProvider } from './hooks/useProgress'
import { AppRoutes } from './routes/AppRoutes'

export default function App() {
  return (
    <ProgressProvider>
      <SeoManager />
      <AppRoutes />
    </ProgressProvider>
  )
}
