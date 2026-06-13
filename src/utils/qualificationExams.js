export function filterQualificationDocuments(documents, filters = {}) {
  const examIds = filters.examIds || []
  const lessons = filters.lessons || []

  return documents.filter((document) => (
    document.available
    && (!examIds.length || examIds.includes(document.examId))
    && (!lessons.length || lessons.includes(document.lesson))
  ))
}

export function getQualificationExams(documents) {
  const exams = new Map()

  documents.forEach((document) => {
    if (!exams.has(document.examId)) {
      exams.set(document.examId, {
        id: document.examId,
        year: document.year,
        period: document.period,
        label: document.label,
        documents: [],
      })
    }
    exams.get(document.examId).documents.push(document)
  })

  return [...exams.values()].sort(
    (left, right) => right.year - left.year || right.period - left.period,
  )
}

export function getQualificationLessons(documents) {
  return [...new Set(documents.map((document) => document.lesson))]
    .sort((left, right) => left.localeCompare(right, 'tr'))
}
