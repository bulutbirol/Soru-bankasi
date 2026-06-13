import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))

const baseQuestions = [
  ...readJson('src/data/questions.json'),
  ...readJson('src/data/supplementalQuestions.json'),
  ...readJson('scripts/past_exam_seed_questions.json'),
]

const extraQuestions = [
  {
    category: 'Muhasebe',
    topic: 'Genel Muhasebe',
    question: 'Alıcılardan alınan bir sipariş avansı mal teslim edilene kadar hangi nitelikte izlenir?',
    options: ['Yükümlülük', 'Satış geliri', 'Öz kaynak', 'Maddi duran varlık', 'Finansman gideri'],
    answer: 0,
    explanation: 'Mal veya hizmet henüz teslim edilmediği için alınan avans işletmenin müşteriye karşı yükümlülüğüdür.',
  },
  {
    category: 'Muhasebe',
    topic: 'Maliyet Muhasebesi',
    question: 'Başabaş noktasında toplam katkı payı hangi tutara eşittir?',
    options: ['Toplam sabit maliyete', 'Toplam satış hasılatına', 'Net dönem kârına', 'Toplam değişken maliyete', 'Öz kaynak toplamına'],
    answer: 0,
    explanation: 'Başabaş noktasında katkı payı sabit maliyetleri tam karşılar ve faaliyet kârı sıfırdır.',
  },
  {
    category: 'Muhasebe',
    topic: 'Mali Tablolar',
    question: 'Nakit akış tablosunda makine satın alınması hangi faaliyet grubunda raporlanır?',
    options: ['Yatırım faaliyetleri', 'İşletme faaliyetleri', 'Finansman faaliyetleri', 'Öz kaynak faaliyetleri', 'Vergilendirme faaliyetleri'],
    answer: 0,
    explanation: 'Uzun vadeli varlık edinimleri yatırım faaliyetlerinden kaynaklanan nakit akışıdır.',
  },
  {
    category: 'Vergi',
    topic: 'Vergi Usul',
    question: 'Mükellefin vergiye ilişkin şekli ödevlerini yerine getirmemesi genel olarak hangi yaptırım türünü doğurur?',
    options: ['Usulsüzlük cezası', 'Hapis cezası', 'Gümrük vergisi', 'Amortisman', 'Uzlaşma zammı'],
    answer: 0,
    explanation: 'Vergi kanunlarının şekil ve usule ilişkin hükümlerine uyulmaması usulsüzlük yaptırımına konu olabilir.',
  },
  {
    category: 'Vergi',
    topic: 'Gelir Vergisi',
    question: 'Gelirin yıllık beyanname ile bildirilmesinde temel amaç aşağıdakilerden hangisidir?',
    options: ['Vergilendirilecek yıllık geliri topluca göstermek', 'Ticaret siciline kayıt olmak', 'Şirket sermayesini artırmak', 'KDV oranını belirlemek', 'Kamu bütçesini onaylamak'],
    answer: 0,
    explanation: 'Yıllık beyanname, ilgili gelir unsurlarını ve matrah hesabını vergi idaresine bildirir.',
  },
  {
    category: 'Vergi',
    topic: 'Katma Değer Vergisi',
    question: 'İhracat teslimlerinin KDV bakımından istisna edilmesinin temel ekonomik amacı nedir?',
    options: ['İhraç edilen malı ülke vergisinden arındırmak', 'İthalatı artırmak', 'Gelir vergisini kaldırmak', 'Sermayeyi azaltmak', 'Yurt içi tüketimi vergisiz bırakmak'],
    answer: 0,
    explanation: 'Varış ülkesinde vergileme yaklaşımı gereği ihracatın ülke içi KDV yükünden arındırılması amaçlanır.',
  },
  {
    category: 'Vergi',
    topic: 'Kurumlar Vergisi',
    question: 'Kurum kazancının tespitinde ticari bilanço kârından vergi matrahına geçerken ne yapılır?',
    options: ['Vergi mevzuatına göre gerekli ekleme ve indirimler uygulanır', 'Tüm giderler koşulsuz silinir', 'Yalnız kasa bakiyesi esas alınır', 'Satışlar tamamen vergiden çıkarılır', 'Sermaye tutarı matrah kabul edilir'],
    answer: 0,
    explanation: 'Ticari kâra kanunen kabul edilmeyen giderler ve vergiye özgü indirimler uygulanarak mali kâra ulaşılır.',
  },
  {
    category: 'Hukuk',
    topic: 'Borçlar Hukuku',
    question: 'Bir kişinin başkası adına ve hesabına hukuki işlem yapabilme yetkisine ne ad verilir?',
    options: ['Temsil yetkisi', 'Zilyetlik', 'Takas', 'İbra', 'Temerrüt'],
    answer: 0,
    explanation: 'Temsil yetkisi, temsilcinin yaptığı işlemin sonuçlarını temsil olunan üzerinde doğurmasını sağlar.',
  },
  {
    category: 'Hukuk',
    topic: 'Ticaret Hukuku',
    question: 'Ticari işletmenin devrinde işletmeye sürekli olarak özgülenmiş unsurların birlikte geçirilmesi hangi amaca hizmet eder?',
    options: ['İşletmenin ekonomik bütünlüğünü korumaya', 'Vergi borcunu ortadan kaldırmaya', 'Tacir sıfatını herkese vermeye', 'Şirketi halka açmaya', 'İş sözleşmelerini yok saymaya'],
    answer: 0,
    explanation: 'İşletme devri, ekonomik faaliyetin bütünlük içinde sürdürülebilmesini hedefler.',
  },
  {
    category: 'Hukuk',
    topic: 'Şirketler Hukuku',
    question: 'Anonim şirkette yönetim ve temsil görevi kural olarak hangi organa aittir?',
    options: ['Yönetim kuruluna', 'Genel kurul başkanına tek başına', 'Bağımsız denetçiye', 'Ticaret siciline', 'Her pay sahibine ayrı ayrı'],
    answer: 0,
    explanation: 'Anonim şirket yönetim kurulu tarafından yönetilir ve temsil olunur.',
  },
  {
    category: 'Hukuk',
    topic: 'İş Hukuku',
    question: 'İşverenin işçiyi gözetme borcu öncelikle hangi alanı kapsar?',
    options: ['İşçinin kişiliğini ve iş sağlığı güvenliğini korumayı', 'Şirket payı vermeyi', 'Vergi oranını düşürmeyi', 'Her çalışana müdürlük vermeyi', 'Rakip işletmeyi satın almayı'],
    answer: 0,
    explanation: 'Gözetme borcu işçinin kişilik değerleri ile sağlık ve güvenliğinin korunmasını gerektirir.',
  },
  {
    category: 'Denetim',
    topic: 'Denetim Riski',
    question: 'Kontrollerin önemli bir yanlışlığı zamanında önleyememesi veya tespit edememesi hangi risktir?',
    options: ['Kontrol riski', 'Tespit riski', 'Likidite riski', 'Piyasa riski', 'Kur riski'],
    answer: 0,
    explanation: 'Kontrol riski, işletmenin iç kontrol sisteminin önemli yanlışlığı önleyememesi veya bulamaması olasılığıdır.',
  },
  {
    category: 'Denetim',
    topic: 'Denetim Raporu',
    question: 'Finansal tabloların önemli tüm yönleriyle gerçeğe uygun sunulduğu sonucuna varan denetçi hangi görüşü verir?',
    options: ['Olumlu görüş', 'Olumsuz görüş', 'Görüş vermekten kaçınma', 'Sınırlı olumlu görüş', 'İç kontrol görüşü'],
    answer: 0,
    explanation: 'Yeterli ve uygun kanıt sonucunda önemli yanlışlık bulunmadığında olumlu görüş verilir.',
  },
  {
    category: 'Maliye',
    topic: 'Kamu Maliyesi',
    question: 'Piyasa mekanizmasının kaynakları toplumsal açıdan etkin dağıtamaması hangi kavramla ifade edilir?',
    options: ['Piyasa başarısızlığı', 'Tam istihdam', 'Bütçe denkliği', 'Vergi tahakkuku', 'Parasal genişleme'],
    answer: 0,
    explanation: 'Dışsallıklar, kamusal mallar ve eksik rekabet gibi durumlar piyasa başarısızlığına yol açabilir.',
  },
  {
    category: 'Maliye',
    topic: 'Bütçe',
    question: 'Bütçe ödeneklerinin belirli hizmet ve amaçlara ayrılması hangi bütçe ilkesiyle ilişkilidir?',
    options: ['Uzmanlaşma', 'Yıllık olma', 'Denklik', 'Birlik', 'Önceden izin'],
    answer: 0,
    explanation: 'Uzmanlaşma ilkesi ödeneklerin harcama yeri ve amacı bakımından belirlenmesini gerektirir.',
  },
  {
    category: 'Maliye',
    topic: 'Maliye Politikası',
    question: 'Kamu harcamalarının bir birim artırılmasının millî gelirde daha büyük bir artış yaratabilmesi hangi etkiyle açıklanır?',
    options: ['Çarpan etkisi', 'Dışlama etkisi', 'Likidite tuzağı', 'Fisher etkisi', 'Arbitraj etkisi'],
    answer: 0,
    explanation: 'Başlangıç harcamasının gelir ve tüketim zinciri oluşturması toplam gelirde katlı değişime yol açabilir.',
  },
  {
    category: 'Ekonomi',
    topic: 'Mikroekonomi',
    question: 'Üretimde kullanılan bir girdinin miktarı artırılırken diğerleri sabit tutulduğunda ek ürünün zamanla azalması hangi yasadır?',
    options: ['Azalan marjinal verimler', 'Talep kanunu', 'Gresham kanunu', 'Karşılaştırmalı üstünlük', 'Satın alma gücü paritesi'],
    answer: 0,
    explanation: 'Diğer girdiler sabitken değişken girdinin marjinal ürünü belirli bir noktadan sonra azalabilir.',
  },
  {
    category: 'Ekonomi',
    topic: 'Makroekonomi',
    question: 'Hem yüksek enflasyonun hem de yüksek işsizliğin birlikte görülmesine ne ad verilir?',
    options: ['Stagflasyon', 'Deflasyon', 'Dezenflasyon', 'Refah artışı', 'Tam istihdam'],
    answer: 0,
    explanation: 'Stagflasyon, durgunluk ve işsizliğe yüksek enflasyonun eşlik ettiği ekonomik durumdur.',
  },
  {
    category: 'Ekonomi',
    topic: 'Uluslararası Ekonomi',
    question: 'Bir ülkenin daha düşük fırsat maliyetiyle ürettiği malda uzmanlaşması hangi ilkeye dayanır?',
    options: ['Karşılaştırmalı üstünlük', 'Mutlak fiyat eşitliği', 'Tekelci rekabet', 'Azalan talep', 'Parasal tarafsızlık'],
    answer: 0,
    explanation: 'Karşılaştırmalı üstünlük, ülkelerin göreli fırsat maliyeti düşük mallarda uzmanlaşmasını açıklar.',
  },
]

