import { Check, CircleHelp, Heart, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { questionImageUrl } from '../utils/assets'
import { loadExplanation } from '../utils/explanations'

const letters = ['A', 'B', 'C', 'D', 'E']

function SolutionPanel({ question, selectedAnswer }) {
  const [explanation, setExplanation] = useState()

  useEffect(() => {
    let active = true
    setExplanation(undefined)
    loadExplanation(question)
      .catch(() => null)
      .then((value) => { if (active) setExplanation(value) })
    return () => { active = false }
  }, [question])

  const correctLetter = letters[question.answer]
  const unknown = selectedAnswer === 'unknown'
  const correct = selectedAnswer === question.answer
  const headline = unknown
    ? 'Birlikte çözelim.'
    : correct ? 'Doğru! Böyle devam.' : `Bu sefer olmadı, doğrusu ${correctLetter}.`

  return (
    <div className="border-t border-ink/10 bg-amber/10 p-5 dark:border-white/10 sm:p-6" aria-live="polite">
      <p className={`font-display text-lg font-bold ${correct ? 'text-emerald-700 dark:text-mint' : unknown ? 'text-amber-800 dark:text-amber' : 'text-coral'}`}>
        {headline}
      </p>
      {!correct && (
        <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
          Soru tekrar listene eklendi, yakında yeniden karşına çıkacak.
        </p>
      )}
      <h3 className="mt-4 font-display text-base font-bold">Nasıl çözülür?</h3>
      {explanation === undefined && <p className="mt-2 text-sm text-slate-500">Çözüm yükleniyor...</p>}
      {explanation === null && (
        <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">
          Doğru cevap {correctLetter}. Bu sorunun çözümü hazırlanıyor.
        </p>
      )}
      {explanation && (
        <>
          <ol className="mt-3 space-y-3">
            {explanation.steps.map((step, index) => (
              <li className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300" key={step}>
                {explanation.steps.length > 1 && (
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-amber/20 text-xs font-extrabold text-amber-800 dark:text-amber">
                    {index + 1}
                  </span>
                )}
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {question.exam === 'SGS' && (
            <p className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm leading-6">
              <strong className="text-emerald-700 dark:text-mint">Cevap {correctLetter}.</strong>
              {explanation.tip && <> İpucu: {explanation.tip}</>}
            </p>
          )}
        </>
      )}
      <p className="mt-4 text-xs font-semibold text-slate-500">Fikrini değiştirdiysen başka bir şıkka dokunabilirsin.</p>
    </div>
  )
}

export function QuestionCard({
  question,
  selectedAnswer,
  favorite,
  onAnswer,
  onToggleFavorite,
}) {
  const reveal = selectedAnswer !== undefined
  const imageChoices = Boolean(question.questionImage)

  return (
    <article className="panel overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-ink/10 p-5 dark:border-white/10 sm:p-6">
        <div>
          <div className="mb-3 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-mint/20 px-3 py-1 text-emerald-800 dark:text-mint">{question.topic || question.category}</span>
            {(question.sourceType === 'past_exam' || question.sourceType === 'qualification_original') && (
              <span className="rounded-full bg-ink/5 px-3 py-1 text-slate-600 dark:bg-white/10 dark:text-slate-300">
                {question.exam === 'SGS' ? `SGS · ${question.period}` : `${question.year} · ${question.period}`}
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
      <div className={imageChoices ? 'p-4 sm:p-5' : 'space-y-3 p-5 sm:p-6'}>
        {question.questionImage && (
          <div className="overflow-hidden rounded-2xl bg-white p-2">
            <img src={questionImageUrl(question.questionImage)} alt={question.question} className="mx-auto max-h-[60vh] w-full object-contain object-top" />
          </div>
        )}
        <div
          className={imageChoices ? 'mt-4 grid grid-cols-5 gap-2' : 'space-y-3'}
          role={imageChoices ? 'group' : undefined}
          aria-label={imageChoices ? 'Cevap seçenekleri' : undefined}
        >
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrect = question.answer === index
            let state = 'border-ink/10 bg-white/60 hover:border-ink/30 dark:border-white/10 dark:bg-white/[0.04]'
            if (reveal && isCorrect) state = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-mint'
            else if (reveal && isSelected) state = 'border-coral bg-coral/10 text-coral'

            if (imageChoices) {
              return (
                <button
                  type="button"
                  key={`${question.id}-${option}`}
                  aria-label={letters[index]}
                  aria-pressed={isSelected}
                  onClick={() => onAnswer(index)}
                  className={`h-14 rounded-2xl border-2 text-lg font-extrabold transition ${state}`}
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
        {!reveal && (
          <>
            <button
              type="button"
              onClick={() => onAnswer('unknown')}
              className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-amber/60 font-extrabold text-amber-800 transition hover:bg-amber/10 dark:text-amber"
            >
              <CircleHelp size={18} /> Bilmiyorum, nasıl çözülür göster
            </button>
            <p className="mt-2 text-center text-xs font-semibold text-slate-500">
              Bilmiyorum demek doğruluğunu düşürmez, soruyu tekrar listene ekler.
            </p>
          </>
        )}
      </div>
      {reveal && <SolutionPanel question={question} selectedAnswer={selectedAnswer} />}
    </article>
  )
}
