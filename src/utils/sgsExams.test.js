import { describe, expect, it } from 'vitest'
import { filterSgsQuestions, getSgsFilterOptions, parseExamIds } from './sgsExams'

const sample = [
  { id: 'a', exam: 'SGS', examId: 'sgs-2025-11-22', category: 'Alan Bilgisi', topic: 'Alan Bilgisi' },
  { id: 'b', exam: 'SGS', examId: 'sgs-2025-07-26', category: 'Yabancı Dil', topic: 'İngilizce' },
  { id: 'c', exam: 'SMMM', category: 'Muhasebe', topic: 'Temeller' },
]

describe('filterSgsQuestions', () => {
  it('filters SGS questions by exam, category, and topic', () => {
    expect(
      filterSgsQuestions(sample, {
        examIds: ['sgs-2025-11-22'],
        category: 'Alan Bilgisi',
        topic: 'Alan Bilgisi',
      }).map((question) => question.id),
    ).toEqual(['a'])
  })
})

describe('getSgsFilterOptions', () => {
  it('returns category and category-scoped topic options', () => {
    expect(getSgsFilterOptions(sample, { category: 'Yabancı Dil' })).toEqual({
      categories: ['Alan Bilgisi', 'Yabancı Dil'],
      topics: ['İngilizce'],
    })
  })
})

describe('parseExamIds', () => {
  it('keeps only known SGS exam IDs', () => {
    expect(parseExamIds('sgs-2025-11-22,invalid', ['sgs-2025-11-22'])).toEqual(['sgs-2025-11-22'])
  })
})
