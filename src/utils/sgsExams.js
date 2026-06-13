export function filterSgsQuestions(questions, filters = {}) {
  return questions.filter((question) => {
    if (question.exam !== 'SGS') return false
    if (filters.examIds?.length && !filters.examIds.includes(question.examId)) return false
    if (filters.category && question.category !== filters.category) return false
    if (filters.topic && question.topic !== filters.topic) return false
    return true
  })
}

export function getSgsFilterOptions(questions, { examIds, category } = {}) {
  const scoped = filterSgsQuestions(questions, { examIds })
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

export function parseExamIds(value, knownIds) {
  if (!value) return []
  return value.split(',').filter((examId) => knownIds.includes(examId))
}
