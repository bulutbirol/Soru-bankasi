import { useCallback, useEffect, useMemo, useState } from 'react'
import { calculateResult, prepareQuestions } from '../utils/questions'

export function useQuestionSession(source, { mode, minutes, shuffleOptions = true }) {
  const [questions] = useState(() =>
    shuffleOptions ? prepareQuestions(source) : prepareQuestions(source, () => 0.999999),
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(minutes * 60)
  const currentQuestion = questions[currentIndex]
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined

  const finish = useCallback(() => setFinished(true), [])

  useEffect(() => {
    if (mode !== 'exam' || finished) return undefined
    if (remainingSeconds <= 0) {
      finish()
      return undefined
    }
    const timer = window.setInterval(() => setRemainingSeconds((value) => value - 1), 1000)
    return () => window.clearInterval(timer)
  }, [finish, finished, mode, remainingSeconds])

  const answer = useCallback(
    (optionIndex) => {
      if (!currentQuestion || finished) return
      setAnswers((current) => ({ ...current, [currentQuestion.id]: optionIndex }))
    },
    [currentQuestion, finished],
  )

  const next = useCallback(() => {
    if (currentIndex >= questions.length - 1) finish()
    else setCurrentIndex((value) => value + 1)
  }, [currentIndex, finish, questions.length])

  const result = useMemo(() => calculateResult(questions, answers), [answers, questions])

  return {
    questions,
    currentQuestion,
    currentIndex,
    currentAnswer,
    answers,
    finished,
    remainingSeconds,
    progress: questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0,
    result,
    answer,
    next,
    finish,
  }
}
