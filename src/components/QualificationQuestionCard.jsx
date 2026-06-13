import { Check, Eye, Heart } from 'lucide-react'
import { useState } from 'react'

export function QualificationQuestionCard({
  question,
  completed = false,
  favorite = false,
  onComplete,
  onToggleFavorite,
}) {
  const [revealed, setRevealed] = useState(false)

  return (
    <article className="panel overflow-hidden">
      <div className="border-b border-ink/10 p-5 dark:border-white/10 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-coral">
              {question.lesson}
            </p>
            <h2 className="mt-2 font-display text-xl font-bold leading-8">
              {question.question}
            </h2>
          </div>
          {onToggleFavorite && (
            <button
              type="button"
              aria-label={favorite ? 'Favoriden çıkar' : 'Favoriye ekle'}
              onClick={onToggleFavorite}
              className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
                favorite ? 'bg-coral text-white' : 'bg-ink/5 text-slate-500 dark:bg-white/10'
              }`}
            >
              <Heart size={19} fill={favorite ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
        {question.questionImage && (
          <img
            src={question.questionImage}
            alt={`${question.lesson} klasik sınav sorusu`}
            className="mt-5 w-full rounded-2xl bg-white object-contain"
          />
        )}
      </div>

      <div className="p-5 sm:p-7">
        {!revealed ? (
          <button type="button" className="btn-primary w-full justify-center" onClick={() => setRevealed(true)}>
            <Eye size={18} /> Cevabı göster
          </button>
        ) : (
          <div className="rounded-2xl border border-mint/50 bg-mint/10 p-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-700 dark:text-mint">
              Komisyon cevabı
            </p>
            {question.answerText && <p className="mt-3 whitespace-pre-wrap text-sm leading-7">{question.answerText}</p>}
            {question.answerImage && (
              <img
                src={question.answerImage}
                alt={`${question.lesson} komisyon cevabı`}
                className="mt-4 w-full rounded-xl bg-white object-contain"
              />
            )}
            {onComplete && (
              <button
                type="button"
                onClick={onComplete}
                disabled={completed}
                className="btn-secondary mt-5 disabled:opacity-60"
              >
                <Check size={18} /> {completed ? 'Çalışıldı' : 'Çalışıldı olarak işaretle'}
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
