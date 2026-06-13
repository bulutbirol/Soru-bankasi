export function getCollectionItems(ids, ...questionBanks) {
  const byId = new Map(questionBanks.flat().map((question) => [question.id, question]))
  return ids.map((id) => byId.get(id)).filter(Boolean)
}
