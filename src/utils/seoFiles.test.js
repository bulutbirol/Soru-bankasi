import fs from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('deploy SEO files', () => {
  it('publishes crawl and sitemap rules for the production domain', () => {
    const robots = fs.readFileSync('public/robots.txt', 'utf8')
    const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8')

    expect(robots).toContain('Sitemap: https://smmmsorubankasi.com/sitemap.xml')
    expect(sitemap).toContain('<loc>https://smmmsorubankasi.com/</loc>')
    expect(sitemap).toContain('<loc>https://smmmsorubankasi.com/past-exams/2026</loc>')
    expect(sitemap).toContain('<loc>https://smmmsorubankasi.com/qualification-exams</loc>')
    expect(sitemap).not.toContain('/wrong')
    expect(sitemap).not.toContain('/solve')
    expect(sitemap).not.toContain('/qualification-study')
  })

  it('publishes install and SPA fallback configuration', () => {
    const manifest = JSON.parse(fs.readFileSync('public/site.webmanifest', 'utf8'))
    const redirects = fs.readFileSync('public/_redirects', 'utf8')
    const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'))

    expect(manifest.lang).toBe('tr')
    expect(manifest.icons).toHaveLength(2)
    expect(redirects).toContain('/* /index.html 200')
    expect(vercel.rewrites).toContainEqual({ source: '/(.*)', destination: '/index.html' })
  })
})
