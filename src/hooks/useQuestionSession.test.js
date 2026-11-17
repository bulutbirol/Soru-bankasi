import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { calculateResult } from '../utils/questions'
import { useQuestionSession } from './useQuestionSession'

const source = [
  { id: 'q1', questionImage: '/1.webp', options: ['A', 'B', 'C', 'D', 'E'], answer: 0 },
  { id: 'q2', questionImage: '/2.webp', options: ['A', 'B', 'C', 'D', 'E'], answer: 1 },
]

describe('useQuestionSession', () => {
  it('does not go before the first question', () => {
    const { result } = renderHook(() => useQuestionSession(source, { shuffleOptions: false }))
    expect(result.current.canGoBack).toBe(false)
    act(() => result.current.prev())
    expect(result.current.currentIndex).toBe(0)
  })

  it('goes back to the previous question and shows its answer', () => {
    const { result } = renderHook(() => useQuestionSession(source, { shuffleOptions: false }))
    act(() => result.current.answer(2))
    const firstId = result.current.currentQuestion.id
    act(() => result.current.next())
    expect(result.current.canGoBack).toBe(true)
    act(() => result.current.prev())
    expect(result.current.currentQuestion.id).toBe(firstId)
    expect(result.current.currentAnswer).toBe(2)
  })

  it('lets the answer change but keeps the first answer for stats', () => {
    const { result } = renderHook(() => useQuestionSession(source, { shuffleOptions: false }))
    const { id } = result.current.currentQuestion
    act(() => result.current.answer('unknown'))
    act(() => result.current.answer(3))
    expect(result.current.answers[id]).toBe(3)
    expect(result.current.firstAnswers[id]).toBe('unknown')
    expect(result.current.result.unknown).toBe(1)
  })
})

describe('calculateResult with unknown', () => {
  it('counts unknown apart from wrong', () => {
    const questions = [{ id: 'a', answer: 0 }, { id: 'b', answer: 1 }, { id: 'c', answer: 2 }]
    expect(calculateResult(questions, { a: 0, b: 'unknown' })).toEqual({
      total: 3, correct: 1, wrong: 0, unknown: 1, empty: 1, percentage: 33,
    })
  })
})
