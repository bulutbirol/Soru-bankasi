# SMMM Yeterlilik Sınavları Design

## Scope

This change adds a separate SMMM Yeterlilik Sınavları archive to the existing
question bank. The archive covers every accessible period and lesson linked from
the Aktif Online SMMM Yeterlilik page.

The public archive does not duplicate or redistribute third-party PDF files unless
the repository owner supplies the files with reuse permission. Instead, it stores
exam metadata and opens each source PDF from its original URL. A reusable local
importer supports user-supplied or licensed PDFs.

## Archive Model

The archive metadata is stored in `src/data/qualificationExams.json`. Each record
contains:

- a stable exam and document ID
- year, period, date label, and lesson
- original source page and PDF URL
- availability status
- content format detected after an authorized import
- imported question count when local content exists

The catalog includes all working links on the source page. Entries marked as
missing or “Yakında” are excluded from selectable study material.

## Imported Question Model

Authorized local PDFs are converted into
`src/data/qualificationQuestions.json`. Two question types are supported:

1. `multiple_choice`: question text or image, five options, answer index, and
   answer explanation.
2. `written`: question text or image and a hidden commission answer revealed by
   the user.

Tables, journal entries, formulas, and layouts that cannot be represented reliably
as plain text are kept as high-resolution WebP images. Accessible text remains
searchable and selectable whenever PDF extraction is reliable.

Every imported record contains its source document ID, year, period, lesson,
question number, source page, and stable content hash. Duplicate imports are
rejected.

## User Experience

The home page receives a Yeterlilik Sınavları card separate from SGS and the
existing study archive.

The archive supports:

- period selection
- lesson filtering
- individual document pages
- mixed study across selected periods and lessons
- direct access to the original source PDF

Multiple-choice records reuse the existing quiz interaction. Written records use a
dedicated study card with:

- question display
- “Cevabı Göster” action
- favorite action
- “Çalışıldı” state
- previous and next navigation
- progress indicator

The interface follows the current mobile-first visual language and remains usable
in dark mode.

## Routes

The following public routes are added:

- `/qualification-exams`
- `/qualification-exams/mixed`
- `/qualification-exams/:examId`
- `/qualification-exams/:examId/:documentId`

The written-question study route is user-specific and uses `noindex`:

- `/qualification-study`

Public archive routes receive route-specific title, description, canonical,
Open Graph, and sitemap entries.

## Storage

Existing favorites and statistics continue to work for imported multiple-choice
questions. Written questions add locally stored viewed and completed IDs without
requiring registration or a backend.

Clearing application progress removes these study states together with the other
local progress data.

## Import Pipeline

The importer accepts a directory of authorized PDF files plus catalog metadata.
It:

1. hashes files and rejects duplicates
2. detects period and lesson metadata
3. identifies multiple-choice or written structure
4. splits questions and answers
5. renders complex sections as WebP
6. writes normalized JSON records
7. produces a validation report for documents that require manual review

Automatic parsing is never allowed to silently publish incomplete questions.
Documents with uncertain boundaries, missing answers, or unreadable pages remain
catalog-only until reviewed.

## Rights and Attribution

The archive page identifies Aktif Online and the original PDF URL as the source of
catalog metadata. Third-party PDFs and full question text are not committed to the
repository without documented reuse permission.

This boundary does not apply to PDFs supplied by the repository owner when they
have the right to reproduce them, or to original questions created for the app.

## Testing and Acceptance

The implementation is accepted when:

- every working source-page PDF link appears once in the catalog
- unavailable links cannot start a study session
- period and lesson filters return correct records
- public and private routes have correct SEO indexing behavior
- written answers remain hidden until requested
- written progress and favorites persist locally
- imported question IDs and document IDs are unique
- missing images and invalid source references fail validation
- parser uncertainty is reported instead of silently ignored
- lint, unit tests, TypeScript checking, and production build pass
