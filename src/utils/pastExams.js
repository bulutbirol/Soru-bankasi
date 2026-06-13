export const PAST_EXAM_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020]

export const PAST_EXAM_PRESETS = {
  last3: { label: 'Son 3 Yıl', years: PAST_EXAM_YEARS.slice(0, 3) },
  last5: { label: 'Son 5 Yıl', years: PAST_EXAM_YEARS.slice(0, 5) },
  all: { label: 'Tüm Yıllar', years: PAST_EXAM_YEARS },
}

export function filterPastExamQuestions(questions, filters = {}) {
  return questions.filter((question) => {
    if (question.sourceType !== 'past_exam') return false
    if (filters.years?.length && !filters.years.includes(question.year)) return false
    if (filters.category && question.category !== filters.category) return false
    if (filters.topic && question.topic !== filters.topic) return false
    return true
  })
}

export function getPastExamFilterOptions(questions, { years, category } = {}) {
  const scoped = filterPastExamQuestions(questions, { years })
  const categories = [...new Set(scoped.map((question) => question.category))].sort((a, b) =>
    a.localeCompare(b, 'tr'),
  )
  const topics = [
    ...new Set(
      scoped
        .filter((question) => !category || question.category === category)
        .map((question) => question.topic),
    ),
  ].sort((a, b) => a.localeCompare(b, 'tr'))

  return { categories, topics }
}

export function getPastExamYearSummary(questions, year) {
  const scoped = filterPastExamQuestions(questions, { years: [year] })
  return {
    year,
    count: scoped.length,
    periodCount: new Set(scoped.map((question) => question.period)).size,
    categoryCount: new Set(scoped.map((question) => question.category)).size,
  }
}

export function parseYears(value) {
  if (!value) return []
  return value
    .split(',')
    .map(Number)
    .filter((year) => PAST_EXAM_YEARS.includes(year))
}
