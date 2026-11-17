const STORAGE_KEY = 'smmm-progress-v1'

export function createDefaultProgress() {
  return {
    version: 1,
    answeredById: {},
    wrongQuestionIds: [],
    unknownQuestionIds: [],
    favoriteQuestionIds: [],
    completedQualificationIds: [],
    review: {},
    totals: { answered: 0, correct: 0, wrong: 0, exams: 0 },
    byCategory: {},
    dailyActivity: {},
    recentSessions: [],
    settings: {
      theme: 'system',
      questionCount: 10,
      dailyGoal: 10,
      shuffleOptions: true,
    },
  }
}

const REVIEW_INTERVALS = [1, 3, 7]

function unique(values) {
  return [...new Set(values)]
}

export function localDate(now = new Date()) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function addDays(now, days) {
  const next = new Date(now)
  next.setDate(next.getDate() + days)
  return localDate(next)
}

function nextReview(current, result, now) {
  if (result !== 'correct') return { due: addDays(now, REVIEW_INTERVALS[0]), step: 0 }
  if (!current) return undefined
  const step = current.step + 1
  return step < REVIEW_INTERVALS.length ? { due: addDays(now, REVIEW_INTERVALS[step]), step } : undefined
}

export function getAccuracy(progress) {
  const graded = progress.totals.correct + progress.totals.wrong
  return graded ? Math.round((progress.totals.correct / graded) * 100) : 0
}

export function getTodayCount(progress, now = new Date()) {
  return progress.dailyActivity[localDate(now)] || 0
}

export function getStreak(progress, now = new Date()) {
  const cursor = new Date(now)
  if (!progress.dailyActivity[localDate(cursor)]) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (progress.dailyActivity[localDate(cursor)]) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function getDueReviewIds(progress, now = new Date()) {
  const today = localDate(now)
  return Object.entries(progress.review)
    .filter(([, entry]) => entry.due <= today)
    .map(([id]) => id)
}

export function normalizeProgress(value) {
  const defaults = createDefaultProgress()
  if (!value || typeof value !== 'object') return defaults

  return {
    ...defaults,
    ...value,
    answeredById: value.answeredById || {},
    wrongQuestionIds: unique(value.wrongQuestionIds || []),
    unknownQuestionIds: unique(value.unknownQuestionIds || []),
    review: value.review && typeof value.review === 'object' ? value.review : {},
    favoriteQuestionIds: unique(value.favoriteQuestionIds || []),
    completedQualificationIds: unique(value.completedQualificationIds || []),
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

export function recordAnswer(progress, { questionId, correct, result: givenResult, category, now = new Date() }) {
  const result = givenResult || (correct ? 'correct' : 'wrong')
  correct = result === 'correct'
  const wrong = result === 'wrong'
  const today = localDate(now)
  const categoryStats = progress.byCategory[category] || { answered: 0, correct: 0 }
  const without = (ids) => ids.filter((id) => id !== questionId)
  const wrongQuestionIds = wrong ? unique([...progress.wrongQuestionIds, questionId]) : without(progress.wrongQuestionIds)
  const unknownQuestionIds = result === 'unknown'
    ? unique([...progress.unknownQuestionIds, questionId])
    : without(progress.unknownQuestionIds)
  const { [questionId]: currentReview, ...otherReviews } = progress.review
  const review = nextReview(currentReview, result, now)

  return normalizeProgress({
    ...progress,
    unknownQuestionIds,
    review: review ? { ...otherReviews, [questionId]: review } : otherReviews,
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
      wrong: progress.totals.wrong + (wrong ? 1 : 0),
    },
    byCategory: result === 'unknown' ? progress.byCategory : {
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

export function markQualificationComplete(progress, questionId) {
  return normalizeProgress({
    ...progress,
    completedQualificationIds: unique([
      ...progress.completedQualificationIds,
      questionId,
    ]),
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
