export function PastExamFilters({
  categories,
  topics,
  category,
  topic,
  onCategoryChange,
  onTopicChange,
}) {
  return (
    <div className="panel grid gap-4 p-5 sm:grid-cols-2">
      <label className="text-sm font-bold">
        <span className="mb-2 block text-xs uppercase tracking-wider text-slate-500">Ders filtresi</span>
        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="min-h-12 w-full rounded-2xl border border-ink/15 bg-white/70 px-4 dark:border-white/15 dark:bg-ink"
        >
          <option value="">Tüm dersler</option>
          {categories.map((item) => <option value={item} key={item}>{item}</option>)}
        </select>
      </label>
      <label className="text-sm font-bold">
        <span className="mb-2 block text-xs uppercase tracking-wider text-slate-500">Konu filtresi</span>
        <select
          value={topic}
          onChange={(event) => onTopicChange(event.target.value)}
          className="min-h-12 w-full rounded-2xl border border-ink/15 bg-white/70 px-4 dark:border-white/15 dark:bg-ink"
        >
          <option value="">Tüm konular</option>
          {topics.map((item) => <option value={item} key={item}>{item}</option>)}
        </select>
      </label>
    </div>
  )
}
