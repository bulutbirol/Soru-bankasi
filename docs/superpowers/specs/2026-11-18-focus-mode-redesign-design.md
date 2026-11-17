# Focus Mode Redesign

Design canvas: https://claude.ai/artifact/5KJSCJTyfnv9SNYuZfT2Si (approved 2026-11-18).

## Intent

Make studying feel short, focused and rewarding. Question content stays as is (it comes from the source PDFs); the system around it changes. Students who do not know an answer should learn how it is solved instead of guessing.

## Goals

- Daily goal (default 10 questions) with a progress ring and a day streak on the home page.
- One primary action on home: "Kaldığın yerden devam".
- Focus solve screen: no sidebar/nav, segmented progress bar, question, A-E, and a "Bilmiyorum" action.
- "Bilmiyorum" reveals the correct answer and a step-by-step solution. It does not count as wrong in accuracy; the question goes to the review list.
- Back navigation: "Önceki soru" works at any point of a session.
- Answers can be changed after reveal. Statistics keep the first answer only.
- Spaced review: wrong and unknown questions come back after 1, 3, 7 days.
- Session end screen: celebration, week streak strip, "5 soru daha" / "Bugünlük yeter".
- SGS explanations written per exam into lazy-loaded files; questions without one show "Doğru cevap X, çözüm hazırlanıyor".
- Alan Bilgisi SGS questions get real ders tags (Muhasebe, Vergi, Hukuk, ...) as explanations are written.
- Import missing SGS exams (aktifonline 2016-2021, 18 Temmuz 2026 separately).

## Fixes from the audit

- canonical, og:*, robots.txt, sitemap.xml and README point to https://smmm-soru-bankasi.vercel.app.
- Remove the visible AdSense/AdMob placeholder.
- Page title no longer repeats the site name.
- HomePage must not import qualificationQuestions.json (577 KB in the main bundle).

## Non-goals

- Rewriting or regenerating existing question text.
- Accounts, cloud sync, paid APIs.

## Constraints

- Free: explanations are written by hand in working sessions, newest exam first, one exam per commit.
- Local progress must survive: keep the `smmm-progress-v1` key, add new fields through `normalizeProgress` defaults.
- Never silently change an answer key. If a solution disagrees with the red-marked key, list the id in `src/data/sgsExplanations/_flags.json`.
- Vercel deploy size: check before adding all old exam images.

## Approaches

1. Restyle in place: keep React/Vite/Tailwind, rework pages and session hook. Chosen: smallest change, keeps tests and routes.
2. New app shell rewrite: more freedom, throws away working filters and tests.
3. Separate "focus" route next to old UI: two UIs to maintain.

## Data shape

- `src/data/sgsExplanations/<examId>.json`: `{ "<questionId>": { "steps": ["..."], "tip": "...", "category": "Muhasebe", "topic": "..." } }`, loaded with dynamic `import()` when a question of that exam is shown.
- Progress additions: `unknownQuestionIds`, `review: { [id]: { due, step } }`, `settings.dailyGoal`, first-answer-only stats.

## Left to the builder

Exact component split, animation details, desktop layout of the focus screen (centered phone-width column).
