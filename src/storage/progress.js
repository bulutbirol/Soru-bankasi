const STORAGE_KEY = 'smmm-progress-v1'

export function createDefaultProgress() {
  return {
    version: 1,
    answeredById: {},
    wrongQuestionIds: [],
    favoriteQuestionIds: [],
    totals: { answered: 0, correct: 0, wrong: 0, exams: 0 },
    byCategory: {},
    dailyActivity: {},
    recentSessions: [],
    settings: {
      theme: 'system',
      questionCount: 10,
      shuffleOptions: true,
    },
  }
}

function unique(values) {
  return [...new Set(values)]
}

export function normalizeProgress(value) {
  const defaults = createDefaultProgress()
  if (!value || typeof value !== 'object') return defaults

  return {
    ...defaults,
    ...value,
    answeredById: value.answeredById || {},
    wrongQuestionIds: unique(value.wrongQuestionIds || []),
    favoriteQuestionIds: unique(value.favoriteQuestionIds || []),
    totals: { ...defaults.totals, ...(value.totals || {}) },
    byCategory: value.byCategory || {},
    dailyActivity: value.dailyActivity || {},
    recentSessions: Array.isArray(value.recentSessions) ? value.recentSessions.slice(0, 10) : [],
    settings: { ...defaults.settings, ...(value.settings || {}) },
  }
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? normalizeProgress(JSON.parse(raw)) : createDefaultProgress()
  } catch {
    return createDefaultProgress()
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeProgress(progress)))
}

export function recordAnswer(progress, { questionId, correct, category }) {
  const today = new Date().toISOString().slice(0, 10)
  const categoryStats = progress.byCategory[category] || { answered: 0, correct: 0 }
  const wrongQuestionIds = correct
    ? progress.wrongQuestionIds.filter((id) => id !== questionId)
    : unique([...progress.wrongQuestionIds, questionId])

  return normalizeProgress({
    ...progress,
    answeredById: {
      ...progress.answeredById,
      [questionId]: {
        attempts: (progress.answeredById[questionId]?.attempts || 0) + 1,
        correct,
        lastAnsweredAt: new Date().toISOString(),
      },
    },
    wrongQuestionIds,
    totals: {
      ...progress.totals,
      answered: progress.totals.answered + 1,
      correct: progress.totals.correct + (correct ? 1 : 0),
      wrong: progress.totals.wrong + (correct ? 0 : 1),
    },
    byCategory: {
      ...progress.byCategory,
      [category]: {
        answered: categoryStats.answered + 1,
        correct: categoryStats.correct + (correct ? 1 : 0),
      },
    },
    dailyActivity: {
      ...progress.dailyActivity,
      [today]: (progress.dailyActivity[today] || 0) + 1,
    },
  })
}

export function recordSession(progress, session) {
  return normalizeProgress({
    ...progress,
    totals: { ...progress.totals, exams: progress.totals.exams + 1 },
    recentSessions: [{ ...session, completedAt: new Date().toISOString() }, ...progress.recentSessions],
  })
}

export function toggleFavorite(progress, questionId) {
  const exists = progress.favoriteQuestionIds.includes(questionId)
  return normalizeProgress({
    ...progress,
    favoriteQuestionIds: exists
      ? progress.favoriteQuestionIds.filter((id) => id !== questionId)
      : [...progress.favoriteQuestionIds, questionId],
  })
}

export function clearWrongQuestions(progress) {
  return normalizeProgress({
    ...progress,
    wrongQuestionIds: [],
  })
}

export function updateSettings(progress, settings) {
  return normalizeProgress({
    ...progress,
    settings: { ...progress.settings, ...settings },
  })
}

export function clearProgress() {
  localStorage.removeItem(STORAGE_KEY)
  return createDefaultProgress()
}
