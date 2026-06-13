import qualificationData from '../data/qualificationExams.json'
import {
  filterQualificationDocuments,
  getQualificationExams,
  getQualificationLessons,
} from './qualificationExams'

describe('qualification exam archive', () => {
  it('contains unique source documents with stable metadata', () => {
    const ids = qualificationData.documents.map((document) => document.id)

    expect(qualificationData.documents.length).toBeGreaterThan(100)
    expect(new Set(ids).size).toBe(ids.length)
    qualificationData.documents.forEach((document) => {
      expect(document.examId).toMatch(/^qualification-\d{4}-\d$/)
      expect(document.sourceUrl).toMatch(/^https:\/\//)
      expect(document.lesson).toBeTruthy()
      expect(typeof document.available).toBe('boolean')
    })
  })

  it('groups documents into newest-first exam periods', () => {
    const exams = getQualificationExams(qualificationData.documents)

    expect(exams[0].year).toBeGreaterThanOrEqual(exams.at(-1).year)
    expect(exams[0].documents.length).toBeGreaterThan(0)
    expect(new Set(exams.map((exam) => exam.id)).size).toBe(exams.length)
  })

  it('filters by exam and lesson while excluding unavailable files', () => {
    const available = qualificationData.documents.find((document) => document.available)
    const filtered = filterQualificationDocuments(qualificationData.documents, {
      examIds: [available.examId],
      lessons: [available.lesson],
    })

    expect(filtered.length).toBeGreaterThan(0)
    expect(filtered.every((document) => document.available)).toBe(true)
    expect(filtered.every((document) => document.examId === available.examId)).toBe(true)
    expect(filtered.every((document) => document.lesson === available.lesson)).toBe(true)
  })

  it('returns the lesson list alphabetically without duplicates', () => {
    const lessons = getQualificationLessons(qualificationData.documents)

    expect(lessons).toEqual([...new Set(lessons)].sort((a, b) => a.localeCompare(b, 'tr')))
  })
})
