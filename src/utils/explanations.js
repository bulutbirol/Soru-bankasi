const sgsLoaders = import.meta.glob(['../data/sgsExplanations/*.json', '!../data/sgsExplanations/_flags.json'])

export async function loadExplanation(question, loaders = sgsLoaders) {
  if (question.exam !== 'SGS') return question.explanation ? { steps: [question.explanation] } : null
  const load = loaders[`../data/sgsExplanations/${question.examId}.json`]
  if (!load) return null
  const { default: entries } = await load()
  return entries[question.id] || null
}
