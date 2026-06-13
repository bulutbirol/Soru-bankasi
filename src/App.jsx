import { ProgressProvider } from './hooks/useProgress'
import { AppRoutes } from './routes/AppRoutes'

export default function App() {
  return (
    <ProgressProvider>
      <AppRoutes />
    </ProgressProvider>
  )
}
