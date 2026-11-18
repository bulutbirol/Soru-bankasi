import { Check, CircleHelp, Heart, Lightbulb, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { questionImageUrl } from '../utils/assets'
import { loadExplanation } from '../utils/explanations'

const letters = ['A', 'B', 'C', 'D', 'E']

const optionBase = 'border-2 font-black transition active:translate-y-1 active:shadow-none'
const optionIdle = 'border-line bg-surface text-fg shadow-[0_4px_0_rgb(var(--c-line))]'
const optionRight = 'border-brand bg-brand-soft text-brand-ink shadow-[0_4px_0_rgb(var(--c-brand-deep))]'
const optionWrong = 'border-danger bg-danger-soft text-danger shadow-[0_4px_0_rgb(var(--c-danger)/0.5)]'

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
  const tone = correct
    ? { box: 'bg-brand-soft border-brand/40', text: 'text-brand-ink', icon: 'bg-brand text-white', Icon: Check }
    : unknown
      ? { box: 'bg-sun-soft border-sun/60', text: 'text-sun-ink', icon: 'bg-sun text-[#4a3300]', Icon: Lightbulb }
      : { box: 'bg-danger-soft border-danger/40', text: 'text-danger', icon: 'bg-danger text-white', Icon: X }
  const headline = unknown ? 'Birlikte çözelim!' : correct ? 'Harika! Doğru cevap.' : `Olmadı, doğrusu ${correctLetter}.`

  return (
    <div className={`mt-4 rounded-3xl border-2 p-5 ${tone.box}`} aria-live="polite">
      <div className="flex items-center gap-3">
        <span className={`grid size-10 shrink-0 place-items-center rounded-full ${tone.icon}`}>
          <tone.Icon size={22} strokeWidth={3.2} />
        </span>
        <p className={`text-xl font-black ${tone.text}`}>{headline}</p>
      </div>
      {!correct && (
        <p className="mt-2 text-sm font-bold text-muted">Soru tekrar listene eklendi, yakında yeniden karşına çıkacak.</p>
      )}
      <h3 className="mt-4 text-base font-black">Nasıl çözülür?</h3>
      {explanation === undefined && <p className="mt-2 text-sm font-bold text-muted">Çözüm yükleniyor...</p>}
      {explanation === null && (
        <p className="mt-2 text-sm font-bold leading-6">Doğru cevap {correctLetter}. Bu sorunun çözümü hazırlanıyor.</p>
      )}
      {explanation && (
        <>
          <ol className="mt-3 space-y-3">
            {explanation.steps.map((step, index) => (
              <li className="flex gap-3 text-sm font-bold leading-6" key={`${index}-${step.slice(0, 20)}`}>
                {explanation.steps.length > 1 && (
                  <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-surface text-xs font-black">{index + 1}</span>
                )}
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {question.exam === 'SGS' && (
            <p className="mt-4 rounded-2xl bg-surface p-3 text-sm font-bold leading-6">
              <span className="font-black text-brand-ink">Cevap {correctLetter}.</span>
              {explanation.tip && <> İpucu: {explanation.tip}</>}
            </p>
          )}
        </>
      )}
      <p className="mt-4 text-xs font-extrabold text-muted">Fikrini değiştirdiysen başka bir şıkka dokunabilirsin.</p>
    </div>
  )
}

export function QuestionCard({ question, selectedAnswer, favorite, onAnswer, onToggleFavorite }) {
  const reveal = selectedAnswer !== undefined
  const imageChoices = Boolean(question.questionImage)

  const optionClass = (index) => {
    if (reveal && question.answer === index) return optionRight
    if (reveal && selectedAnswer === index) return optionWrong
    return optionIdle
  }

  return (
    <article>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-xs font-black">
          <span className="rounded-xl border-2 border-brand/40 bg-brand-soft px-2.5 py-1 text-brand-ink">{question.topic || question.category}</span>
          {(question.sourceType === 'past_exam' || question.sourceType === 'qualification_original') && (
            <span className="rounded-xl border-2 border-line px-2.5 py-1 text-muted">
              {question.exam === 'SGS' ? `SGS · ${question.period}` : `${question.year} · ${question.period}`}
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label={favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          onClick={onToggleFavorite}
          className={`grid size-11 shrink-0 place-items-center rounded-2xl border-2 transition ${favorite ? 'border-danger bg-danger text-white' : 'border-line text-muted'}`}
        >
          <Heart size={19} strokeWidth={2.6} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {question.questionImage ? (
        <div className="overflow-hidden rounded-3xl border-2 border-line bg-[#fff] p-2">
          <img src={questionImageUrl(question.questionImage)} alt={question.question} className="mx-auto max-h-[56vh] w-full object-contain object-top" />
        </div>
      ) : (
        <h2 className="text-xl font-black leading-8">{question.question}</h2>
      )}

      <div
        className={imageChoices ? 'mt-5 grid grid-cols-5 gap-2' : 'mt-5 space-y-3'}
        role={imageChoices ? 'group' : undefined}
        aria-label={imageChoices ? 'Cevap seçenekleri' : undefined}
      >
        {question.options.map((option, index) => (
          imageChoices ? (
            <button
              type="button"
              key={`${question.id}-${option}`}
              aria-label={letters[index]}
              aria-pressed={selectedAnswer === index}
              onClick={() => onAnswer(index)}
              className={`h-[60px] rounded-2xl text-xl ${optionBase} ${optionClass(index)}`}
            >
              {letters[index]}
            </button>
          ) : (
            <button
              type="button"
              key={`${question.id}-${option}`}
              aria-label={`${letters[index]}. ${option}`}
              aria-pressed={selectedAnswer === index}
              onClick={() => onAnswer(index)}
              className={`flex min-h-14 w-full items-center gap-3 rounded-2xl p-3 text-left text-base ${optionBase} ${optionClass(index)}`}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl border-2 border-current text-sm">{letters[index]}</span>
              <span className="flex-1 font-extrabold">{option}</span>
            </button>
          )
        ))}
      </div>

      {!reveal && (
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => onAnswer('unknown')}
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl px-4 font-black uppercase tracking-wide text-sky"
          >
            <CircleHelp size={18} strokeWidth={2.8} /> Bilmiyorum, nasıl çözülür göster
          </button>
          <p className="mt-1 text-xs font-extrabold text-muted">Bilmiyorum demek doğruluğunu düşürmez.</p>
        </div>
      )}

      {reveal && <SolutionPanel question={question} selectedAnswer={selectedAnswer} />}
    </article>
  )
}
