# Content Expansion, Image Repair, and SEO Design

## Scope

This change prepares the existing SMMM question bank for public deployment at
`https://smmmsorubankasi.com`.

It adds:

- 100 text questions for each year from 2020 through 2026
- a mixed content model using source-backed SGS material and original study questions
- safer SGS question image cropping
- a clear-all action for the wrong-answer collection
- technical and on-page SEO metadata for the public domain

## Content Model

`pastExamQuestions.json` will contain exactly 700 original text questions:
100 questions for each year from 2020 through 2026. Questions will be distributed
across accounting, tax, law, auditing, public finance, and economics topics.

The product will present two complementary content groups:

1. Source-backed SGS questions imported from user-provided and official exam PDFs.
2. Original text questions based on the official TESMER subject distribution and
   recurring exam concepts.

Third-party internet question text will not be copied verbatim. This avoids
copyright and duplicate-content risk while retaining realistic subject coverage.
Every question must have a unique ID, five options, one valid answer index, and a
non-empty explanation.

## Wrong Answers

The wrong-answer page will show a secondary destructive action when the collection
is not empty. Activating it will request confirmation and clear only
`wrongQuestionIds`. It will not delete favorites, totals, answer history, settings,
or recent sessions.

The storage operation will be implemented as a pure function and exposed through
the existing progress context. Unit and page-level tests will verify both the
storage boundary and the user flow.

## SGS Image Repair

The PDF importer currently crops from approximately three PDF points above the
detected question number. Fractions, formulas, and superscripts can extend above
that line and be clipped.

The renderer will use a larger top safety margin while preventing overlap with the
preceding question. All 1,690 existing SGS images will be regenerated. Validation
will verify:

- every JSON image path exists
- every exam still contains 130 questions
- no answer-revealing red pixels remain
- image dimensions remain suitable for mobile and desktop
- representative formula questions retain content above the question-number line

## SEO

The canonical production origin is `https://smmmsorubankasi.com`.

The app will include:

- Turkish title and meta description defaults
- canonical URL updates by route
- route-specific titles and descriptions
- Open Graph and Twitter metadata
- `WebSite`, `WebApplication`, and breadcrumb JSON-LD where applicable
- `robots.txt`
- `sitemap.xml` for public indexable routes
- web app manifest and icons already available or generated from existing branding
- SPA fallback configuration for common static hosts

Private/user-specific screens such as solve sessions, wrong answers, favorites,
statistics, and settings will use `noindex`. Public landing, category, past exam,
SGS archive, about, privacy, year, and exam detail routes will be indexable.

Because the hosting provider has not been specified, host-neutral static files will
be added first. Small Vercel and Netlify fallback files may coexist so either host
can serve React Router routes correctly without changing application behavior.

## Performance

The 1,690 SGS records currently contribute to the initial JavaScript bundle. SEO
work will also split large question data away from public landing routes where
practical, using route-level lazy loading or dynamic data imports without changing
the offline behavior.

Images remain WebP and will use lazy loading outside the active quiz question.

## Testing and Acceptance

The implementation is accepted when:

- each year from 2020 through 2026 has exactly 100 text questions
- question IDs and schemas are valid
- wrong answers can be cleared independently
- formula images are no longer clipped
- canonical and noindex behavior matches route visibility
- sitemap and robots files reference `https://smmmsorubankasi.com`
- lint, all tests, TypeScript checking, and production build pass
- the Git working tree contains no cache, PDF, or generated temporary files
