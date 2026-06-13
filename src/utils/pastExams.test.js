import { describe, expect, it } from 'vitest'
import pastExamQuestions from '../data/pastExamQuestions.json'
import {
  PAST_EXAM_PRESETS,
  PAST_EXAM_YEARS,
  filterPastExamQuestions,
  getPastExamFilterOptions,
} from './pastExams'

const sample = [
  { id: 'a', sourceType: 'past_exam', year: 2026, category: 'Muhasebe', topic: 'Temeller' },
  { id: 'b', sourceType: 'past_exam', year: 2025, category: 'Vergi', topic: 'Vergi Usul' },
  { id: 'c', sourceType: 'past_exam', year: 2024, category: 'Muhasebe', topic: 'Maliyet' },
  { id: 'd', sourceType: 'practice', category: 'Muhasebe', topic: 'Temeller' },
]

describe('past exam presets', () => {
  it('defines newest-first year ranges for three, five, and all years', () => {
    expect(PAST_EXAM_YEARS).toEqual([2026, 2025, 2024, 2023, 2022, 2021, 2020])
    expect(PAST_EXAM_PRESETS.last3.years).toEqual([2026, 2025, 2024])
    expect(PAST_EXAM_PRESETS.last5.years).toEqual([2026, 2025, 2024, 2023, 2022])
    expect(PAST_EXAM_PRESETS.all.years).toEqual(PAST_EXAM_YEARS)
  })
})

describe('past exam question data', () => {
  it('contains exactly 100 valid text questions for every supported year', () => {
    expect(pastExamQuestions).toHaveLength(700)
    expect(new Set(pastExamQuestions.map((question) => question.id)).size).toBe(700)

    PAST_EXAM_YEARS.forEach((year) => {
      expect(pastExamQuestions.filter((question) => question.year === year)).toHaveLength(100)
    })

    pastExamQuestions.forEach((question) => {
      expect(question.sourceType).toBe('past_exam')
      expect(question.options).toHaveLength(5)
      expect(question.answer).toBeGreaterThanOrEqual(0)
      expect(question.answer).toBeLessThan(5)
      expect(question.explanation).toBeTruthy()
    })
  })
})

describe('filterPastExamQuestions', () => {
  it('filters only past-exam questions by years, category, and topic', () => {
    expect(
      filterPastExamQuestions(sample, {
        years: [2026, 2024],
        category: 'Muhasebe',
        topic: 'Maliyet',
      }).map((question) => question.id),
    ).toEqual(['c'])
  })
})

describe('getPastExamFilterOptions', () => {
  it('limits topic options to the selected category', () => {
    expect(getPastExamFilterOptions(sample, { years: [2026, 2025, 2024], category: 'Muhasebe' })).toEqual({
      categories: ['Muhasebe', 'Vergi'],
      topics: ['Maliyet', 'Temeller'],
    })
  })
})
