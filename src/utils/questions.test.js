import { describe, expect, it } from 'vitest'
import questionBank from '../data/questionBank'
import { calculateResult, prepareQuestions } from './questions'

const sample = [
  {
    id: 'q1',
    options: ['A', 'B', 'C', 'D', 'E'],
    answer: 2,
  },
]

describe('prepareQuestions', () => {
  it('preserves the correct answer while shuffling options', () => {
    const [prepared] = prepareQuestions(sample, () => 0)

    expect(prepared.options[prepared.answer]).toBe('C')
    expect(prepared.originalAnswer).toBe(2)
  })

  it('does not mutate source questions', () => {
    const original = structuredClone(sample)
    prepareQuestions(sample, () => 0.75)
    expect(sample).toEqual(original)
  })

  it('keeps option order for image-based source questions', () => {
    const source = [{
      id: 'sgs-1',
      questionImage: '/sgs/questions/sgs-1.webp',
      options: ['A seçeneği', 'B seçeneği', 'C seçeneği', 'D seçeneği', 'E seçeneği'],
      answer: 2,
    }]

    const [prepared] = prepareQuestions(source, () => 0)

    expect(prepared.options).toEqual(source[0].options)
    expect(prepared.answer).toBe(2)
  })
})

describe('calculateResult', () => {
  it('returns correct, wrong, empty, and percentage totals', () => {
    const questions = [
      { id: 'q1', answer: 0 },
      { id: 'q2', answer: 1 },
      { id: 'q3', answer: 2 },
    ]

    expect(calculateResult(questions, { q1: 0, q2: 4 })).toEqual({
      total: 3,
      correct: 1,
      wrong: 1,
      empty: 1,
      percentage: 33,
    })
  })
})

describe('question bank data', () => {
  it('contains a valid and expandable original question pool', () => {
    expect(questionBank.length).toBeGreaterThanOrEqual(60)
    expect(new Set(questionBank.map((question) => question.id)).size).toBe(questionBank.length)

    questionBank.forEach((question) => {
      expect(question.options).toHaveLength(5)
      expect(question.answer).toBeGreaterThanOrEqual(0)
      expect(question.answer).toBeLessThan(5)
      expect(question.question).toBeTruthy()
      expect(question.explanation).toBeTruthy()
    })
  })
})
