# Focus Mode Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Daily-goal, focus-mode study flow with "Bilmiyorum" solutions, back navigation and changeable answers, plus audit fixes and new SGS content.

**Architecture:** Restyle in place on the existing React/Vite/Tailwind app. Progress logic stays in `src/storage/progress.js` (pure functions, tested), session logic in `useQuestionSession`. SGS explanations live in per-exam JSON files loaded with dynamic `import()`.

**Tech Stack:** React 18, react-router 6, Tailwind 3, Vitest + Testing Library, lucide-react.

**Spec:** `docs/superpowers/specs/2026-11-18-focus-mode-redesign-design.md`

## Global Constraints

- Keep localStorage key `smmm-progress-v1`; new fields only through `normalizeProgress` defaults.
- Site origin: `https://smmm-soru-bankasi.vercel.app`.
- Daily goal default 10. Review intervals 1, 3, 7 days.
- "Bilmiyorum" never counts as wrong in accuracy. Stats count the first answer per question per session only.
- Never change an `answer` key in question data; disagreements go to `src/data/sgsExplanations/_flags.json`.
- Write JSON with Node or the Write tool, never PowerShell `Set-Content`/`Out-File`.
- No new dependencies. All copy in Turkish.
- `npm run check` passes after every task.

## Review Focus

- Old saved progress without new fields loads without crash and keeps totals (test in Task 2).
- Changing an answer after reveal does not double-count totals or daily activity (test in Task 3).
- Going back to the first question and pressing "Önceki" does nothing, no index -1 (test in Task 3).
- Explanation file missing for an exam: fallback text shows, no thrown error (test in Task 4).
- Streak across a skipped day resets to 0/1, and timezone uses local date not UTC (test in Task 2).

---

### Task 1: Audit fixes

**Files:**
- Modify: `index.html`, `public/robots.txt`, `public/sitemap.xml`, `README.md`, `src/utils/seo.js`, `src/components/SeoManager.jsx`, `src/components/ads/AdSlot.jsx` and its usages, `src/pages/HomePage.jsx`
- Test: `src/utils/seoFiles.test.js`

- [ ] Step 1: Update `seoFiles.test.js` to expect `https://smmm-soru-bankasi.vercel.app` in robots/sitemap/index.html and no `smmmsorubankasi.com` anywhere.
- [ ] Step 2: Run `npm test -- seoFiles` → FAIL.
- [ ] Step 3: Replace origin everywhere (`SITE_ORIGIN` in `seo.js`). Fix title so the site name appears once. `AdSlot` returns `null`. HomePage reads qualification count from `qualificationExams.json` (or a constant) instead of importing `qualificationQuestions.json`.
- [ ] Step 4: `npm run check` → PASS; main `index-*.js` under 300 kB.
- [ ] Step 5: Commit `fix: correct site origin, drop ad placeholder, slim home bundle`.

### Task 2: Progress model (goal, streak, review, unknown)

**Files:**
- Modify: `src/storage/progress.js`, `src/hooks/useProgress.jsx`
- Test: `src/storage/progress.test.js`

**Interfaces:**
- Produces:
  - `recordAnswer(progress, { questionId, result: 'correct'|'wrong'|'unknown', category, now?: Date })` — `unknown` adds to `unknownQuestionIds` + review, does not touch `totals.correct/wrong`, still counts toward `dailyActivity` and `totals.answered`.
  - `getStreak(progress, now?: Date) -> number` (consecutive local days with `dailyActivity >= 1`, today optional).
  - `getTodayCount(progress, now?) -> number`.
  - `getDueReviewIds(progress, now?) -> string[]`.
  - `progress.review[id] = { due: 'YYYY-MM-DD', step: 0|1|2 }`; correct answer on a due review advances step (1→3→7 days), at step 2 correct removes it; wrong/unknown resets to step 0, due +1 day.
  - `settings.dailyGoal` default 10.
  - `localDate(now) -> 'YYYY-MM-DD'` using local time (replace `toISOString().slice(0,10)`).

- [ ] Step 1: Tests: legacy object without `review`/`unknownQuestionIds` normalizes; `unknown` leaves accuracy untouched; review schedule 1/3/7; streak 3 days, gap resets; today count.
- [ ] Step 2: `npm test -- progress` → FAIL.
- [ ] Step 3: Implement. Keep `wrongQuestionIds` behavior for wrong answers. Expose new actions in `useProgress`.
- [ ] Step 4: `npm run check` → PASS.
- [ ] Step 5: Commit `feat: daily goal, streak and spaced review in progress`.

### Task 3: Session hook — back, change, unknown

**Files:**
- Modify: `src/hooks/useQuestionSession.js`, `src/pages/SolvePage.jsx`
- Test: `src/hooks/useQuestionSession.test.js` (create)

