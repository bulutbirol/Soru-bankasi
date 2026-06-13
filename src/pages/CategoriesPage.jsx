import { CategoryCard } from '../components/CategoryCard'
import { PageHeader } from '../components/PageHeader'
import questions from '../data/questionBank'
import { getCategorySummary } from '../utils/questions'

export function CategoriesPage() {
  const categories = getCategorySummary(questions)
  return (
    <div className="page-enter">
      <PageHeader
        eyebrow="Ders kataloğu"
        title="Konuları parçalara böl, ilerlemeyi görünür kıl."
        description={`${questions.length} özgün örnek soru, ${categories.length} temel SMMM alanında düzenlendi.`}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => <CategoryCard category={category} key={category.name} />)}
      </div>
    </div>
  )
}
