import { describe, expect, it } from 'vitest'
import { loadExplanation } from './explanations'

const sgs = { id: 'sgs-x-001', exam: 'SGS', examId: 'sgs-x', explanation: 'Doğru seçenek kaynak PDF\'de kırmızı olarak işaretlenmiştir.' }
const loaders = {
  '../data/sgsExplanations/sgs-x.json': async () => ({ default: { 'sgs-x-001': { steps: ['Bir', 'İki'], tip: 'İpucu' } } }),
}

describe('loadExplanation', () => {
  it('uses the built-in explanation for written questions', async () => {
    expect(await loadExplanation({ id: 'q1', explanation: 'Çünkü' }, loaders)).toEqual({ steps: ['Çünkü'] })
  })

  it('returns null for an SGS exam without an explanation file', async () => {
    expect(await loadExplanation({ ...sgs, examId: 'sgs-none' }, loaders)).toBeNull()
  })

  it('returns null for an SGS question missing from its file', async () => {
    expect(await loadExplanation({ ...sgs, id: 'sgs-x-002' }, loaders)).toBeNull()
  })

  it('loads steps for an SGS question from its exam file', async () => {
    expect(await loadExplanation(sgs, loaders)).toEqual({ steps: ['Bir', 'İki'], tip: 'İpucu' })
  })
})
