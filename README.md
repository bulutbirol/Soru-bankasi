# SMMM Soru Bankası

Backend, üyelik ve giriş gerektirmeyen; web, iOS ve Android için hazırlanmış React tabanlı SMMM ve SGS çalışma uygulaması. Sorular uygulamayla birlikte gelir, kullanıcı ilerlemesi yalnızca cihazdaki `localStorage` alanında tutulur.

## Özellikler

- Pratik ve süreli sınav modları
- 60 özgün metin sorusu ve 2020-2026 çalışma arşivi
- 13 ayrı SGS sınavı ve toplam 1.690 kaynak soru
- Tek sınav, karma SGS, Son 3 Yıl, Son 5 Yıl ve Tüm Yıllar modları
- Ders, konu, yanlış cevap ve favori filtreleri
- Görsel sorularda kompakt A/B/C/D/E cevap düğmeleri
- Sonraki soruya geçene kadar cevabı değiştirebilme
- Soru ve metin seçeneklerini karıştırma
- Soru sayısına göre otomatik artan sınav süresi
- Açıklama, ilerleme çubuğu, istatistik ve yerel çalışma geçmişi
- Açık, koyu ve sistem teması
- Web için AdSense, mobil için AdMob yer tutucuları
- Capacitor iOS ve Android yapılandırması

## Teknolojiler

- React 18
- Vite
- Tailwind CSS
- React Router
- Capacitor
- Vitest ve React Testing Library

## Kurulum

Node.js 20 veya üzeri önerilir.

```bash
npm install
npm run dev
```

Üretim ve kalite kontrolleri:

```bash
npm run build
npm run preview
npm test
npm run lint
npm run typecheck
npm run check
```

## iOS ve Android

```bash
npm install
npm run build
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios
npx cap open android
```

Platform klasörleri eklendikten sonra web değişikliklerini aktarmak için:

```bash
npm run build
npx cap sync
```

iOS derlemesi macOS ve Xcode, Android derlemesi Android Studio ve Android SDK gerektirir. Uygulama kimliği ile görünen adı [`capacitor.config.ts`](./capacitor.config.ts) dosyasından değiştirilebilir.

## Soru Verisi

Metin soru havuzu [`src/data/questionBank.js`](./src/data/questionBank.js) tarafından birleştirilir:

- [`src/data/questions.json`](./src/data/questions.json)
- [`src/data/supplementalQuestions.json`](./src/data/supplementalQuestions.json)
- [`src/data/pastExamQuestions.json`](./src/data/pastExamQuestions.json)

Yeni paketler ayrı JSON dosyalarında tutulup `questionBank.js` içine eklenebilir. Her kaydın benzersiz ve kalıcı bir `id` alanı bulunmalıdır:

```json
{
  "id": "smmm-001",
  "exam": "SMMM",
  "category": "Muhasebe",
  "topic": "Genel Muhasebe",
  "difficulty": "easy",
  "question": "Soru metni",
  "options": ["A", "B", "C", "D", "E"],
  "answer": 0,
  "explanation": "Cevap açıklaması"
}
```

`answer`, `options` dizisindeki sıfır tabanlı doğru cevap indeksidir. Yıllara göre çalışma kayıtları ayrıca `sourceType`, `year` ve `period` alanlarını taşır.

## SGS Arşivi

- Sınav listesi: `src/data/sgsExams.json`
- Soru kayıtları: `src/data/sgsExamQuestions.json`
- Yüksek çözünürlüklü soru görselleri: `public/sgs/questions/`

Kaynak PDF'de kırmızı işaretlenen seçenek içe aktarma sırasında doğru cevap olarak kaydedilir. Kullanıcıya gösterilen görselde kırmızı işaret siyaha dönüştürülür; cevaplar görselin altında kompakt düğmelerle sunulur.

Yeni SGS PDF'lerini içe aktarmak için:

```bash
python -m pip install pymupdf pillow
python scripts/import_sgs_pdfs.py "PDF_KLASORU" src/data/sgsExamQuestions.json --metadata-output src/data/sgsExams.json --image-output public/sgs/questions
```

İçe aktarıcı aynı içeriğe sahip PDF'leri SHA-256 özetiyle ayıklar ve her sınav için 130 soru doğrular.

## Rotalar

```text
/
/categories
/topics/:category
/solve
/past-exams
/past-exams/:year
/past-exams/mixed
/sgs-exams
/sgs-exams/:examId
/sgs-exams/mixed
/wrong
/favorites
/statistics
/settings
/about
```

## Sınav Süresi

Süreli oturumlar TESMER'in 130 soru için 165 dakika uygulamasına göre ölçeklenir:

```text
süre = yukarı yuvarla(soru sayısı × 165 / 130)
```

Örneğin 10 soruluk sınav 13 dakika, 130 soruluk sınav 165 dakikadır.

## Yerel Veri

[`src/storage/progress.js`](./src/storage/progress.js) aşağıdaki verileri sürümlü tek bir kayıt altında saklar:

- Çözülen ve yanlış cevaplanan sorular
- Favoriler
- Toplam ve ders bazlı istatistikler
- Günlük aktivite ve son oturumlar
- Tema, soru sayısı ve karıştırma tercihleri

Bozuk veya eski kayıtlar güvenli varsayılanlara normalize edilir. Ayarlardaki sıfırlama işlemi yalnızca kullanıcı ilerlemesini temizler.

## Reklam Yerleri

[`src/components/ads/AdSlot.jsx`](./src/components/ads/AdSlot.jsx), Capacitor platform algılamasına göre web için AdSense ve mobil için AdMob yer tutucusu gösterir. Bu sürüm reklam SDK'sı yüklemez. Canlı yayın öncesinde rıza akışı, test reklam kimlikleri, mağaza veri beyanları ve gizlilik politikası tamamlanmalıdır.

## Resmî Referanslar

Özgün metin soru havuzunun konu kapsamı TESMER'in yayımladığı ölçüm alanları ve soru dağılımı incelenerek hazırlanmıştır; internetten soru metni kopyalanmamıştır.

- [TESMER sınav konuları](https://www.tesmer.org.tr/?p=257)
- [TESMER değerlendirme ölçütleri](https://www.tesmer.org.tr/?p=256)
- [18 Nisan 2026 SGS duyurusu](https://www.tesmer.org.tr/?p=7227)
- [2026/1 uygulama kılavuzu](https://asym.ankara.edu.tr/wp-content/uploads/sites/372/2026/03/TURMOB-TESMER-STAJA-GIRIS-SINAVI-2026-1.DONEM-UYGULAMA-KILAVUZU.pdf)

## İçerik Notu

Metin soru havuzu eğitim amacıyla özgün olarak hazırlanmıştır. SGS görsel arşivi sağlanan ve resmî arşivden doğrulanan sınav kitapçıklarından üretilmiştir. Yayın ve dağıtım öncesinde içerik kullanım hakları ile güncel mevzuat uzman tarafından ayrıca değerlendirilmelidir.
