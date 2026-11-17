import { describe, expect, it } from 'vitest'
import {
  createDefaultProgress,
  getDueReviewIds,
  getStreak,
  getTodayCount,
  localDate,
  normalizeProgress,
  recordAnswer,
} from './progress'

const day = (iso) => new Date(`${iso}T10:00:00`)

describe('daily goal, streak and review', () => {
  it('loads legacy progress without new fields and keeps totals', () => {
    const legacy = { version: 1, totals: { answered: 5, correct: 3, wrong: 2, exams: 1 }, settings: { theme: 'dark' } }
    const progress = normalizeProgress(legacy)
    expect(progress.totals.answered).toBe(5)
    expect(progress.unknownQuestionIds).toEqual([])
    expect(progress.review).toEqual({})
    expect(progress.settings).toMatchObject({ theme: 'dark', dailyGoal: 10 })
  })

  it('uses local calendar date', () => {
    expect(localDate(new Date(2026, 10, 18, 23, 30))).toBe('2026-11-18')
  })

  it('records unknown without touching accuracy', () => {
    const now = day('2026-11-18')
    const next = recordAnswer(createDefaultProgress(), { questionId: 'q1', result: 'unknown', category: 'Vergi', now })
    expect(next.totals).toMatchObject({ answered: 1, correct: 0, wrong: 0 })
    expect(next.unknownQuestionIds).toEqual(['q1'])
    expect(next.wrongQuestionIds).toEqual([])
    expect(next.review.q1).toEqual({ due: '2026-11-19', step: 0 })
    expect(getTodayCount(next, now)).toBe(1)
  })

  it('schedules review 1, 3, 7 days and clears after the last step', () => {
    let p = recordAnswer(createDefaultProgress(), { questionId: 'q1', result: 'wrong', category: 'Vergi', now: day('2026-11-01') })
    expect(p.review.q1).toEqual({ due: '2026-11-02', step: 0 })
    expect(getDueReviewIds(p, day('2026-11-01'))).toEqual([])
    expect(getDueReviewIds(p, day('2026-11-02'))).toEqual(['q1'])
    p = recordAnswer(p, { questionId: 'q1', result: 'correct', category: 'Vergi', now: day('2026-11-02') })
    expect(p.review.q1).toEqual({ due: '2026-11-05', step: 1 })
    p = recordAnswer(p, { questionId: 'q1', result: 'correct', category: 'Vergi', now: day('2026-11-05') })
    expect(p.review.q1).toEqual({ due: '2026-11-12', step: 2 })
    p = recordAnswer(p, { questionId: 'q1', result: 'correct', category: 'Vergi', now: day('2026-11-12') })
    expect(p.review.q1).toBeUndefined()
    expect(p.wrongQuestionIds).toEqual([])
  })

  it('resets review to step 0 on a wrong retry', () => {
    let p = recordAnswer(createDefaultProgress(), { questionId: 'q1', result: 'wrong', category: 'Vergi', now: day('2026-11-01') })
    p = recordAnswer(p, { questionId: 'q1', result: 'correct', category: 'Vergi', now: day('2026-11-02') })
    p = recordAnswer(p, { questionId: 'q1', result: 'unknown', category: 'Vergi', now: day('2026-11-05') })
    expect(p.review.q1).toEqual({ due: '2026-11-06', step: 0 })
  })

  it('counts consecutive days and resets after a gap', () => {
    const p = { ...createDefaultProgress(), dailyActivity: { '2026-11-15': 3, '2026-11-16': 1, '2026-11-17': 10 } }
    expect(getStreak(p, day('2026-11-17'))).toBe(3)
    expect(getStreak(p, day('2026-11-18'))).toBe(3)
    expect(getStreak(p, day('2026-11-19'))).toBe(0)
  })
})

describe('getAccuracy', () => {
  it('ignores unknown answers', async () => {
    const { getAccuracy } = await import('./progress')
    expect(getAccuracy({ totals: { answered: 4, correct: 1, wrong: 1 } })).toBe(50)
    expect(getAccuracy({ totals: { answered: 0, correct: 0, wrong: 0 } })).toBe(0)
  })
})
