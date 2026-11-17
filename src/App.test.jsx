import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </MemoryRouter>,
  )
}

describe('SMMM question bank', () => {
  it('shows the daily goal, streak and a continue action on the home page', () => {
    localStorage.clear()
    renderApp()
    expect(screen.getByRole('heading', { name: /Bugün 10 soru yeter/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Günlük hedef: 10 sorudan 0/ })).toBeInTheDocument()
    expect(screen.getByText(/0 gün/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Kaldığın yerden devam/ }).getAttribute('href')).toMatch(/^\/solve\?source=sgs/)
  })

  it('sends continue to the review queue when reviews are due', () => {
    localStorage.setItem('smmm-progress-v1', JSON.stringify({ review: { q1: { due: '2000-01-01', step: 0 } } }))
    renderApp()
    expect(screen.getByRole('link', { name: /Kaldığın yerden devam/ }).getAttribute('href')).toMatch(/collection=review/)
    expect(screen.getByRole('link', { name: /Tekrar listesi/ })).toHaveAttribute('href', '/solve?collection=review')
    localStorage.clear()
  })

  it('shows the category summary on the home page', () => {
    renderApp()
    expect(screen.getByText('Muhasebe')).toBeInTheDocument()
    expect(screen.getByText('Vergi')).toBeInTheDocument()
  })

  it('reveals an explanation after answering in practice mode', async () => {
    const user = userEvent.setup()
    renderApp('/solve?mode=practice&category=Muhasebe&limit=1')

    await user.click((await screen.findAllByRole('button', { name: /^[A-E]\./ }))[0])

    expect(await screen.findByRole('heading', { name: 'Nasıl çözülür?' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Önceki soru/i })).toBeInTheDocument()
  })

  it('opens an imported SGS question with its source image', async () => {
    renderApp('/solve?source=sgs&examIds=sgs-2025-11-22&mode=practice&limit=1')

    expect(await screen.findByRole('img', { name: /22 Kasım 2025 SGS - Soru/i })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^[A-E]$/ })).toHaveLength(5)
    expect(screen.queryByText('A seçeneği')).not.toBeInTheDocument()
  })

  it('lets the user change an answer before moving to the next question', async () => {
    const user = userEvent.setup()
    renderApp('/solve?source=sgs&examIds=sgs-2025-11-22&mode=practice&limit=1')
    const optionA = await screen.findByRole('button', { name: 'A' })
    const optionB = await screen.findByRole('button', { name: 'B' })

    await user.click(optionA)
    await user.click(optionB)

    expect(optionA).toHaveAttribute('aria-pressed', 'false')
    expect(optionB).toHaveAttribute('aria-pressed', 'true')
  })

  it('reveals the answer and a solution placeholder on Bilmiyorum', async () => {
    localStorage.clear()
    const user = userEvent.setup()
    renderApp('/solve?source=sgs&examIds=sgs-2025-11-22&mode=practice&limit=1')

    await user.click(await screen.findByRole('button', { name: /Bilmiyorum/ }))

    expect(await screen.findByText(/Bu sorunun çözümü hazırlanıyor/)).toBeInTheDocument()
    expect(screen.getByText(/Doğru cevap [A-E]./)).toBeInTheDocument()
    const saved = JSON.parse(localStorage.getItem('smmm-progress-v1'))
    expect(saved.unknownQuestionIds).toHaveLength(1)
    expect(saved.totals.wrong).toBe(0)
  })

  it('hides the app menus in focus mode and shows one segment per question', async () => {
    renderApp('/solve?source=sgs&examIds=sgs-2025-11-22&limit=10')

    expect(await screen.findByRole('img', { name: /10 sorudan 0 tanesi tamam/ })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Ana menü' })).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Mobil menü' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Oturumu kapat' })).toHaveAttribute('href', '/')
  })

  it('goes back to the previous question', async () => {
    const user = userEvent.setup()
    renderApp('/solve?source=sgs&examIds=sgs-2025-11-22&limit=2')
    const firstImage = (await screen.findByRole('img', { name: /Soru/ })).getAttribute('src')

    expect(screen.getByRole('button', { name: /Önceki soru/ })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'A' }))
    await user.click(screen.getByRole('button', { name: /Sonraki soru/ }))
    await user.click(screen.getByRole('button', { name: /Önceki soru/ }))

    expect(screen.getByRole('img', { name: /Soru/ })).toHaveAttribute('src', firstImage)
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('celebrates at the end of a session', async () => {
    const user = userEvent.setup()
    renderApp('/solve?source=sgs&examIds=sgs-2025-11-22&limit=1')

    await user.click(await screen.findByRole('button', { name: 'A' }))
    await user.click(screen.getByRole('button', { name: /Sonucu gör/ }))

    expect(await screen.findByText(/gün seri/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '5 soru daha çöz' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Bugünlük yeter' })).toHaveAttribute('href', '/')
  })

  it('counts only the first answer when the answer is changed', async () => {
    localStorage.clear()
    const user = userEvent.setup()
    renderApp('/solve?source=sgs&examIds=sgs-2025-11-22&mode=practice&limit=1')

    await user.click(await screen.findByRole('button', { name: 'A' }))
    await user.click(screen.getByRole('button', { name: 'B' }))
    await user.click(screen.getByRole('button', { name: 'C' }))

    const saved = JSON.parse(localStorage.getItem('smmm-progress-v1'))
    expect(saved.totals.answered).toBe(1)
  })

  it('treats legacy exam links as learning sessions without a timer', async () => {
    const user = userEvent.setup()
    renderApp('/solve?mode=exam&category=Muhasebe&limit=10')

    expect(await screen.findByRole('img', { name: /sorudan [0-9]+ tanesi tamam/ })).toBeInTheDocument()
    expect(screen.queryByText('13:00')).not.toBeInTheDocument()

    await user.click((await screen.findAllByRole('button', { name: /^[A-E]\./ }))[0])
    expect(await screen.findByRole('heading', { name: 'Nasıl çözülür?' })).toBeInTheDocument()
  })

  it('does not advertise a timed exam mode', () => {
    renderApp('/')

    expect(screen.queryByText('Süreli sınav')).not.toBeInTheDocument()
  })

  it('summarizes the complete SGS archive from its metadata', () => {
    renderApp('/')

    expect(screen.getByText(/21 sınav · 2.730 soru/i)).toBeInTheDocument()
  })

  it('links to the qualification archive from the home page', () => {
    renderApp('/')

    expect(screen.getByRole('link', { name: /SMMM Yeterlilik Sınavları/i }))
      .toHaveAttribute('href', '/qualification-exams')
  })

  it('shows the full year range on the SGS archive page', async () => {
    renderApp('/sgs-exams')

    expect(await screen.findByText(/2016-2026 sınavlarından/i)).toBeInTheDocument()
  })

  it('clears the wrong-answer list after confirmation', async () => {
    const user = userEvent.setup()
    localStorage.setItem('smmm-progress-v1', JSON.stringify({
      version: 1,
      wrongQuestionIds: ['smmm-001'],
      favoriteQuestionIds: ['smmm-002'],
      totals: { answered: 2, correct: 1, wrong: 1, exams: 0 },
    }))
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderApp('/wrong')
    await user.click(await screen.findByRole('button', { name: /Yanlışları temizle/i }))

    expect(screen.getByText(/Yanlış listen temiz/i)).toBeInTheDocument()
    const stored = JSON.parse(localStorage.getItem('smmm-progress-v1'))
    expect(stored.wrongQuestionIds).toEqual([])
    expect(stored.favoriteQuestionIds).toEqual(['smmm-002'])
  })

  it('sets canonical metadata for public routes', () => {
    renderApp('/past-exams/2026')

    expect(document.title).toMatch(/2026 Çıkmış Soruları/)
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://smmm-soru-bankasi.vercel.app/past-exams/2026',
    )
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'index, follow',
    )
  })

  it('prevents indexing user-specific routes', () => {
    renderApp('/wrong')

    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    )
  })

  it('sets qualification archive metadata and keeps study sessions private', () => {
    const { unmount } = renderApp('/qualification-exams')

    expect(document.title).toMatch(/SMMM Yeterlilik Sınavları/)
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://smmm-soru-bankasi.vercel.app/qualification-exams',
    )
    unmount()

    renderApp('/qualification-study')
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    )
  })

  it('starts a learning session from a qualification document', async () => {
    renderApp('/qualification-exams/qualification-2026-1/qualification-2026-1-finansal-muhasebe')

    expect(await screen.findByRole('link', { name: /Soruları çöz/i })).toHaveAttribute(
      'href',
      expect.stringContaining('source=qualification'),
    )
  })
})