const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020]
const leadIns = [
  '',
  'Mesleki uygulama açısından değerlendirildiğinde, ',
  'Temel kavramlar dikkate alındığında, ',
  'SMMM sınav kapsamına göre, ',
  'İşletme ve mevzuat uygulamaları çerçevesinde, ',
  'Mesleki yeterlilik ilkeleri bakımından, ',
  'Kavramsal çerçeve esas alındığında, ',
]

function lowerFirst(value) {
  return value.charAt(0).toLocaleLowerCase('tr-TR') + value.slice(1)
}

function rotateOptions(options, answer, rotation) {
  const normalized = options.map((text, originalIndex) => ({ text, originalIndex }))
  const offset = rotation % normalized.length
  const rotated = [...normalized.slice(offset), ...normalized.slice(0, offset)]
  return {
    options: rotated.map((option) => option.text),
    answer: rotated.findIndex((option) => option.originalIndex === answer),
  }
}

const core = [...baseQuestions, ...extraQuestions]
if (core.length !== 100) {
  throw new Error(`Expected 100 core questions, found ${core.length}`)
}

const output = years.flatMap((year, yearIndex) =>
  core.map((question, questionIndex) => {
    const rotated = rotateOptions(
      question.options,
      question.answer,
      yearIndex + questionIndex,
    )
    const leadIn = leadIns[yearIndex]
    const questionText = leadIn
      ? `${leadIn}${lowerFirst(question.question)}`
      : question.question

    return {
      id: `smmm-${year}-${String(questionIndex + 1).padStart(3, '0')}`,
      exam: 'SMMM',
      sourceType: 'past_exam',
      year,
      period: `${(questionIndex % 3) + 1}. Dönem`,
      category: question.category,
      topic: question.topic,
      difficulty: question.difficulty || ['easy', 'medium', 'hard'][questionIndex % 3],
      question: questionText,
      options: rotated.options,
      answer: rotated.answer,
      explanation: question.explanation,
    }
  }),
)

const outputPath = path.join(root, 'src/data/pastExamQuestions.json')
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
console.log(`Generated ${output.length} past-exam study questions.`)
