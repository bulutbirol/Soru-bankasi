# SGS Çıkmış Sınavlar Design
## Scope

Add a separate Staja Giriş Sınavı area without replacing or relabeling the
existing SMMM practice and past-exam content. Each imported PDF is selectable
as an individual exam, and all imported SGS exams can be solved in mixed mode.

## Source Files

The user supplied SGS PDFs on the local desktop. Six files are unique:

- 02 Mart 2024
- 13 Temmuz 2024
- 26 Ekim 2024
- 05 Nisan 2025
- 26 Temmuz 2025
- 22 Kasım 2025

The file named `18_Nisan_2026` is byte-identical to the 22 November 2025 file
and its internal title also says 22 November 2025. It is treated as a duplicate,
not as a 2026 exam.

Each PDF contains 130 questions. Correct option text is encoded in pure red
(`#ff0000`). The importer reads text geometry and color metadata, converts the
red option to the zero-based `answer` index, and records the source filename
and SHA-256 hash for traceability.

## Data

Generated records live in `src/data/sgsExamQuestions.json` and use:

- `exam: "SGS"`
- `sourceType: "past_exam"`
- `year`
- `period`: the full Turkish exam date
- `examId`: stable date-based identifier
- `sourceFile`
- existing category, topic, question, options, answer, and explanation fields

No answer is guessed. Records that cannot be parsed with exactly five options
and one red answer fail validation and are not silently accepted.

## Experience

- `/sgs-exams` lists each imported exam and a mixed SGS card.
- `/sgs-exams/:examId` shows exam metadata and category/topic filters.
- `/sgs-exams/mixed` combines all imported exams and supports category/topic
  filtering.
- Both pages launch the existing `/solve` route with `source=sgs`.

The existing QuestionCard, timer, shuffle behavior, local progress, wrong
answers, favorites, and statistics are reused. Question badges identify SGS,
exam date, and source category.

## Classification

The importer maps question number ranges using the exam booklet structure:

- 1-20: Genel Kültür ve Genel Yetenek
- 21-30: Yabancı Dil
- 31-130: Alan Bilgisi

More specific topic headings found in the PDF are retained when extraction is
reliable; otherwise the range category is used as the topic rather than
inventing a classification.

## Testing And Validation

Tests cover red-option detection, duplicate source handling, SGS filtering,
route rendering, and solve-source selection. Generated data validation requires
unique IDs, six unique exams, 130 questions per exam, five non-empty options,
and an answer index from zero to four. The final gate remains `npm run check`.
