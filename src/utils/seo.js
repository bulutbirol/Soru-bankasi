export const SITE_ORIGIN = 'https://smmmsorubankasi.com'
export const SITE_NAME = 'SMMM Soru Bankası'

const privateRoutes = ['/solve', '/wrong', '/favorites', '/statistics', '/settings', '/qualification-study']

function decodePathPart(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function getSeoConfig(pathname) {
  const path = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
  const noindex = privateRoutes.some((route) => path === route || path.startsWith(`${route}/`))
  let title = 'SMMM Soru Bankası | Ücretsiz SMMM ve SGS Soruları'
  let description = 'SMMM ve Staja Giriş Sınavı için ücretsiz soru bankası, çıkmış sorular, konu testleri ve çevrimdışı çalışma uygulaması.'

  if (path === '/categories') {
    title = 'SMMM Dersleri ve Konu Testleri'
    description = 'Muhasebe, vergi, hukuk, denetim, maliye ve ekonomi derslerinde ücretsiz SMMM konu testleri çöz.'
  } else if (path.startsWith('/categories/')) {
    const category = decodePathPart(path.split('/')[2])
    title = `${category} SMMM Soruları`
    description = `${category} dersine ait konu testlerini, açıklamalı soruları ve çalışma istatistiklerini ücretsiz kullan.`
  } else if (path === '/past-exams') {
    title = 'SMMM Çıkmış Sorular 2020-2026'
    description = '2020-2026 SMMM çıkmış soru tarzında toplam 700 özgün soruyu yıl, ders ve konu seçerek çöz.'
  } else if (path === '/past-exams/mixed') {
    title = 'Karma SMMM Çıkmış Sorular'
    description = 'Son 3 yıl, son 5 yıl veya tüm yıllardan karma SMMM çıkmış soru çalışması oluştur.'
  } else if (/^\/past-exams\/20(20|21|22|23|24|25|26)$/.test(path)) {
    const year = path.split('/')[2]
    title = `${year} Çıkmış Soruları | SMMM`
    description = `${year} yılı için 100 açıklamalı SMMM çalışma sorusunu ders ve konu filtreleriyle ücretsiz çöz.`
  } else if (path === '/sgs-exams') {
    title = 'SGS Çıkmış Sorular ve Staja Giriş Sınavları'
    description = '2022-2026 arasındaki 13 SGS kitapçığından 1.690 soruyu tek sınav veya karma modda çöz.'
  } else if (path === '/sgs-exams/mixed') {
    title = 'Karma SGS Çıkmış Sorular'
    description = 'Staja Giriş Sınavı arşivindeki 1.690 sorudan açıklamalı karma çalışma oluştur.'
  } else if (path.startsWith('/sgs-exams/')) {
    title = 'SGS Sınav Soruları'
    description = 'Seçtiğin Staja Giriş Sınavı kitapçığındaki 130 soruyu çevrimdışı ve ücretsiz çöz.'
  } else if (path === '/qualification-exams') {
    title = 'SMMM Yeterlilik Sınavları'
    description = 'SMMM Yeterlilik sınavlarının dönem ve ders bazındaki soru-cevap PDF arşivine ücretsiz ulaş.'
  } else if (path === '/qualification-exams/mixed') {
    title = 'SMMM Yeterlilik Belge Araması'
    description = 'SMMM Yeterlilik soru ve cevap belgelerini yıl ve ders seçerek filtrele.'
  } else if (path.startsWith('/qualification-exams/')) {
    title = 'SMMM Yeterlilik Soru ve Cevapları'
    description = 'Seçtiğin SMMM Yeterlilik dönemi ve dersine ait doğrulanmış kaynak belgeyi incele.'
  } else if (path === '/qualification-study') {
    title = 'Yeterlilik Klasik Soru Çalışması'
  } else if (path === '/about') {
    title = 'Hakkında ve Gizlilik Politikası'
    description = 'SMMM Soru Bankası uygulamasının yerel veri saklama, gizlilik ve içerik politikasını incele.'
  } else if (path === '/wrong') {
    title = 'Yanlış Cevaplarım'
  } else if (path === '/favorites') {
    title = 'Favori Sorularım'
  } else if (path === '/statistics') {
    title = 'Çalışma İstatistiklerim'
  } else if (path === '/settings') {
    title = 'Uygulama Ayarları'
  } else if (path === '/solve') {
    title = 'Soru Çöz'
  } else if (path !== '/') {
    title = 'Sayfa Bulunamadı'
  }

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    canonical: `${SITE_ORIGIN}${path}`,
    robots: noindex || title === 'Sayfa Bulunamadı' ? 'noindex, nofollow' : 'index, follow',
  }
}
