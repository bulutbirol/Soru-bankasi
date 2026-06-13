import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QualificationQuestionCard } from './QualificationQuestionCard'

const question = {
  id: 'qualification-question-1',
  question: 'Dönem sonu kayıtlarının amacını açıklayınız.',
  answerText: 'Gelir ve giderlerin doğru döneme aktarılmasını sağlar.',
  lesson: 'Finansal Muhasebe',
}

describe('QualificationQuestionCard', () => {
  it('keeps the commission answer hidden until requested', async () => {
    const user = userEvent.setup()
    render(<QualificationQuestionCard question={question} />)

    expect(screen.queryByText(question.answerText)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Cevabı göster/i }))
    expect(screen.getByText(question.answerText)).toBeInTheDocument()
  })
})
