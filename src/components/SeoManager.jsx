import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getSeoConfig, SITE_NAME, SITE_ORIGIN } from '../utils/seo'

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))
}

export function SeoManager() {
  const { pathname } = useLocation()

  useEffect(() => {
    const seo = getSeoConfig(pathname)
    document.title = seo.title

    setMeta('meta[name="description"]', { name: 'description', content: seo.description })
    setMeta('meta[name="robots"]', { name: 'robots', content: seo.robots })
    setMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title })
    setMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description })
    setMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
    setMeta('meta[property="og:url"]', { property: 'og:url', content: seo.canonical })
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME })
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'tr_TR' })
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title })
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description })

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', seo.canonical)

    let structuredData = document.head.querySelector('script[data-seo-structured-data]')
    if (!structuredData) {
      structuredData = document.createElement('script')
      structuredData.type = 'application/ld+json'
      structuredData.dataset.seoStructuredData = 'true'
      document.head.appendChild(structuredData)
    }
    structuredData.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: SITE_NAME,
      url: SITE_ORIGIN,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web, iOS, Android',
      inLanguage: 'tr-TR',
      description: seo.description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
    })
  }, [pathname])

  return null
}
