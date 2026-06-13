import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const catalogPath = path.join(root, 'src/data/qualificationExams.json')
const questionsPath = path.join(root, 'src/data/qualificationQuestions.json')

const counts = {
  'qualification-2019-2': { 'Finansal Muhasebe': 2, 'Finansal Tablolar Analizi': 3, 'Maliyet Muhasebesi': 3 },
  'qualification-2019-3': { 'Finansal Muhasebe': 4, 'Finansal Tablolar Analizi': 3, 'Maliyet Muhasebesi': 4 },
  'qualification-2020-1': { 'Finansal Muhasebe': 4 },
  'qualification-2021-1': { 'Finansal Muhasebe': 4, 'Finansal Tablolar Analizi': 2, Hukuk: 4, 'Maliyet Muhasebesi': 3, 'Meslek Hukuku': 4, 'Muhasebe Denetimi': 3, 'Sermaye Piyasası Mevzuatı': 4 },
  'qualification-2021-2': { 'Finansal Muhasebe': 5, 'Finansal Tablolar Analizi': 2, Hukuk: 4, 'Maliyet Muhasebesi': 4, 'Meslek Hukuku': 4, 'Muhasebe Denetimi': 3, 'Sermaye Piyasası Mevzuatı': 4 },
  'qualification-2021-3': { 'Finansal Muhasebe': 4, 'Finansal Tablolar Analizi': 1, Hukuk: 4, 'Maliyet Muhasebesi': 4, 'Meslek Hukuku': 4, 'Muhasebe Denetimi': 3, 'Sermaye Piyasası Mevzuatı': 3 },
  'qualification-2022-1': { 'Finansal Muhasebe': 5, 'Finansal Tablolar Analizi': 2, Hukuk: 5, 'Maliyet Muhasebesi': 5, 'Meslek Hukuku': 4, 'Muhasebe Denetimi': 3, 'Sermaye Piyasası Mevzuatı': 3 },
  'qualification-2022-2': { 'Finansal Muhasebe': 4, 'Finansal Tablolar Analizi': 2, Hukuk: 4, 'Maliyet Muhasebesi': 4, 'Meslek Hukuku': 4, 'Muhasebe Denetimi': 3, 'Sermaye Piyasası Mevzuatı': 3 },
  'qualification-2022-3': { 'Finansal Muhasebe': 5, 'Finansal Tablolar Analizi': 2, Hukuk: 4, 'Maliyet Muhasebesi': 4, 'Meslek Hukuku': 4, 'Muhasebe Denetimi': 3, 'Sermaye Piyasası Mevzuatı': 3 },
  'qualification-2023-2': { 'Finansal Muhasebe': 5, 'Finansal Tablolar Analizi': 2, Hukuk: 4, 'Maliyet Muhasebesi': 3, 'Meslek Hukuku': 4, 'Muhasebe Denetimi': 3, 'Sermaye Piyasası Mevzuatı': 3, 'Vergi Hukuku': 3 },
  'qualification-2023-3': { 'Finansal Muhasebe': 5, 'Finansal Tablolar Analizi': 2, Hukuk: 4, 'Maliyet Muhasebesi': 3, 'Meslek Hukuku': 4, 'Muhasebe Denetimi': 3, 'Sermaye Piyasası Mevzuatı': 3, 'Vergi Hukuku': 4 },
  'qualification-2024-1': { 'Finansal Muhasebe': 4, 'Finansal Tablolar Analizi': 2, Hukuk: 4, 'Maliyet Muhasebesi': 3, 'Meslek Hukuku': 4, 'Muhasebe Denetimi': 3, 'Sermaye Piyasası Mevzuatı': 3, 'Vergi Hukuku': 4 },
  'qualification-2024-2': { 'Finansal Muhasebe': 4, 'Finansal Tablolar Analizi': 2, Hukuk: 4, 'Maliyet Muhasebesi': 3, 'Meslek Hukuku': 4, 'Muhasebe Denetimi': 3, 'Sermaye Piyasası Mevzuatı': 3, 'Vergi Hukuku': 4 },
  'qualification-2024-3': { 'Finansal Muhasebe': 3, 'Finansal Tablolar Analizi': 3, Hukuk: 4, 'Maliyet Muhasebesi': 3, 'Meslek Hukuku': 4, 'Muhasebe Denetimi': 3, 'Sermaye Piyasası Mevzuatı': 4, 'Vergi Hukuku': 4 },
  'qualification-2025-1': { 'Finansal Muhasebe': 4, 'Finansal Tablolar Analizi': 2, Hukuk: 4, 'Maliyet Muhasebesi': 4, 'Meslek Hukuku': 4, 'Muhasebe Denetimi': 3, 'Vergi Hukuku': 3 },
  'qualification-2025-2': { 'Finansal Muhasebe': 4, 'Finansal Tablolar Analizi': 3, Hukuk: 4, 'Maliyet Muhasebesi': 3, 'Meslek Hukuku': 4, 'Muhasebe Denetimi': 3, 'Sermaye Piyasası Mevzuatı': 3, 'Vergi Hukuku': 3 },
  'qualification-2025-3': { 'Finansal Muhasebe': 5, 'Finansal Tablolar Analizi': 3, Hukuk: 4, 'Maliyet Muhasebesi': 3, 'Meslek Hukuku': 4, 'Muhasebe Denetimi': 3, 'Sermaye Piyasası Mevzuatı': 3, 'Vergi Hukuku': 3 },
  'qualification-2026-1': Object.fromEntries(['Finansal Muhasebe', 'Finansal Tablolar Analizi', 'Hukuk', 'Maliyet Muhasebesi', 'Meslek Hukuku', 'Muhasebe Denetimi', 'Sermaye Piyasası Mevzuatı', 'Vergi Hukuku'].map((lesson) => [lesson, 20])),
}

