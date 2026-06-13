import { Database, ShieldCheck, Smartphone } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'

export function AboutPage() {
  return (
    <div className="page-enter">
      <PageHeader
        eyebrow="Hakkında ve gizlilik"
        title="Sade bir çalışma aracı, sade bir veri politikası."
        description="SMMM Soru Bankası üyelik gerektirmez ve temel işlevleri için sunucu kullanmaz."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: ShieldCheck, title: 'Hesap yok', text: 'Ad, e-posta veya kullanıcı profili istenmez.' },
          { icon: Database, title: 'Yerel kayıt', text: 'İlerleme ve tercihler tarayıcıda veya cihaz uygulama alanında tutulur.' },
          { icon: Smartphone, title: 'Üç platform', text: 'Aynı React uygulaması web, iOS ve Android üzerinde çalışır.' },
        ].map((item) => (
          <section className="panel p-6" key={item.title}>
            <item.icon className="text-coral" size={25} />
            <h2 className="mt-4 font-display text-xl font-bold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.text}</p>
          </section>
        ))}
      </div>
      <article className="panel mt-5 space-y-6 p-6 sm:p-8">
        <section>
          <h2 className="font-display text-2xl font-bold">Gizlilik politikası</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
            Uygulamanın bu sürümü kişisel veri toplamaz, hesap oluşturmaz ve çalışma geçmişini uzak bir sunucuya göndermez.
            Çözülen sorular, yanlışlar, favoriler, istatistikler ve ayarlar cihazın yerel depolama alanında saklanır.
            Uygulamayı silmek veya ayarlardan ilerlemeyi sıfırlamak bu verileri kaldırır.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold">Reklamlar</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
            Kod tabanında web için AdSense ve mobil için AdMob yer tutucuları bulunur. Gerçek reklam SDK&apos;ları eklenmeden reklam,
            çerez veya reklam ölçüm verisi işlenmez. Canlı reklam entegrasyonunda ilgili sağlayıcının izin, rıza ve gizlilik
            gereklilikleri ayrıca uygulanmalıdır.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold">Soru içeriği</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
            Paket içindeki örnek sorular uygulama geliştirme amacıyla özgün olarak hazırlanmıştır. Resmî sınav sorusu değildir
            ve herhangi bir kurumla bağlantı veya başarı garantisi ifade etmez.
          </p>
        </section>
        <p className="text-xs font-bold text-slate-400">Son güncelleme: 12 Haziran 2026</p>
      </article>
    </div>
  )
}
