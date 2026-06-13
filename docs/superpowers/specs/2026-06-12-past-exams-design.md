# Çıkmış Sorular Feature Design
## Scope

Add a past-exams area to the existing SMMM question bank without replacing its
quiz engine, progress storage, favorites, wrong-answer tracking, statistics, or
current routes.

## Data

Past-exam placeholder questions live in `src/data/pastExamQuestions.json`.
Every record uses the existing question shape plus:

- `sourceType: "past_exam"`
- `year`: an integer from 2020 through 2026
- `period`: a Turkish exam period label

Question IDs include the year and remain stable. The content is original
placeholder material and is not presented as an official exam reproduction.

## Navigation And Routes

- `/past-exams` lists 2026 through 2020 and mixed-study shortcuts.
- `/past-exams/:year` supports the seven valid years and shows category/topic
  filters before starting a practice or timed session.
- `/past-exams/mixed` supports Son 3 Yıl, Son 5 Yıl, and Tüm Yıllar plus the
  same category/topic filters.

The route order places `mixed` before `:year`. Invalid years render a useful
empty/not-found state. The home page and desktop navigation expose the new
section. Mobile users enter from the home card to avoid overcrowding the
existing five-item bottom navigation.

## Quiz Integration

Past-exam pages launch the existing `/solve` route using query parameters:

- `source=past_exam`
- `years=2026` or a comma-separated year list
- optional `category`
- optional `topic`
- existing `mode` and `limit`

`SolvePage` chooses the past-exam dataset when `source=past_exam`, applies the
new filters, and then uses the unchanged session hook and question card.
Answer recording, favorites, wrong answers, and aggregate category statistics
therefore continue to work through the existing local progress repository.

## Filtering

`src/utils/pastExams.js` owns:

- supported year constants
- range presets for 3, 5, and all years
- source/year/category/topic filtering
- year summaries and filter option extraction

Topics are constrained by the selected category. Empty filter results produce
an explanatory state rather than a broken quiz.

## Testing

Unit tests cover year presets and combined source/year/category/topic filters.
Route smoke tests cover the index, every year route, mixed route, and invalid
year behavior. Existing tests, lint, TypeScript checking, and the production
build remain part of `npm run check`.
