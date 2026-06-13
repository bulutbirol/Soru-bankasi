import { describe, expect, it } from 'vitest'
import {
  clearWrongQuestions,
  createDefaultProgress,
  loadProgress,
  recordAnswer,
  saveProgress,
  toggleFavorite,
} from './progress'

describe('progress storage', () => {
  it('uses defaults when stored data is corrupt', () => {
    localStorage.setItem('smmm-progress-v1', '{not-json')
    expect(loadProgress()).toEqual(createDefaultProgress())
  })

  it('tracks wrong questions and removes them after a correct retry', () => {
    const wrong = recordAnswer(createDefaultProgress(), {
      questionId: 'q1',
      correct: false,
      category: 'Muhasebe',
    })
    expect(wrong.wrongQuestionIds).toContain('q1')

    const corrected = recordAnswer(wrong, {
      questionId: 'q1',
      correct: true,
      category: 'Muhasebe',
    })
    expect(corrected.wrongQuestionIds).not.toContain('q1')
    expect(corrected.totals).toMatchObject({ answered: 2, correct: 1, wrong: 1 })
  })

  it('persists favorite toggles', () => {
    const next = toggleFavorite(createDefaultProgress(), 'q9')
    saveProgress(next)
    expect(loadProgress().favoriteQuestionIds).toEqual(['q9'])
  })

  it('clears only the wrong-answer collection', () => {
    const progress = {
      ...createDefaultProgress(),
      wrongQuestionIds: ['q1', 'q2'],
      favoriteQuestionIds: ['q2'],
      totals: { answered: 4, correct: 2, wrong: 2, exams: 1 },
    }

    expect(clearWrongQuestions(progress)).toMatchObject({
      wrongQuestionIds: [],
      favoriteQuestionIds: ['q2'],
      totals: { answered: 4, correct: 2, wrong: 2, exams: 1 },
    })
  })
})