const concepts = {
  'Finansal Muhasebe': [
    ['Tahakkuk esası', 'gelir ve giderlerin nakit hareketinden bağımsız olarak doğdukları dönemde kaydedilmesidir', 'vadeli satışın tahsilat beklenmeden satış tarihinde gelir yazılması'],
    ['Dönemsellik', 'işletmenin sürekliliği içinde faaliyet sonuçlarının belirli raporlama dönemlerine ayrılmasıdır', 'gelecek yıla ait sigortanın ilgili döneme gider aktarılması'],
    ['İhtiyatlılık', 'belirsizliklerde varlık ve geliri abartmayan makul tahminlerin kullanılmasıdır', 'şüpheli hale gelen alacak için karşılık değerlendirilmesi'],
    ['Özün önceliği', 'işlemlerin yalnız hukuki biçimine değil ekonomik gerçeğine göre muhasebeleştirilmesidir', 'finansman niteliğindeki işlemin ekonomik içeriğine göre sunulması'],
    ['Tutarlılık', 'benzer işlemlerde seçilen muhasebe politikalarının dönemler arasında korunmasıdır', 'stok değerleme yönteminin gerekçesiz değiştirilmemesi'],
    ['Maliyet bedeli', 'bir varlığın edinilmesi için katlanılan satın alma ve doğrudan ilişkilendirilebilir harcamaların toplamıdır', 'makine fiyatına taşıma ve montaj giderlerinin eklenmesi'],
    ['Amortisman', 'amortismana tabi tutarın yararlı ömür boyunca sistematik dağıtılmasıdır', 'üretim makinesi maliyetinin kullanım yıllarına gider olarak paylaştırılması'],
    ['Stok değer düşüklüğü', 'stok maliyetinin geri kazanılabilir satış değerini aşan kısmının giderleştirilmesidir', 'modası geçen ürünlerin net gerçekleşebilir değere indirilmesi'],
    ['Karşılık', 'zamanı veya tutarı belirsiz mevcut bir yükümlülük için yapılan tahmindir', 'kaybedilmesi muhtemel dava için güvenilir tutarda yükümlülük ayrılması'],
    ['Bilanço eşitliği', 'varlıkların yabancı kaynaklar ile öz kaynakların toplamına eşit olmasıdır', 'peşin varlık alımında bir varlık kalemi artarken diğerinin azalması'],
  ],
  'Finansal Tablolar Analizi': [
    ['Cari oran', 'dönen varlıkların kısa vadeli yabancı kaynaklara bölünmesiyle likiditeyi ölçer', 'işletmenin kısa vadeli borç ödeme gücünün genel düzeyde incelenmesi'],
    ['Asit-test oranı', 'stoklar dışındaki likit dönen varlıkların kısa vadeli borçları karşılama gücünü ölçer', 'stokların hızla paraya çevrilemediği durumda likiditenin değerlendirilmesi'],
    ['Nakit oran', 'hazır değerler ve menkul kıymetlerin kısa vadeli borçlara oranıdır', 'yalnız en likit varlıklarla ödeme gücünün ölçülmesi'],
    ['Dikey analiz', 'aynı tablodaki kalemlerin seçilen bir toplam içindeki yüzdesini gösterir', 'stokların toplam varlıklar içindeki payının hesaplanması'],
    ['Yatay analiz', 'finansal tablo kalemlerinin dönemler arasındaki tutar ve yüzde değişimini inceler', 'satışların önceki yıla göre artış oranının bulunması'],
    ['Trend analizi', 'bir baz dönem 100 kabul edilerek çok dönemli gelişimi gösterir', 'beş yıllık alacak seyrinin baz yıla göre karşılaştırılması'],
    ['Stok devir hızı', 'satışların maliyetinin ortalama stoklara oranıyla stok yenilenme hızını ölçer', 'stokların yılda kaç kez satışa dönüştüğünün hesaplanması'],
    ['Alacak devir hızı', 'kredili satışların ortalama ticari alacaklara oranıdır', 'müşterilerden tahsilat etkinliğinin incelenmesi'],
    ['Borçlanma oranı', 'yabancı kaynakların toplam kaynaklar içindeki ağırlığını gösterir', 'varlıkların ne ölçüde borçla finanse edildiğinin belirlenmesi'],
    ['Net kâr marjı', 'net dönem kârının net satışlara oranıdır', 'her bir satış lirasından kalan net kârın ölçülmesi'],
  ],
  Hukuk: [
    ['Hak ehliyeti', 'kişinin haklara ve borçlara sahip olabilme yeteneğidir', 'gerçek kişinin doğumla birlikte miras hakkı edinebilmesi'],
    ['Fiil ehliyeti', 'kişinin kendi işlemleriyle hak kazanıp borç altına girebilmesidir', 'ayırt etme gücü olan ergin kişinin sözleşme yapabilmesi'],
    ['Dürüstlük kuralı', 'hakların kullanılması ve borçların ifasında dürüst davranmayı gerektirir', 'sözleşme tarafının karşı tarafın haklı güvenini boşa çıkarmaması'],
    ['İyiniyet', 'bir hakkın kazanılmasına engel olguyu bilmemek ve bilmesi gerekmemektir', 'yetkisizliği makul biçimde bilmeyen kişinin korunma talebi'],
    ['Temsil', 'bir kişinin hukuki işlemi başkası adına ve hesabına yapmasıdır', 'yetkili çalışanın işletme adına kira sözleşmesi imzalaması'],
    ['Haksız fiil', 'hukuka aykırı ve kusurlu davranışla başkasına zarar verilmesidir', 'dikkatsiz davranışla üçüncü kişinin malına zarar verilmesi'],
    ['Sebepsiz zenginleşme', 'haklı neden olmadan başkasının malvarlığından zenginleşmedir', 'yanlış hesaba gönderilen paranın iadesinin istenmesi'],
    ['Müteselsil borç', 'alacaklının borcun tamamını borçlulardan herhangi birinden isteyebilmesidir', 'birden çok borçludan birinin borcun tamamını ödemesi'],
    ['Tüzel kişilik', 'örgütlenmiş kişi veya mal topluluğunun bağımsız hak öznesi olmasıdır', 'şirketin ortaklarından ayrı malvarlığına sahip olması'],
    ['Zamanaşımı', 'sürenin geçmesiyle alacağın dava edilebilirliğine karşı savunma imkânı doğurur', 'borçlunun süresi geçen talebe karşı defide bulunması'],
  ],
  'Maliyet Muhasebesi': [
    ['Direkt ilk madde ve malzeme', 'üretilen mamulle doğrudan ilişkilendirilebilen temel malzeme maliyetidir', 'mobilya üretiminde kullanılan kereste bedeli'],
    ['Direkt işçilik', 'mamule doğrudan yüklenebilen üretim emeği maliyetidir', 'montaj hattında mamul üzerinde çalışan işçinin ücreti'],
    ['Genel üretim gideri', 'direkt malzeme ve direkt işçilik dışında kalan üretim maliyetidir', 'fabrika binasının amortisman gideri'],
    ['Sabit maliyet', 'belirli faaliyet aralığında toplam tutarı üretim hacminden etkilenmeyen maliyettir', 'aylık fabrika kira gideri'],
    ['Değişken maliyet', 'toplam tutarı faaliyet hacmiyle aynı yönde değişen maliyettir', 'üretilen her birim için kullanılan ambalaj gideri'],
    ['Katkı payı', 'satış geliri ile değişken maliyetler arasındaki farktır', 'sabit giderleri ve kârı karşılayan satış fazlasının hesaplanması'],
    ['Başabaş noktası', 'toplam gelir ile toplam maliyetin eşit olduğu faaliyet düzeyidir', 'işletmenin kâr veya zarar etmediği satış miktarının bulunması'],
    ['Sipariş maliyet yöntemi', 'maliyetlerin birbirinden farklı iş veya siparişler bazında izlendiği yöntemdir', 'özel tasarım geminin maliyetinin proje bazında toplanması'],
    ['Safha maliyet yöntemi', 'kesintisiz ve benzer üretimde maliyetlerin üretim aşamalarında toplandığı yöntemdir', 'çimento üretiminde maliyetin safhalar itibarıyla izlenmesi'],
    ['Eşdeğer birim', 'yarı tamamlanmış üretimin tamamlanma derecesine göre tam birime çevrilmesidir', 'dönem sonu yarı mamulünün işçilik açısından tam birim karşılığının bulunması'],
  ],
  'Meslek Hukuku': [
    ['Mesleki özen', 'meslek mensubunun görevini bilgi, dikkat ve titizlikle yürütmesidir', 'beyanname öncesi belgelerin makul kontrollerden geçirilmesi'],
    ['Sır saklama', 'görev nedeniyle öğrenilen müşteri bilgilerinin yetkisiz kişilerle paylaşılmamasıdır', 'müşterinin mali bilgilerinin üçüncü kişiye açıklanmaması'],
    ['Bağımsızlık', 'mesleki yargının çıkar veya baskı etkisinden uzak tutulmasıdır', 'yakın mali ilişki bulunan iş için tehdit değerlendirmesi yapılması'],
    ['Tarafsızlık', 'önyargı ve çıkar çatışmasının mesleki kararı etkilemesine izin verilmemesidir', 'iki müşteri arasındaki uyuşmazlıkta nesnel davranılması'],
    ['Mesleki yeterlilik', 'güncel teknik bilgi ve becerinin korunarak hizmette uygulanmasıdır', 'mevzuat değişiklikleri için sürekli eğitim alınması'],
    ['Haksız rekabet', 'mesleki rekabeti dürüstlük kurallarına aykırı biçimde bozan davranıştır', 'yanıltıcı vaatlerle başka meslek mensubunun müşterisinin hedeflenmesi'],
    ['Reklam yasağı ilkesi', 'mesleğin itibarını zedeleyen ve yanıltıcı tanıtımdan kaçınmayı gerektirir', 'garantili sonuç vaadi içeren tanıtım yapılmaması'],
    ['Çalışma kâğıtları', 'yapılan işlemleri ve ulaşılan sonuçları destekleyen mesleki belgelerdir', 'kontrol adımlarının dosyada tarih ve bulgularla kaydedilmesi'],
    ['Çıkar çatışması', 'mesleki görevin farklı menfaatler nedeniyle etkilenme riskidir', 'rakip iki işletmeye hizmet öncesi tehdit ve önlem değerlendirilmesi'],
    ['Meslek itibarı', 'davranışların kamu güvenini ve mesleğin saygınlığını korumasını gerektirir', 'meslek dışı faaliyette de güveni sarsacak davranıştan kaçınılması'],
  ],
  'Muhasebe Denetimi': [
    ['Makul güvence', 'denetim riskini kabul edilebilir düşük düzeye indiren yüksek fakat mutlak olmayan güvencedir', 'denetçinin tüm yanlışlıkları garanti etmeden yeterli kanıt toplaması'],
    ['Mesleki şüphecilik', 'kanıtları sorgulayan ve hata ya da hile ihtimaline karşı uyanık tutumdur', 'yönetim açıklamasını destekleyici belgeyle karşılaştırmak'],
    ['Önemlilik', 'bir yanlışlığın kullanıcı kararlarını etkileme olasılığına ilişkin ölçüttür', 'küçük tutarlı ancak sözleşme ihlaline yol açan hatanın değerlendirilmesi'],
    ['Denetim riski', 'önemli yanlışlık içeren tabloya uygun olmayan görüş verilmesi riskidir', 'doğal risk, kontrol riski ve tespit riskinin birlikte ele alınması'],
    ['Kontrol testi', 'iç kontrolün tasarım ve işleyiş etkinliği hakkında kanıt toplar', 'satın alma onayının dönem boyunca uygulanıp uygulanmadığının incelenmesi'],
    ['Maddi doğrulama prosedürü', 'işlem, bakiye ve açıklamalardaki önemli yanlışlıkları tespit etmeyi amaçlar', 'ticari alacak bakiyelerinin müşterilerden teyit edilmesi'],
    ['Dış teyit', 'üçüncü kişiden doğrudan denetçiye gelen yazılı denetim kanıtıdır', 'banka bakiyesinin bankadan doğrulanması'],
    ['Analitik prosedür', 'finansal ve finansal olmayan veriler arasındaki makul ilişkileri değerlendirir', 'brüt kâr marjındaki beklenmeyen değişimin araştırılması'],
    ['Olumlu görüş', 'tabloların önemli yönleriyle geçerli çerçeveye uygun sunulduğu sonucunu bildirir', 'yeterli kanıt sonrası önemli yanlışlık bulunmaması'],
    ['Çalışma kâğıtları', 'denetim prosedürleri, kanıtlar ve sonuçların yazılı kaydıdır', 'örneklem seçimi ile ulaşılan sonucun dosyada belgelenmesi'],
  ],
  'Sermaye Piyasası Mevzuatı': [
    ['Kamuyu aydınlatma', 'yatırım kararını etkileyebilecek bilgilerin zamanında, doğru ve yeterli açıklanmasıdır', 'önemli gelişmenin yatırımcılara eş zamanlı duyurulması'],
    ['İçsel bilgi', 'kamuya açıklanmamış ve açıklansa sermaye aracı değerini etkileyebilecek bilgidir', 'henüz duyurulmamış önemli birleşme kararının bilinmesi'],
    ['Piyasa dolandırıcılığı', 'fiyat, arz veya talep hakkında yanlış izlenim oluşturan işlemlerdir', 'gerçek ekonomik amaç olmadan yapay işlem hacmi yaratılması'],
    ['İhraççı', 'sermaye piyasası araçlarını ihraç eden veya ihraç için başvuran tüzel kişidir', 'finansman amacıyla borçlanma aracı sunan şirket'],
    ['İzahname', 'halka arz edilecek araç ve ihraççı hakkında yatırımcıya kapsamlı bilgi sunan belgedir', 'riskler ile mali bilgilerin halka arz öncesi açıklanması'],
    ['Yatırımcı tazmini', 'belirli koşullarda yatırım kuruluşunun teslim yükümlülüğünü yerine getirememesine karşı korumadır', 'saklanan nakit veya aracın iade edilememesi halinde mekanizmanın işletilmesi'],
    ['Kurumsal yönetim', 'adillik, şeffaflık, hesap verebilirlik ve sorumluluk ilkelerine dayalı yönetimdir', 'yönetim kararlarının pay sahiplerine karşı hesap verebilir olması'],
    ['Halka açık ortaklık', 'payları halka arz edilmiş veya mevzuat gereği halka açık sayılan ortaklıktır', 'payları borsada işlem gören anonim ortaklık'],
    ['Yatırım hizmeti', 'sermaye piyasası araçlarına ilişkin mevzuatta tanımlı aracılık ve benzeri faaliyetlerdir', 'müşteri emrinin yetkili kuruluşça gerçekleştirilmesi'],
    ['Özel durum açıklaması', 'yatırımcı kararını etkileyebilecek gelişmenin kamuya duyurulmasıdır', 'şirket faaliyetini önemli ölçüde etkileyen olayın ilan edilmesi'],
  ],
  'Vergi Hukuku': [
    ['Verginin kanuniliği', 'vergi, resim, harç ve benzeri yükümlülüklerin kanunla konulup değiştirilmesini gerektirir', 'idarenin kanuni dayanak olmadan yeni vergi yükü oluşturamaması'],
    ['Vergiyi doğuran olay', 'vergi kanununun bağladığı olayın gerçekleşmesi veya hukuki durumun tamamlanmasıdır', 'teslim işleminin gerçekleşmesiyle ilgili vergi borcunun doğması'],
    ['Mükellef', 'vergi kanunlarına göre vergi borcu kendisine düşen kişidir', 'geliri nedeniyle verginin asli borçlusu olan kişi'],
    ['Vergi sorumlusu', 'verginin ödenmesi bakımından alacaklı idareye karşı muhatap olan kişidir', 'başkasına ait vergiyi kesip vergi dairesine yatıran işveren'],
    ['Tarh', 'vergi alacağının matrah ve oranlar üzerinden idarece hesaplanması işlemidir', 'beyan edilen matrah üzerinden ödenecek verginin hesaplanması'],
    ['Tebliğ', 'vergilendirmeyi ilgilendiren hususların yetkili makamca muhataba bildirilmesidir', 'ihbarnamenin usulüne uygun biçimde mükellefe ulaştırılması'],
    ['Tahakkuk', 'tarh ve tebliğ edilen verginin ödenmesi gereken aşamaya gelmesidir', 'itiraz süreci sonunda vergi borcunun kesinleşerek ödenebilir olması'],
    ['Tahsil', 'vergi borcunun kanuna uygun biçimde ödenmesidir', 'mükellefin tahakkuk eden borcu vergi dairesine yatırması'],
    ['Vergi ziyaı', 'mükellef veya sorumlunun ödevlere aykırılığı yüzünden verginin eksik ya da geç tahakkuk etmesidir', 'matrahın eksik bildirilmesi nedeniyle verginin noksan hesaplanması'],
    ['Pişmanlık', 'beyana dayalı vergilerde ihlalin kendiliğinden bildirilip şartlarla düzeltilmesine imkân veren kurumdur', 'inceleme başlamadan eksik beyanın idareye bildirilmesi'],
  ],
}

