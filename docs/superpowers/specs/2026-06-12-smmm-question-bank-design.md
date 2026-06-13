# SMMM Soru Bankasi Design
## Product

SMMM Soru Bankasi is a membership-free study application for web, iOS, and
Android. It ships with original local JSON questions, never requires a network
connection for core study flows, and stores all user activity on the device.

## Experience

The interface uses a warm editorial study aesthetic rather than a generic
dashboard. Deep navy, paper, amber, and mint colors create a calm exam-focused
environment. Mobile uses a thumb-friendly bottom navigation bar. Wider screens
use a persistent side navigation rail and larger reading surfaces.

The primary flow is:

1. Choose a category or resume recent work.
2. Choose a topic and practice or timed exam mode.
3. Answer shuffled questions with shuffled options.
4. Review immediate explanations in practice mode.
5. Finish and review a concise result summary.

## Architecture

- React 18 and React Router provide the application and route structure.
- Vite builds the web bundle used directly on web and by Capacitor.
- Tailwind CSS supplies responsive utility styling; a small global stylesheet
  defines tokens, texture, typography, and shared animation.
- Questions live in JSON and are validated/normalized by data utilities.
- A single versioned localStorage repository owns progress, wrong answers,
  favorites, aggregate statistics, settings, and recent sessions.
- A session hook owns question order, option shuffling, answers, timer state,
  score calculation, and completion.
- Capacitor packages the same build for iOS and Android.
- Advertising components expose inert AdSense and AdMob integration points.
  They do not load ad SDKs or track users in this starter.

## Main Modules

- `src/data`: original sample question database and category metadata.
- `src/storage`: versioned local persistence with safe defaults and reset.
- `src/utils`: question shuffling, scoring, formatting, and platform helpers.
- `src/hooks`: theme, progress, and question-session state.
- `src/components`: layout, navigation, cards, adverts, empty states, and
  question UI.
- `src/pages`: route-level home, discovery, solving, review, statistics,
  settings, and legal pages.
- `src/routes`: the central route table.

## Data And Progress

Question IDs are stable keys. The persisted state contains answer history by
question ID, a wrong-answer ID set, a favorite ID set, daily activity, totals,
settings, and the latest completed sessions. Correctly answering a previously
wrong question removes it from the wrong-answer set. Resetting progress keeps
the bundled question database intact.

Option shuffling maps the original answer index to the shuffled index, so
correctness is never inferred from option text. Question loading supports
category, topic, favorites, wrong answers, and full-database filters.

## Modes

Practice mode reveals correctness and explanation immediately, then enables the
next-question action. Timed mode uses a configurable duration, records answers
without revealing explanations, and automatically finishes at zero. Both modes
show progress and offer an explicit finish action.

## Reliability And Accessibility

Invalid or unavailable routes show useful empty states. Corrupt local storage
falls back to defaults. Buttons have visible focus states, answer status is not
communicated by color alone, reduced-motion preferences are respected, and
layouts remain usable from narrow phones through desktop.

## Testing

Vitest covers question shuffling, answer-index preservation, scoring, storage
migration/default behavior, and progress updates. React Testing Library covers
the highest-risk user flows: rendering categories and answering a practice
question. A production Vite build is the final integration check.
