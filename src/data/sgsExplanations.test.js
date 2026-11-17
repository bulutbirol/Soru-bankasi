import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import sgsExamQuestions from './sgsExamQuestions.json'

const dir = 'src/data/sgsExplanations'
const ids = new Set(sgsExamQuestions.map((question) => question.id))
const files = fs.readdirSync(dir).filter((file) => file.endsWith('.json') && !file.startsWith('_'))

describe('SGS explanation files', () => {
  it.each(files)('%s only explains known questions with at least one step', (file) => {
    const entries = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
    const examId = file.replace('.json', '')
    Object.entries(entries).forEach(([id, entry]) => {
      expect(ids.has(id), id).toBe(true)
      expect(id.startsWith(`${examId}-`), id).toBe(true)
      expect(entry.steps.length, id).toBeGreaterThan(0)
      entry.steps.forEach((step) => expect(step.trim().length, id).toBeGreaterThan(0))
    })
  })

  it('lists only known question ids as flagged', () => {
    const flags = JSON.parse(fs.readFileSync(path.join(dir, '_flags.json'), 'utf8'))
    flags.forEach((flag) => expect(ids.has(flag.id), flag.id).toBe(true))
  })
})
