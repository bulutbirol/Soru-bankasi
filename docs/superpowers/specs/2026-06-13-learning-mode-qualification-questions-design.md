# Learning Mode and Original Qualification Questions Design

## Scope

The application becomes a learning-focused question bank. Timed exam and mock
exam behavior is removed from every section. All multiple-choice questions use
one interaction model: the learner selects an option, then immediately sees the
correct answer and an educational explanation.

The SMMM Qualification archive gains an original multiple-choice question pool
whose size follows the number of questions found in the 120 accessible source
PDFs. Source documents are used only to measure question counts and subject
distribution. Their question wording, answer wording, tables, and solutions are
not copied.

## Qualification Question Count

The accessible archive contains 120 documents across 19 exam periods and eight
lessons. Most historical documents contain three or four classical questions.
The 2026/1 documents contain 20 multiple-choice questions per lesson.

The preliminary scan found 595 questions. Before generation, every document count
is written to the reviewed count map and the exact total is derived from that map.
Each document receives the same number of original questions as its reviewed
source count. One scan-only document whose boundaries cannot be derived reliably
is manually reviewed before its count is finalized.

The generator stores the reviewed count map in the repository so output is
deterministic and testable. A validation test checks that:

- every accessible document has a positive reviewed count
- generated totals match the count map
- IDs and question text are unique
- every question has five options
- every answer index is valid
- every explanation is non-empty

## Original Content Model

Qualification questions use the existing multiple-choice schema with these
additional fields:

- `sourceType: "qualification_original"`
- `examId`
- `documentId`
- `year`
- `period`
- `lesson`
- `topic`

Question prompts, options, correct answers, and explanations are original. The
content follows recurring concepts visible in the document’s lesson and period,
but does not reproduce source wording.

Each lesson has a curated concept bank:

- Finansal Muhasebe
- Finansal Tablolar Analizi
- Maliyet Muhasebesi
- Vergi Hukuku
- Hukuk
- Muhasebe Denetimi
- Meslek Hukuku
- Sermaye Piyasası Mevzuatı

Concept templates vary values, entities, scenarios, and option ordering to avoid
near-duplicate records. Explanations teach the governing principle and, where
applicable, show the calculation.

## Learning Interaction

There is no mode selector. All question links open the same learning session.

After selecting an option:

1. the selected option remains changeable until the learner advances
2. the correct option is visibly identified
3. incorrect selections are visibly identified
4. the explanation appears immediately
5. the learner can favorite the question
6. the learner advances with the existing next-question button

No timer, exam score framing, mock-exam label, or timed-session button remains.
The completion screen reports learning progress using correct, incorrect, and
unanswered counts without calling the session an exam.

## Navigation and Pages

The following changes apply globally:

- Home removes the timed-exam shortcut.
- Topic, past-exam, SGS, and qualification pages expose one “Soruları çöz”
  learning action.
- Mixed pages remain available for selecting years, lessons, and topics.
- Settings remove options that only support exam mode.
- Statistics no longer label sessions as exam or practice.

Qualification archive document pages provide an in-app question action whenever
original questions exist. The external PDF source remains available as a
secondary reference link.

The existing `/solve` route remains to avoid broken links, but ignores legacy
`mode=exam` parameters and always runs learning mode.

## Storage and Statistics

The existing answer, wrong-answer, favorite, and category statistics are reused.
Qualification questions are included in collections and statistics like other
multiple-choice questions.

Session records use `mode: "learning"`. Existing saved `exam` and `practice`
records remain readable and are displayed as “Çalışma” for backward
compatibility.

The obsolete exam counter remains in normalized legacy data until a future
storage-version migration, but new sessions do not present or increment an exam
concept.

## SEO and Copy

Public text describes the app as an educational question bank, not a mock-exam
platform. Titles and descriptions emphasize immediate explanations, topic-based
learning, and original Qualification questions.

README remains consumer-facing and removes timed-exam wording.

## Testing and Acceptance

The change is accepted when:

- no visible timed exam, mock exam, or “Süreli” action remains
- legacy `mode=exam` links still open a normal learning session
- selecting an option immediately reveals the correct answer and explanation
- the selected option can change before advancing
- Qualification questions open inside the app, not only as PDFs
- the generated pool matches the reviewed source-document count map
- every generated record passes schema and uniqueness checks
- wrong answers, favorites, collections, and statistics include Qualification
  questions
- public routes and SEO remain valid
- lint, all frontend tests, Python tests, TypeScript checking, and production
  build pass
