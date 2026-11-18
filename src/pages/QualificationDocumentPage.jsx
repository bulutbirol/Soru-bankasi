import { ArrowLeft, ExternalLink, FileCheck2, Play, ShieldCheck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import qualificationData from '../data/qualificationExams.json'

export function QualificationDocumentPage() {
  const { examId, documentId } = useParams()
  const document = qualificationData.documents.find(
    (item) => item.examId === examId && item.id === documentId,
  )

  if (!document) {
    return (
      <EmptyState
        title="Bu ders belgesi bulunamadı"
        description="Seçilen Yeterlilik belgesi katalogda yer almıyor."
        actionLabel="Yeterlilik arşivine dön"
        actionTo="/qualification-exams"
      />
    )
  }

  return (
    <div className="page-enter">
      <Link to={`/qualification-exams/${examId}`} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-muted">
        <ArrowLeft size={16} /> {document.year}/{document.period} dönemine dön
      </Link>
      <PageHeader
        eyebrow={`${document.year}/${document.period} Yeterlilik`}
        title={document.lesson}
        description={`${document.questionCount} özgün ve açıklamalı soruyu çözebilir, kaynak PDF'yi ayrıca inceleyebilirsin.`}
      />

      <div className="panel overflow-hidden">
        <div className="bg-brand p-6 text-white sm:p-8">
          <FileCheck2 className="text-white" size={32} />
          <h2 className="mt-5 text-2xl font-black">Kaynak belge doğrulandı</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/90">
            Bu belge uygulamada yeniden yayımlanmaz. Soruları ve komisyon cevaplarını özgün PDF üzerinden inceleyebilirsin.
          </p>
        </div>
        <div className="p-6 sm:p-8">
          <div className="mb-5 flex items-start gap-3 rounded-2xl bg-brand-soft p-4 text-sm leading-6">
            <ShieldCheck className="mt-0.5 shrink-0 text-brand-ink" size={20} />
            <p>Kaynak: Aktif Online SMMM Yeterlilik soru ve cevap arşivi.</p>
          </div>
          {document.available ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/solve?source=qualification&documentIds=${document.id}&limit=${document.questionCount}`}
                className="btn-primary"
              >
                <Play size={18} fill="currentColor" /> Soruları çöz
              </Link>
              <a href={document.sourceUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                <ExternalLink size={18} /> Kaynak PDF belgesini aç
              </a>
            </div>
          ) : (
            <p className="font-bold text-danger">Bu kaynak bağlantısı şu anda kullanılamıyor.</p>
          )}
        </div>
      </div>
    </div>
  )
}
