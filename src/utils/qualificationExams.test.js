import qualificationData from '../data/qualificationExams.json'
import qualificationQuestions from '../data/qualificationQuestions.json'
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

  it('defines the reviewed question count for every accessible source document', () => {
    const availableDocuments = qualificationData.documents.filter((document) => document.available)

    expect(availableDocuments).toHaveLength(120)
    expect(availableDocuments.every((document) => document.questionCount > 0)).toBe(true)
    expect(availableDocuments.reduce((total, document) => total + document.questionCount, 0)).toBe(548)
  })

  it('contains one original multiple-choice learning question per reviewed source question', () => {
    const availableDocuments = qualificationData.documents.filter((document) => document.available)
    const expectedByDocument = new Map(
      availableDocuments.map((document) => [document.id, document.questionCount]),
    )
    const actualByDocument = new Map()

    qualificationQuestions.forEach((question) => {
      actualByDocument.set(question.documentId, (actualByDocument.get(question.documentId) || 0) + 1)
      expect(question.sourceType).toBe('qualification_original')
      expect(question.options).toHaveLength(5)
      expect(question.answer).toBeGreaterThanOrEqual(0)
      expect(question.answer).toBeLessThan(5)
      expect(question.question).toBeTruthy()
      expect(question.explanation).toBeTruthy()
      expect(question.lesson).toBeTruthy()
      expect(question.topic).toBeTruthy()
    })

    expect(qualificationQuestions).toHaveLength(548)
    expect(new Set(qualificationQuestions.map((question) => question.id)).size).toBe(548)
    expect(new Set(qualificationQuestions.map((question) => question.question)).size).toBe(548)
    expect(qualificationQuestions.some((question) => question.explanation.startsWith('Iş'))).toBe(false)
    expect(actualByDocument).toEqual(expectedByDocument)
  })
})
