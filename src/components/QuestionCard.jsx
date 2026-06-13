import { Check, Heart, X } from 'lucide-react'

const letters = ['A', 'B', 'C', 'D', 'E']

export function QuestionCard({
  question,
  selectedAnswer,
  favorite,
  onAnswer,
  onToggleFavorite,
}) {
  const answered = selectedAnswer !== undefined
  const reveal = answered
  const imageChoices = Boolean(question.questionImage)

  return (
    <article className="panel overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-ink/10 p-5 dark:border-white/10 sm:p-7">
        <div>
          <div className="mb-3 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-ink px-3 py-1 text-white dark:bg-white dark:text-ink">{question.category}</span>
            <span className="rounded-full bg-amber/20 px-3 py-1 text-amber-800 dark:text-amber">{question.topic}</span>
            {(question.sourceType === 'past_exam' || question.sourceType === 'qualification_original') && (
              <span className="rounded-full bg-mint/20 px-3 py-1 text-emerald-800 dark:text-mint">
                {question.sourceType === 'qualification_original'
                  ? `${question.year} · ${question.period}`
                  : question.exam === 'SGS' ? `SGS · ${question.period}` : `${question.year} · ${question.period}`}
              </span>
            )}
          </div>
          {!question.questionImage && <h2 className="text-lg font-bold leading-8 sm:text-xl">{question.question}</h2>}
        </div>
        <button
          type="button"
          aria-label={favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          onClick={onToggleFavorite}
          className={`grid size-11 shrink-0 place-items-center rounded-2xl border transition ${
            favorite ? 'border-coral bg-coral text-white' : 'border-ink/10 bg-white/60 text-slate-500 dark:border-white/10 dark:bg-white/5'
          }`}
        >
          <Heart size={19} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className={imageChoices ? 'p-4 sm:p-5' : 'space-y-3 p-5 sm:p-7'}>
        {question.questionImage && (
          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white p-1.5 dark:border-white/10">
            <img
              src={question.questionImage}
              alt={question.question}
              className="mx-auto max-h-[72vh] w-full object-contain"
            />
          </div>
        )}
        <div
          className={imageChoices ? 'mt-4 flex items-center justify-center gap-2.5 sm:gap-4' : 'space-y-3'}
          role={imageChoices ? 'group' : undefined}
          aria-label={imageChoices ? 'Cevap seçenekleri' : undefined}
        >
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrect = question.answer === index
            let state = 'border-ink/10 bg-white/60 hover:border-ink/30 dark:border-white/10 dark:bg-white/[0.04]'
            if (reveal && isCorrect) state = 'border-emerald-500 bg-emerald-500/10'
            else if (reveal && isSelected) state = 'border-coral bg-coral/10'
            else if (isSelected) state = 'border-amber bg-amber/15'

            if (imageChoices) {
              return (
                <button
                  type="button"
                  key={`${question.id}-${option}`}
                  aria-label={letters[index]}
                  aria-pressed={isSelected}
                  onClick={() => onAnswer(index)}
                  className={`grid size-11 shrink-0 place-items-center rounded-full border-2 text-sm font-extrabold transition sm:size-12 ${state}`}
                >
                  {letters[index]}
                </button>
              )
            }

            return (
              <button
                type="button"
                key={`${question.id}-${option}`}
                aria-label={`${letters[index]}. ${option}`}
                aria-pressed={isSelected}
                onClick={() => onAnswer(index)}
                className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border p-3 text-left font-semibold transition sm:p-4 ${state}`}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-ink/5 text-sm font-extrabold dark:bg-white/10">
                  {letters[index]}
                </span>
                <span className="flex-1">{option}</span>
                {reveal && isCorrect && <Check className="text-emerald-600" size={20} />}
                {reveal && isSelected && !isCorrect && <X className="text-coral" size={20} />}
              </button>
            )
          })}
        </div>
      </div>
      {reveal && (
        <div className="border-t border-ink/10 bg-amber/10 p-5 dark:border-white/10 sm:p-7">
          <h3 className="font-display text-lg font-bold">Cevap açıklaması</h3>
          <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">{question.explanation}</p>
        </div>
      )}
    </article>
  )
}
