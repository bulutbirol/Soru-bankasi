export function shuffle(items, random = Math.random) {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }
  return copy
}

export function prepareQuestions(questions, random = Math.random) {
  return shuffle(questions, random).map((question) => {
    if (question.questionImage) {
      return {
        ...question,
        options: [...question.options],
        originalAnswer: question.answer,
      }
    }

    const indexedOptions = question.options.map((text, originalIndex) => ({
      text,
      originalIndex,
    }))
    const shuffledOptions = shuffle(indexedOptions, random)

    return {
      ...question,
      options: shuffledOptions.map((option) => option.text),
      answer: shuffledOptions.findIndex((option) => option.originalIndex === question.answer),
      originalAnswer: question.answer,
    }
  })
}

export function calculateResult(questions, answers) {
  const correct = questions.filter((question) => answers[question.id] === question.answer).length
  const answered = questions.filter((question) => answers[question.id] !== undefined).length
  const total = questions.length

  return {
    total,
    correct,
    wrong: answered - correct,
    empty: total - answered,
    percentage: total ? Math.round((correct / total) * 100) : 0,
  }
}

export function filterQuestions(questions, filters = {}) {
  return questions.filter((question) => {
    if (filters.category && question.category !== filters.category) return false
    if (filters.topic && question.topic !== filters.topic) return false
    if (filters.ids && !filters.ids.includes(question.id)) return false
    return true
  })
}

export function getExamMinutes(questionCount) {
  const normalizedCount = Math.max(0, Number(questionCount) || 0)
  return Math.max(1, Math.ceil((normalizedCount * 165) / 130))
}

export function getCategorySummary(questions) {
  const categories = new Map()
  questions.forEach((question) => {
    const current = categories.get(question.category) || { count: 0, topics: new Set() }
    current.count += 1
    current.topics.add(question.topic)
    categories.set(question.category, current)
  })

  return [...categories.entries()].map(([name, value]) => ({
    name,
    count: value.count,
    topicCount: value.topics.size,
  }))
}

export function getTopics(questions, category) {
  const topics = new Map()
  filterQuestions(questions, { category }).forEach((question) => {
    topics.set(question.topic, (topics.get(question.topic) || 0) + 1)
  })
  return [...topics.entries()].map(([name, count]) => ({ name, count }))
}
