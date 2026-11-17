import { describe, expect, it } from 'vitest'
import { questionImageUrl } from './assets'

describe('questionImageUrl', () => {
  it('keeps the relative path on the web', () => {
    expect(questionImageUrl('/sgs/questions/a.webp', false)).toBe('/sgs/questions/a.webp')
  })

  it('loads images from the live site inside the native app', () => {
    expect(questionImageUrl('/sgs/questions/a.webp', true)).toBe('https://smmm-soru-bankasi.vercel.app/sgs/questions/a.webp')
  })
})
