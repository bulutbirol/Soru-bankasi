export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-1 text-sm font-black text-brand-ink">{eyebrow}</p>}
        <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-muted">{description}</p>}
      </div>
      {action}
    </header>
  )
}