**Interfaces:**
- Produces: session `{ answer(index|'unknown'), prev(), next(), goTo(i), firstAnswers, answers, canGoBack }`. `firstAnswers[id]` set once; `answers[id]` overwritable. SolvePage records progress on the first answer only (at answer time, not on next).

- [ ] Step 1: Tests (renderHook): prev at index 0 stays 0; answer twice keeps first in `firstAnswers`; `'unknown'` stored; `calculateResult` counts unknown separately (`unknown` field) and not in wrong.
- [ ] Step 2: Run → FAIL.
- [ ] Step 3: Implement; update `calculateResult` in `src/utils/questions.js` + its tests.
- [ ] Step 4: `npm run check` → PASS (update `App.test.jsx` where flow changed).
- [ ] Step 5: Commit `feat: back navigation, changeable answers and unknown option`.

### Task 4: Bilmiyorum and explanation loading

**Files:**
- Create: `src/utils/explanations.js`, `src/data/sgsExplanations/_flags.json` (`[]`)
- Modify: `src/components/QuestionCard.jsx`
- Test: `src/utils/explanations.test.js`

**Interfaces:**
- Produces: `loadExplanation(question) -> Promise<{ steps: string[], tip?: string } | null>`. Non-SGS: `{ steps: [question.explanation] }`. SGS: `import.meta.glob('../data/sgsExplanations/*.json')` lookup by `examId`, entry by `question.id`; missing file or entry → `null`.
- QuestionCard: "Bilmiyorum, nasıl çözülür göster" dashed button under A–E; on reveal show numbered steps + tip; `null` → "Doğru cevap X. Bu sorunun çözümü hazırlanıyor." "Cevabımı değiştir" link after reveal.

- [ ] Step 1: Tests: non-SGS returns its explanation; SGS with no file returns null; SGS with fixture file returns steps.
- [ ] Step 2: Run → FAIL. Step 3: Implement. Step 4: `npm run check` → PASS.
- [ ] Step 5: Commit `feat: Bilmiyorum reveals step-by-step solution`.

### Task 5: Focus solve screen and session end

**Files:**
- Modify: `src/pages/SolvePage.jsx`, `src/components/AppLayout.jsx` (hide nav on `/solve`)
- Test: `src/App.test.jsx`

- [ ] Step 1: Test: on `/solve` the main navigation is absent; segmented progress shows N segments; end screen shows streak text and "5 soru daha" link.
- [ ] Step 2: Run → FAIL. Step 3: Implement per canvas boards 2 and 4 (centered max-w-md column on desktop, close button to `/`, Önceki/Boş bırak row, feedback panel with encouraging copy: correct streak "N doğru üst üste", wrong "Soru tekrar listene eklendi").
- [ ] Step 4: `npm run check` → PASS. Step 5: Commit `feat: focus mode solve and celebratory session end`.

### Task 6: Home redesign

**Files:**
- Modify: `src/pages/HomePage.jsx`, `src/components/Navigation.jsx`
- Test: `src/App.test.jsx`

- [ ] Step 1: Test: home shows "x/10" goal ring, streak days, "Kaldığın yerden devam" link to `/solve` (due reviews first, else SGS), review count card linking to `/solve?collection=review`.
- [ ] Step 2: Run → FAIL. Step 3: Implement per canvas board 1; add `collection=review` (due ids + unknown ids) in SolvePage. Step 4: `npm run check` → PASS.
- [ ] Step 5: Commit `feat: goal-driven home page`.

### Task 7: SGS explanations (recurring, one exam per commit)

**Files:** Create `src/data/sgsExplanations/<examId>.json`; modify `src/data/sgsExamQuestions.json` only for `category`/`topic` of Alan Bilgisi questions.

- [ ] For each exam, newest first (`sgs-2026-04-18` first): read each webp, write `{ steps (2–4), tip, category, topic }`, flag key disagreements in `_flags.json`.
- [ ] Add a test in `explanations.test.js` that every entry has ≥1 step and its id exists in `sgsExamQuestions.json`.
- [ ] `npm run check` → PASS. Commit `content: SGS <date> explanations`.

### Task 8: Import missing SGS exams

**Files:** `scripts/import_sgs_pdfs.py`, `src/data/sgsExams.json`, `src/data/sgsExamQuestions.json`, `public/sgs/questions/`

- [ ] Pilot: download one 2021 PDF from aktifonline into an empty temp dir, run importer with `python -I`, verify 130 questions and red-answer detection; fix importer + its test if layout differs.
- [ ] Check deploy size budget (Vercel) before importing all 2016–2021 exams; import newest first.
- [ ] 18 Temmuz 2026: separate source (smmmonline/TESMER); only if a PDF with marked answers is available.
- [ ] `npm run check` → PASS. Commit per batch `content: add SGS <years> exams`.
