import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  clearProgress,
  clearWrongQuestions,
  loadProgress,
  recordAnswer,
  recordSession,
  saveProgress,
  toggleFavorite,
  updateSettings,
} from '../storage/progress'

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(loadProgress)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  useEffect(() => {
    const theme = progress.settings.theme
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && prefersDark))
  }, [progress.settings.theme])

  const actions = useMemo(
    () => ({
      answer: (payload) => setProgress((current) => recordAnswer(current, payload)),
      finishSession: (payload) => setProgress((current) => recordSession(current, payload)),
      toggleFavorite: (id) => setProgress((current) => toggleFavorite(current, id)),
      clearWrongQuestions: () => setProgress((current) => clearWrongQuestions(current)),
      updateSettings: (settings) => setProgress((current) => updateSettings(current, settings)),
      reset: () => setProgress(clearProgress()),
    }),
    [],
  )

  return <ProgressContext.Provider value={{ progress, ...actions }}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const value = useContext(ProgressContext)
  if (!value) throw new Error('useProgress must be used inside ProgressProvider')
  return value
}
