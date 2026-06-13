import { Play } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { QualificationDocumentCard } from '../components/QualificationDocumentCard'
import qualificationData from '../data/qualificationExams.json'
import {
  filterQualificationDocuments,
  getQualificationLessons,
} from '../utils/qualificationExams'

export function QualificationMixedPage() {
  const [year, setYear] = useState('')
  const [lesson, setLesson] = useState('')
  const availableDocuments = qualificationData.documents.filter((document) => document.available)
  const years = [...new Set(availableDocuments.map((document) => document.year))]
    .sort((left, right) => right - left)
  const lessons = getQualificationLessons(availableDocuments)
  const filtered = useMemo(
    () => filterQualificationDocuments(availableDocuments, {
      examIds: year
        ? [...new Set(availableDocuments.filter((document) => document.year === Number(year)).map((document) => document.examId))]
        : [],
      lessons: lesson ? [lesson] : [],
    }),
    [availableDocuments, lesson, year],
  )
  const questionCount = filtered.reduce((total, document) => total + document.questionCount, 0)
  const solveParams = new URLSearchParams({
    source: 'qualification',
    documentIds: filtered.map((document) => document.id).join(','),
    limit: String(questionCount),
  })

  return (
    <div className="page-enter">
      <PageHeader
        eyebrow="Karma arşiv"
        title="Yeterlilik belge araması"
        description="Yıl ve ders seçerek özgün, cevaplı ve açıklamalı Yeterlilik çalışma setini oluştur."
      />
      <div className="panel grid gap-4 p-5 sm:grid-cols-2">
        <label className="text-sm font-bold">
          Yıl
          <select value={year} onChange={(event) => setYear(event.target.value)} className="mt-2 w-full rounded-2xl border border-ink/10 bg-transparent px-4 py-3 dark:border-white/10">
            <option value="">Tüm yıllar</option>
            {years.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
        <label className="text-sm font-bold">
          Ders
          <select value={lesson} onChange={(event) => setLesson(event.target.value)} className="mt-2 w-full rounded-2xl border border-ink/10 bg-transparent px-4 py-3 dark:border-white/10">
            <option value="">Tüm dersler</option>
            {lessons.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="my-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-slate-500">{filtered.length} belge · {questionCount} soru bulundu</p>
        <Link
          to={`/solve?${solveParams}`}
          className={`btn-primary ${questionCount ? '' : 'pointer-events-none opacity-40'}`}
        >
          <Play size={18} fill="currentColor" /> Seçimi çalış
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((document) => <QualificationDocumentCard document={document} key={document.id} />)}
      </div>
    </div>
  )
}
