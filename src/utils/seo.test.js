import { describe, expect, it } from 'vitest'
import { getSeoConfig, SITE_NAME } from './seo'

describe('getSeoConfig', () => {
  it('names the site only once in the home title', () => {
    const { title } = getSeoConfig('/')
    expect(title.split(SITE_NAME)).toHaveLength(2)
  })

  it('describes the SGS archive from its metadata', () => {
    expect(getSeoConfig('/sgs-exams').description).toContain('2016-2026 arasındaki 21 SGS kitapçığından 2.730 soruyu')
  })
})