function rotate(values, amount) {
  const offset = ((amount % values.length) + values.length) % values.length
  return [...values.slice(offset), ...values.slice(0, offset)]
}

function createQuestion(document, ordinal, documentIndex) {
  const lessonConcepts = concepts[document.lesson]
  const conceptIndex = (documentIndex * 3 + ordinal) % lessonConcepts.length
  const form = Math.floor((documentIndex + ordinal) / lessonConcepts.length) % 2
  const target = lessonConcepts[conceptIndex]
  const candidates = Array.from({ length: 5 }, (_, offset) => lessonConcepts[(conceptIndex + offset) % lessonConcepts.length])
  const answer = (documentIndex + ordinal) % 5
  const ordered = rotate(candidates, -answer)
  const context = `${document.year}/${document.period} ${document.lesson} çalışma sorusu ${ordinal + 1}`

  if (form === 0) {
    return {
      question: `${context}: “${target[1]}” açıklaması hangi kavramı ifade eder?`,
      options: ordered.map((concept) => concept[0]),
      answer,
      explanation: `Doğru cevap ${target[0]} kavramıdır. ${target[0]}, ${target[1]}.`,
      topic: target[0],
    }
  }

  return {
    question: `${context}: Aşağıdakilerden hangisi “${target[0]}” kavramına uygun bir örnektir?`,
    options: ordered.map((concept) => concept[2]),
    answer,
      explanation: `${target[2][0].toLocaleUpperCase('tr-TR')}${target[2].slice(1)}, ${target[0]} için uygun örnektir; çünkü ${target[1]}.`,
    topic: target[0],
  }
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
const questions = []

catalog.documents.forEach((document, documentIndex) => {
  const questionCount = document.available ? counts[document.examId]?.[document.lesson] : 0
  if (document.available && !questionCount) {
    throw new Error(`Question count missing for ${document.id}`)
  }
  document.questionCount = questionCount || 0
  document.contentStatus = questionCount ? 'original_questions_ready' : 'catalog_only'

  for (let ordinal = 0; ordinal < document.questionCount; ordinal += 1) {
    const generated = createQuestion(document, ordinal, documentIndex)
    questions.push({
      id: `${document.id}-original-${String(ordinal + 1).padStart(2, '0')}`,
      exam: 'SMMM Yeterlilik',
      sourceType: 'qualification_original',
      examId: document.examId,
      documentId: document.id,
      year: document.year,
      period: `${document.period}. Dönem`,
      category: document.lesson,
      lesson: document.lesson,
      difficulty: ordinal % 3 === 0 ? 'easy' : ordinal % 3 === 1 ? 'medium' : 'hard',
      ...generated,
    })
  }
})

if (questions.length !== 548) {
  throw new Error(`Expected 548 questions, generated ${questions.length}`)
}

fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`)
fs.writeFileSync(questionsPath, `${JSON.stringify(questions, null, 2)}\n`)
console.log(`Generated ${questions.length} original qualification questions.`)
