import { FileSearch, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { QualificationExamCard } from '../components/QualificationExamCard'
import qualificationData from '../data/qualificationExams.json'
import { getQualificationExams } from '../utils/qualificationExams'

export function QualificationExamsPage() {
  const exams = getQualificationExams(qualificationData.documents)
  const availableCount = qualificationData.documents.filter((document) => document.available).length
  const years = exams.map((exam) => exam.year)

  return (
    <div className="page-enter">
      <PageHeader
        eyebrow="Yeterlilik arşivi"
        title="SMMM Yeterlilik Sınavları"
        description={`${Math.min(...years)}-${Math.max(...years)} dönemlerinden ${availableCount} doğrulanmış ders belgesine dönem ve ders bazında ulaş.`}
      />

      <div className="mb-7 grid gap-4 md:grid-cols-2">
        <Link
          to="/qualification-exams/mixed"
          className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-lift transition hover:-translate-y-1"
        >
          <Layers3 className="text-amber" size={26} />
          <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.18em] text-mint">Tüm arşiv</p>
          <h2 className="mt-1 font-display text-2xl font-bold">Yeterlilik belge araması</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">Yıl ve ders seçerek tüm dönemlerdeki kaynak belgeleri filtrele.</p>
        </Link>
        <div className="panel p-6">
          <FileSearch className="text-coral" size={26} />
          <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.18em] text-coral">Kaynak doğrulama</p>
          <h2 className="mt-1 font-display text-2xl font-bold">{availableCount} erişilebilir PDF</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Belgeler kaynak sağlayıcının sayfasında açılır. Çalışmayan bağlantılar pasif gösterilir.</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-coral">Dönem seç</p>
        <h2 className="mt-1 font-display text-2xl font-bold">Yeterlilik sınav dönemleri</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {exams.map((exam) => <QualificationExamCard exam={exam} key={exam.id} />)}
      </div>
    </div>
  )
}
