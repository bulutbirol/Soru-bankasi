import { getCollectionItems } from './collections'

describe('question collections', () => {
  it('keeps written qualification favorites alongside quiz questions', () => {
    const quiz = [{ id: 'quiz-1', question: 'Quiz', options: ['A'] }]
    const written = [{ id: 'written-1', question: 'Written', type: 'written' }]

    const items = getCollectionItems(['written-1', 'quiz-1'], quiz, written)

    expect(items.map((item) => item.id)).toEqual(['written-1', 'quiz-1'])
    expect(items.find((item) => item.id === 'written-1').type).toBe('written')
  })
})
