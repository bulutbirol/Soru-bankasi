import { describe, expect, it } from 'vitest'
import { getSeoConfig, SITE_NAME } from './seo'

describe('getSeoConfig', () => {
  it('names the site only once in the home title', () => {
    const { title } = getSeoConfig('/')
    expect(title.split(SITE_NAME)).toHaveLength(2)
  })
})