describe.each([
  ['/', /Bugün 10 soru yeter/i],
  ['/categories', /Konuları parçalara böl/i],
  ['/categories/Muhasebe', /^Muhasebe$/i],
  ['/solve?mode=practice&category=Muhasebe&limit=1', /Önceki soru/i],
  ['/wrong', /Yanlış listen temiz/i],
  ['/favorites', /Henüz favorin yok/i],
  ['/statistics', /Rakamlar çalışma ritmini anlatsın/i],
  ['/settings', /Çalışma düzenin sana uysun/i],
  ['/about', /Sade bir çalışma aracı/i],
  ['/past-exams', /Yıllara göre çıkmış sorular/i],
  ['/past-exams/2026', /2026 Çıkmış Soruları/i],
  ['/past-exams/2025', /2025 Çıkmış Soruları/i],
  ['/past-exams/2024', /2024 Çıkmış Soruları/i],
  ['/past-exams/2023', /2023 Çıkmış Soruları/i],
  ['/past-exams/2022', /2022 Çıkmış Soruları/i],
  ['/past-exams/2021', /2021 Çıkmış Soruları/i],
  ['/past-exams/2020', /2020 Çıkmış Soruları/i],
  ['/past-exams/mixed', /Karma çıkmış sorular/i],
  ['/sgs-exams', /Staja Giriş Sınavları/i],
  ['/sgs-exams/sgs-2025-11-22', /22 Kasım 2025 SGS/i],
  ['/sgs-exams/sgs-2026-04-18', /18 Nisan 2026 SGS/i],
  ['/sgs-exams/mixed', /Karma SGS çalışması/i],
  ['/qualification-exams', /SMMM Yeterlilik Sınavları/i],
  ['/qualification-exams/qualification-2026-1', /2026\/1 Yeterlilik/i],
  ['/qualification-exams/qualification-2026-1/qualification-2026-1-finansal-muhasebe', /Finansal Muhasebe/i],
  ['/qualification-exams/mixed', /Yeterlilik belge araması/i],
  ['/qualification-study', /SMMM Yeterlilik Sınavları/i],
  ['/olmayan-sayfa', /Bu sayfa bulunamadı/i],
])('route %s', (route, expectedText) => {
  it('renders without falling through to a broken screen', async () => {
    renderApp(route)
    expect(await screen.findByText(expectedText)).toBeInTheDocument()
  })
})
