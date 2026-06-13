export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-coral">{eyebrow}</p>}
        <h1 className="max-w-3xl font-display text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>}
      </div>
      {action}
    </header>
  )
}
