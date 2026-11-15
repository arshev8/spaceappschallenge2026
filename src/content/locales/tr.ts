import type { ContentTranslation } from '../localize.ts';

const ART = 'Çizimler ve şemalar: ECHOES ekibinin özgün CSS/SVG çalışmaları (NASA görüntüleri değildir).';

/** Bilimsel içeriğin Türkçe çevirisi. Anahtarlar ve sıralama İngilizce verilerle aynıdır. */
export const tr: ContentTranslation = {
  missions: {
    apollo11: {
      title: 'Apollo 11 Lazer Ölçüm Retroreflektörü',
      chapterTitle: 'Hiç Susmayan Ayna',
      target: 'Ay — Huzur Denizi',
      hardwareType: 'Pasif retroreflektör dizisi (güç kaynağı yok, radyo yok)',
      chronology: [
        { date: '1969', event: 'Apollo 11 astronotları reflektör dizisini Ay’da bırakır.' },
        { date: '1969 → bugün', event: 'Dünya’daki lazer ölçüm gözlemevleri Apollo yansıtıcılarına hâlâ lazer gönderiyor.' },
      ],
      statusDetail: 'Hiçbir güç kaynağı yok ve kendi sinyalini göndermiyor. Gözlemevlerinin ona yönelttiği lazer ışığını yalnızca geri yansıtıyor.',
      scienceQuestion: 'Ay ne kadar uzakta ve bu mesafe nasıl değişiyor?',
      method: 'Ay’a lazerle mesafe ölçümü: bir lazer atımının reflektöre gidip geri dönme süresini ölçmek.',
      result: 'Mesafe = ışık hızı × gidiş-dönüş süresi ÷ 2.',
      takeaway: 'Mühendislik ürünleri asıl görevlerinden uzun yaşayıp bilime destek olmayı sürdürebilir.',
      claims: {
        'ap11-cubes': 'Apollo 11 dizisinde, 46 cm’lik alüminyum bir panel üzerinde, her biri 3,8 cm genişliğinde 100 adet erimiş silika köşe küpü reflektörü bulunur.',
        'ap11-location': 'Apollo 11 dizisi Huzur Denizi’nde bulunuyor.',
        'ap11-ranging': 'Dünya’daki gözlemevleri, Apollo reflektörlerini kullanarak Ay’ın uzaklığını düzenli olarak ölçmüştür.',
        'moon-receding': 'Lazer ölçümleri, Ay’ın Dünya’dan yavaşça uzaklaştığını gösteriyor: her yıl yaklaşık 3,8 cm.',
      },
      credits: [ART],
    },
    opportunity: {
      title: 'Mars Keşif Aracı Opportunity',
      chapterTitle: 'Görevinden Uzun Yaşayan Keşif Aracı',
      target: 'Mars — Meridiani Planum',
      hardwareType: 'Güneş enerjili, altı tekerlekli keşif aracı',
      chronology: [
        { date: '7 Temmuz 2003', event: 'Dünya’dan fırlatılış.' },
        { date: '24 Ocak 2004 (PST)', event: 'Meridiani Planum’da, Eagle adlı küçük bir kraterin içine iniş.' },
        { date: '10 Haziran 2018', event: 'Gezegen çapındaki bir toz fırtınası sırasında son iletişim.' },
        { date: '13 Şubat 2019', event: 'NASA görevin sona erdiğini açıklar.' },
      ],
      statusDetail: 'Görev, bağlantıyı yeniden kurmak için gönderilen binden fazla komut sonuçsuz kalınca 13 Şubat 2019’da sona erdi.',
      scienceQuestion: 'Eski Mars bir zamanlar daha sulu, hatta yaşama elverişli olabilir miydi?',
      method: 'Kayalara kadar gidip kameralar ve aletlerle minerallerini ve dokularını incelemek.',
      result: 'Suda oluşan bir mineral olan hematiti ve Endeavour Krateri’nde eski suya dair güçlü işaretler buldu. Bu, geçmişte yaşama elverişli koşullara işaret ediyor; yaşamın kanıtı değil.',
      takeaway: 'Kayalar geçmiş ortamların tarihini kaydeder.',
      claims: {
        'opp-90-sols': 'Opportunity, 90 sol (Mars günü) dayanacak ve yaklaşık 1.000 metre yol alacak şekilde tasarlanmıştı.',
        'opp-sol': 'Bir sol, bir Mars günüdür; Mars kendi ekseni etrafındaki bir dönüşünü 24,6 saatte tamamlar.',
        'opp-15-years': 'Görev yaklaşık 15 yıl sürdü ve keşif aracı 28 milden (45 km) fazla yol kat etti.',
        'opp-hematite': 'Opportunity, iniş alanında suda oluşan bir mineral olan hematiti buldu.',
        'opp-jarosite': 'Aletler 2004’te, sulu bir demir sülfat minerali olan jarosit de dâhil sülfat tuzları buldu ve ekip, bir zamanlar kayaların arasından sıvı su aktığı sonucuna vardı.',
        'opp-spherules': 'Saçma tanesi büyüklüğündeki küreler 2004’te ilk görüldüğünde birkaç farklı yolla oluşmuş olabilirlerdi. Birkaç hafta sonra Opportunity bunların hematit bakımından zengin olduğunu buldu ve ekip, suya doymuş kayaların içinde büyüdükleri sonucuna vardı.',
        'opp-endeavour': 'Endeavour Krateri’nde eski suyun etkisine dair güçlü işaretler buldu.',
        'opp-dust': 'Güneş enerjili keşif aracı, Haziran 2018’de şiddetli ve tüm Mars’ı saran bir toz fırtınası bulunduğu yeri kaplayınca iletişimi kesti.',
      },
      credits: [ART],
    },
    insight: {
      title: 'InSight Mars İniş Aracı',
      chapterTitle: 'Mars’ın Kalbini Dinlemek',
      target: 'Mars — Elysium Planitia',
      hardwareType: 'Sismometresi ve ısı akışı sondası olan sabit iniş aracı',
      chronology: [
        { date: '5 Mayıs 2018', event: 'Dünya’dan fırlatılış.' },
        { date: '26 Kasım 2018', event: 'Elysium Planitia’ya iniş.' },
        { date: '15 Aralık 2022', event: 'Dünya ile son iletişim.' },
        { date: '21 Aralık 2022', event: 'NASA görevin sona erdiğini duyurur.' },
      ],
      statusDetail: 'Bilimsel görev, iniş aracının gücü tükendikten sonra Aralık 2022’de sona erdi.',
      scienceQuestion: 'Mars’ın içi nasıl bir yer?',
      method: 'Zemin titreşimlerini SEIS (İç Yapı için Sismik Deney) adlı sismometresiyle kaydetmek.',
      result: 'Bazıları göktaşı çarpmalarından kaynaklanan 1.319 Mars depremi algıladı; bu da bilim insanlarına kabuğu, mantoyu ve çekirdeği inceleme imkânı verdi.',
      takeaway: 'Bir gezegenin yüzeyinin altında ne olduğunu, çekirdeğine kadar kazmadan da inceleyebilirsin.',
      claims: {
        'ins-landing': 'InSight, 26 Kasım 2018’de Mars’ta Elysium Planitia’ya indi.',
        'ins-quakes': 'InSight, göktaşı çarpmalarının yol açtıkları da dâhil 1.319 Mars depremi algıladı.',
        'ins-interior': 'Sismometre verileri, bilim insanlarına gezegenin kabuğunu, mantosunu ve çekirdeğini inceleme imkânı veriyor.',
        'ins-end': 'InSight, Dünya ile son kez 15 Aralık 2022’de iletişim kurdu.',
      },
      credits: [
        ART,
        'Bu bölümdeki sismogramlar yapay çizimlerdir, NASA kayıtları değildir.',
      ],
    },
    voyager: {
      title: 'Voyager 1',
      chapterTitle: 'Son Gezegenin Ötesinde',
      target: 'Yıldızlararası uzay',
      hardwareType: 'Nükleer enerjili derin uzay sondası (radyoizotop termoelektrik jeneratörleri)',
      chronology: [
        { date: '5 Eylül 1977', event: 'Dünya’dan fırlatılış.' },
        { date: '17 Şubat 1998', event: 'İnsan yapımı en uzak nesne olur.' },
        { date: '25 Ağustos 2012', event: 'Helyosferden çıkar ve yıldızlararası uzayı ölçmeye başlar.' },
        { date: '17 Nisan 2026', event: 'Mühendisler güç tasarrufu için bir aleti daha kapatır.' },
      ],
      statusDetail: 'Hâlâ yolda ve hâlâ Dünya ile konuşuyor. NASA durumunu “Uzatılmış Görev” olarak listeliyor. Gücü yavaş yavaş azalıyor, bu yüzden aletler birer birer kapatılıyor.',
      scienceQuestion: 'Güneş’in balonu olan helyosferin ötesinde uzay nasıl bir yer?',
      method: 'Yıldızlararası uzaydaki plazma dalgalarını ve manyetik alanları ölçmek.',
      result: 'Yıldızlararası ortamı doğrudan ölçen ilk uzay aracı.',
      takeaway: 'Her kâşif susmadı; bazıları hâlâ sınırın ötesinden haber gönderiyor.',
      claims: {
        'voy-launch': 'Voyager 1, 5 Eylül 1977’de fırlatıldı.',
        'voy-interstellar': '25 Ağustos 2012’de Voyager 1, helyosferden çıkıp yıldızlararası uzayı ölçen ilk uzay aracı oldu.',
        'voy-status': 'NASA, Voyager’ın durumunu “Uzatılmış Görev” olarak listeliyor.',
        'voy-power': 'Voyager 1’in gücü azalıyor; her yıl yaklaşık 4 vat kaybediyor. Nisan 2026’dan sonra çalışan iki bilim aleti kaldı.',
        'voy-golden-record': 'İki Voyager da 115 görüntü, elli beş dilde selamlar, doğa sesleri ve 90 dakikalık müzik içeren 12 inçlik altın kaplama bir plak taşıyor.',
        'voy-light-day': 'Kasım 2026’da Voyager 1, Dünya’dan yaklaşık bir ışık günü uzaklığa ulaşıyor.',
      },
      credits: [ART],
    },
  },
  scenes: {
    apollo11: {
      hook: {
        title: 'Ay’da bir ayna',
        body: [
          '1969’da Apollo 11 astronotları Huzur Denizi’ne küçük bir panel bıraktı. Pili, radyosu ya da hareketli bir parçası yok.',
          'Yine de Dünya’daki bilim insanları onu onlarca yıldır kullanıyor. Hiç “konuşmayan” bir şey bilime nasıl yardım edebilir?',
        ],
        narration: 'Bip sesi çıkarmam. Eve telefon etmem. Gri tozun içinde beklerim ve ışık beni bulduğunda onu dosdoğru geri gönderirim.',
      },
      tool: {
        title: 'Alet: retroreflektör',
        body: [
          'Retroreflektör, ışığı geldiği yöne geri gönderen bir aynadır; tıpkı farların ışığında parlayan bir bisiklet reflektörü gibi.',
          'Apollo 11 panelinde, 46 cm’lik bir çerçevede, her biri 3,8 cm genişliğinde 100 cam köşe küpü var. Gözlemevleri ona lazer ateşler ve geri dönen ışığı yakalar.',
        ],
      },
      experiment: {
        title: 'Ay’a olan mesafeyi ölç',
        body: [
          'Bir lazer ölçüm istasyonunu yönetiyorsun. Işık hızlıdır, saniyede yaklaşık 300.000 km yol alır, ama anında ulaşmaz. Reflektöre nişan al, bir atım yap, gidiş-dönüş süresini ölç, sonra bu süreyi mesafeye çevir.',
        ],
      },
      reveal: {
        title: 'Gerçek istasyonlar ne yapıyor?',
        body: [
          'Gerçek lazer ölçüm istasyonları da aynı hesabı inanılmaz derecede hassas saatlerle yapar: mesafe = ışık hızı × gidiş-dönüş süresi ÷ 2.',
          'Lazer ışığının yalnızca çok küçük bir kısmı geri döner; bu yüzden güçlü lazerlere ve hassas dedektörlere ihtiyaç vardır. Bu ölçümler, Ay’ın her yıl Dünya’dan yaklaşık 3,8 cm uzaklaştığını ortaya çıkardı.',
        ],
      },
      discovery: {
        title: 'Keşif: sessiz ama işe yaramaz değil',
        body: [
          'Reflektörün işi hiçbir zaman güç gerektirmedi, bu yüzden gücü hiç “bitmedi”. Basit tasarımı sayesinde, astronotlar eve döndükten çok sonra da yardım etmeyi sürdürüyor.',
          'Mühendislik ürünleri asıl görevlerinden uzun yaşayıp bilime destek olmayı sürdürebilir.',
        ],
      },
    },
    opportunity: {
      hook: {
        title: 'Doksan sol… ve çok daha fazlası',
        body: [
          'Bir sol, bir Mars günüdür; yaklaşık 24,6 saat sürer. Opportunity, 90 sol çalışmak ve yaklaşık 1.000 metre yol almak için yapılmıştı.',
          'Ocak 2004’te indi. Yaklaşık 15 yıl boyunca çalışmayı sürdürdü ve 28 milden (45 km) fazla yol kat etti.',
        ],
        narration: 'Bir Mars mevsimi dayanmamı umuyorlardı. Her sabah Güneş doğdu, panellerim uyandı ve okunacak yeni bir kaya daha vardı.',
      },
      problem: {
        title: 'Soru: Mars bir zamanlar sulu muydu?',
        body: [
          'Bugün Mars soğuk ve kuru. Ama bilim insanları, bir zamanlar orada sıvı su akıp akmadığını ve eski Mars’ın minik canlıların yaşayabileceği bir yer olup olmadığını merak ediyordu.',
          'Su, kayalarda parmak izleri bırakır. Opportunity’nin görevi onları okumaktı.',
        ],
      },
      experiment: {
        title: 'Suyun izini sür',
        body: [
          'Keşif aracının bilim ekibindesin. Haritadaki her örneği incele, Opportunity’nin ne gözlemlediğini oku ve karar ver: bu, eski su fikrini destekliyor mu? Ardından güneş ışığının neden bu kadar önemli olduğunu öğren.',
        ],
      },
      reveal: {
        title: 'Kayalar bize ne anlattı?',
        body: [
          'Opportunity’nin keşifleri eski Mars’ta sıvı su olduğuna işaret etti. NASA’ya göre iniş bölgesi, Mars tarihinin bir döneminde yaşama elverişli olmuş olabilir.',
          'Bu, geçmiş ortamlar hakkında bir kanıttır; orada bir zamanlar yaşam olduğunun kanıtı değildir.',
          'Haziran 2018’de gezegen çapındaki bir toz fırtınası güneş ışığını kesti. Son iletişimi 10 Haziran 2018’de geldi. NASA, 13 Şubat 2019’da görevin sona erdiğini açıkladı.',
        ],
      },
      discovery: {
        title: 'Keşif: kayalar unutmaz',
        body: [
          'Su, Mars’ın yüzeyinden çok uzun zaman önce kayboldu ama oluşturduğu mineraller hâlâ orada, okunmayı bekliyor.',
          'Kayalar geçmiş ortamların tarihini kaydeder.',
        ],
      },
    },
    insight: {
      hook: {
        title: 'Hiç hareket etmeyen bir kâşif',
        body: [
          'Kasım 2018’de InSight, Elysium Planitia adlı düz bir ovaya indi. Bir keşif aracından farklı olarak, tüm görevi boyunca tek bir yerde kaldı.',
          'Yol almak yerine dinledi.',
        ],
        narration: 'Gezinemezdim. Bu yüzden çok sabırlı bir kulağı yere dayadım ve Mars’ın titremesini bekledim.',
      },
      problem: {
        title: 'Soru: Mars’ın içinde ne var?',
        body: [
          'Kimse bir gezegenin merkezine kadar kazamaz. Ama bir Mars depremi, yani Dünya’daki depremler gibi Mars zemininin sarsılması, Mars’ın içinden dalgalar gönderir.',
          'InSight’ın SEIS adlı sismometresi bu titreşimleri kaydetti.',
        ],
      },
      experiment: {
        title: 'Mars depremi dedektifi',
        body: [
          'Sismometre, zeminin minicik hareketlerini ölçer. Aşağıdaki üç kayıt bu ders için hazırlanmış yapay örneklerdir, gerçek NASA kayıtları değildir. Olası Mars depremini bul, sonra dalgalarını kullanarak Mars’ın gizli iç yapısı hakkında akıl yürüt.',
        ],
      },
      reveal: {
        title: 'Haberci dalgalar',
        body: [
          'Sismik dalgalar farklı katmanlarla karşılaştıklarında hızlanır, yavaşlar, bükülür ve yansır. Birçok depremi karşılaştıran bilim insanları, yüzeyin altında ne olduğuna dair bir model kurabilir.',
          'InSight, bazıları göktaşı çarpmalarından kaynaklanan 1.319 Mars depremi algıladı. Verileri, bilim insanlarına Mars’ın kabuğunu, mantosunu ve çekirdeğini inceleme imkânı veriyor.',
        ],
      },
      discovery: {
        title: 'Keşif: dinlemek de keşfetmektir',
        body: [
          'InSight, gücü fazlasıyla azaldıktan sonra eve son kez 15 Aralık 2022’de seslendi. Dört yıllık dinleme boyunca hafif titreşimleri gizli bir dünyanın resmine dönüştürdü.',
          'Bir gezegenin yüzeyinin altında ne olduğunu, çekirdeğine kadar kazmadan da inceleyebilirsin.',
        ],
      },
    },
    voyager: {
      hook: {
        title: 'Her kâşif sessiz değil',
        body: [
          'Reflektör Ay’da bekliyor. Opportunity ve InSight Mars’ta dinleniyor. Ama 1977’den kalma bir makine hâlâ yolda.',
          'Voyager 1, 5 Eylül 1977’de fırlatıldı. Hiçbir yerde dinlenmiyor; uzayda uçuyor ve hâlâ eve veri gönderiyor.',
        ],
      },
      problem: {
        title: 'Güneş’in balonunun ötesinde',
        body: [
          'Güneş, gezegenlerin çevresinde helyosfer adı verilen, parçacıklardan oluşan bir balon şişirir. 25 Ağustos 2012’de Voyager 1, bu balondan çıkıp yıldızlararası uzayı ölçen ilk uzay aracı oldu.',
          'Nükleer güç kaynağı her yıl yaklaşık 4 vat kaybediyor, bu yüzden mühendisler aletleri birer birer kapatıyor. 2026’da iki bilim aleti hâlâ çalışıyor.',
        ],
      },
      experiment: {
        title: 'Her makineyi durumuyla eşleştir',
        body: [
          'Dört makine, dört farklı hikâye. Her birine uyan durumu seç, sonra cevaplarını kontrol et.',
        ],
      },
      'golden-record': {
        title: 'Gemideki mesaj',
        body: [
          'Voyager 1 aletlerden fazlasını taşıyor. İki Voyager’da da 12 inçlik altın kaplama bir plak var: koruyucu bir alüminyum kılıfa kapatılmış, Dünya’dan bir mesaj.',
          'İnsanlığın göndermek için neleri seçtiğini görmek için aşağıda plağın her bölümünü aç.',
        ],
      },
      discovery: {
        title: 'Sonsöz: sinyal sürüyor',
        body: [
          'Kasım 2026’da Voyager 1, Dünya’dan yaklaşık bir ışık günü uzaklığa ulaşıyor: o kadar uzakta ki radyo mesajının Dünya’ya ulaşması tam bir gün sürüyor.',
          'Bazı makineler susar. Keşifleri susmaz.',
        ],
      },
    },
  },
  statusLabels: {
    'passive-still-useful': 'Pasif ama hâlâ işe yarıyor',
    'mission-ended': 'Görev sona erdi',
    'extended-mission': 'Aktif uzatılmış görev',
  },
  stageLabels: {
    hook: 'Görev brifingi',
    problem: 'Bilim',
    experiment: 'Etkileşimli deney',
    reveal: 'Gerçek NASA bağlantısı',
    discovery: 'Keşif',
  },
  narrationLabel: 'NASA görev kayıtlarına dayanan hayalî anlatım',
  futureQuestion: 'Sence senin yaşadığın dönemde fırlatılan hangi makine 50 yıl sonra da bize bir şeyler öğretmeyi sürdürecek? Neden?',
  targets: {
    reflector: {
      label: 'Apollo 11 reflektör dizisi',
      feedback: 'Hedefe kilitlendi. Her köşe küpü ışığı geldiği yöne geri gönderir, böylece atımın bir kısmı teleskopa dönebilir.',
    },
    ground: {
      label: 'Hemen yanındaki çıplak Ay zemini',
      feedback: 'Çıplak zemin ışığı her yöne saçar, bu yüzden çok daha azı doğrudan geri gelir. Işığı geri göndermek için yapılmış hedefi dene.',
    },
  },
  formulas: {
    ct: {
      label: 'mesafe = ışık hızı × süre',
      feedback: 'Bu, yolculuğun tamamının uzunluğunu verir: gidiş VE dönüş. İpucu: ışık aradaki boşluğu iki kez geçti.',
    },
    ct2: {
      label: 'mesafe = ışık hızı × süre ÷ 2',
      feedback: 'Aynen öyle! Atım Ay’a gidip geri döndü, bu yüzden toplam yolun yarısı tek yönlü mesafedir.',
    },
    c_t: {
      label: 'mesafe = ışık hızı ÷ süre',
      feedback: 'Bir hızı bir süreye bölmek mesafe vermez. İpucu: hız × süre = alınan yol.',
    },
  },
  gap: {
    farther: {
      label: 'Daha uzakta',
      feedback: 'Doğru. İlk (P) dalga ikinci (S) dalgadan daha hızlıdır; ne kadar uzun yol alırlarsa aradaki fark o kadar büyür.',
    },
    closer: {
      label: 'Daha yakında',
      feedback: 'Tam değil. Farklı hızlarda koşan iki koşucu düşün: yarış ne kadar uzunsa bitişteki fark o kadar büyük olur. İki dalga için de aynısı geçerli.',
    },
  },
  layers: {
    layers: {
      label: 'Katmanlar arasındaki sınırların nerede olduğu ve ne kadar derinde bulundukları',
      feedback: 'Evet! Dalgalar sınırlarda hızlanır, yavaşlar, bükülür ve yansır. Birçoğunun varış zamanını ölçmek, bilim insanlarının asla göremeyecekleri katmanların haritasını çıkarmasını sağlar.',
    },
    color: {
      label: 'Derinlerdeki kayaların hangi renkte olduğu',
      feedback: 'Sismik dalgalar renk taşımaz. Zamanlama taşırlar: ne zaman vardıklarını ve nasıl değiştiklerini. İpucu: bir dalga yeni bir katmanla karşılaşınca neyin değiştiğini düşün.',
    },
    weather: {
      label: 'Deprem sırasında havanın nasıl olduğu',
      feedback: 'Rüzgâr sismometreye gürültü ekleyebilir ama bilim insanları onu ayıklamaya çalışır. İpucu: işe yarayan sinyal havada değil, gezegenin içinden geçerek yol aldı.',
    },
  },
  verdicts: {
    water: 'Eski suyu destekliyor',
    'not-clear': 'Tek başına bir su ipucu değil',
  },
  samples: {
    hematite: {
      name: 'İniş alanındaki hematit',
      location: 'Opportunity’nin indiği Meridiani Planum',
      observation: 'Opportunity, iniş alanında suda oluşan bir mineral olan hematiti buldu.',
      properties: [
        'Tür: mineral (bir demir oksit)',
        'NASA’nın tanımı: “suda oluşan bir mineral”',
      ],
      explanation: 'Bu mineral suda oluşur, bu yüzden onu bulmak bir zamanlar orada su olduğuna dair güçlü bir ipucudur.',
      hint: 'Gözlemi yeniden oku: NASA’ya göre bu mineralin oluşması için neye ihtiyaç var?',
    },
    jarosite: {
      name: '“El Capitan” kayasındaki jarosit',
      location: 'Eagle kraterinin içinde katmanlı bir kaya çıkıntısı (2004)',
      observation: 'Aletler, sulu bir demir sülfat minerali olan jarosit de dâhil sülfat tuzları buldu.',
      properties: [
        'Tür: tuz minerali',
        '“Sulu” (hidratlı), suyun mineralin kendi yapısında bulunduğu anlamına gelir',
      ],
      explanation: 'Su, jarositin yapısında yer alır. Bilim ekibi 2004’te, bir zamanlar bu kayaların arasından sıvı su aktığı ve dokularıyla kimyalarını değiştirdiği sonucuna vardı.',
      hint: '“Sulu” kelimesine bak. Bu mineralin yapısında ne var?',
    },
    spherules: {
      name: 'Minik yuvarlak küreler',
      location: 'Aynı kaya yüzleğine gömülü (ilk kez 2004’te görüldü)',
      observation: 'Saçma tanesi büyüklüğünde yuvarlak parçacıklar kaya yüzleğine gömülü. Başta yalnızca şekilleri biliniyordu.',
      properties: [
        'Biçim: yuvarlak, birkaç milimetre çapında',
        'İlk görüldüklerinde NASA birkaç olası köken saydı',
      ],
      explanation: 'Güzel bir bilimsel temkin! Küreler ilk görüldüğünde şekil tek başına soruyu çözemiyordu: NASA volkanik patlamaları, bir göktaşı çarpmasıyla oluşan erimiş damlacıkları ya da sudan çökelen mineralleri saydı. Birkaç hafta sonra yapılan testler kürelerin hematit bakımından zengin olduğunu gösterdi ve bilim insanları suya doymuş kayanın içinde büyüdükleri sonucuna vardı. Temkinli adımlar son cevabı daha sağlam yaptı.',
      hint: 'Küreler ilk görüldüğünde NASA bunların birden fazla yolla oluşabileceğini söyledi. Yalnızca şekilleri suyu kanıtlamaya yeter mi?',
    },
    endeavour: {
      name: 'Endeavour Krateri’ndeki kayalar',
      location: 'Yaklaşık 22 km (13 mil) genişliğindeki Endeavour Krateri',
      observation: 'Opportunity, Endeavour Krateri’nde eski suyun etkisine dair güçlü işaretler keşfetti.',
      properties: [
        'Yıllarca yol aldıktan sonra ulaşıldı',
        'İniş alanının yakınındakilerden daha yaşlı kayalar',
      ],
      explanation: 'Bu kayalar çok uzun zaman önce su tarafından değiştirildi ve bugün hâlâ o suyun kaydını taşıyor.',
      hint: 'NASA’ya göre bu kayalar neyin izlerini gösteriyor?',
    },
    eagle: {
      name: 'İndiği küçük krater',
      location: 'Eagle krateri, Meridiani Planum',
      observation: 'Opportunity, Eagle adlı küçük bir çarpma kraterinin içinde durdu.',
      properties: [
        'Tür: çarpma krateri (bir şey zemine çarptığında oluşur)',
        'Duvarları, incelenebilecek ana kayayı açığa çıkardı',
      ],
      explanation: 'Doğru, üstelik büyük şans! Krater duvarları araca incelenecek kayalar sundu. Ama kraterin kendisi yalnızca nereye indiğini anlatır, orada su olup olmadığını değil.',
      hint: 'Krater bir çarpmayla oluşur. Bir çarpmanın suya ihtiyacı var mı?',
    },
  },
  waves: {
    quiet: {
      label: 'A kaydı',
      description: 'Baştan sona yalnızca minicik dalgalanmalar içeren ince, düzgün bir çizgi.',
      shape: 'Baştan sona düz ve sakin',
      feedback: 'Bu kayıt baştan sona sakin kalıyor: pek bir şeyin olmadığı sessiz bir dönem. Belirgin bir başlangıcı olan bir kayıt ara.',
    },
    event: {
      label: 'B kaydı',
      description: 'Önce sakin, sonra ani bir ilk sarsıntı, ardından yavaşça sönen ikinci ve daha büyük bir varış.',
      shape: 'Sakin → keskin başlangıç → daha büyük ikinci varış → yavaş sönme',
      feedback: 'Evet! Keskin bir başlangıç, ikinci bir varış ve yavaş bir sönme, sismologların bir depremde ya da çarpmada aradığı desendir.',
    },
    wind: {
      label: 'C kaydı',
      description: 'Kaydın her yerine dağılmış, belirgin bir başlangıcı olmayan dağınık sarsıntı patlamaları.',
      shape: 'Gelip giden düzensiz patlamalar',
      feedback: 'Çok fazla sarsıntı var ama ne belirgin bir başlangıç ne de ikinci bir varış. Bunun gibi patlamalar daha çok rüzgâra ya da başka bir gürültüye benzer. İpucu: deprem aniden başlar.',
    },
  },
  matches: {
    apollo11: {
      label: 'Apollo 11 lazer reflektörü',
      explanation: 'Gücü ve radyosu yok, ama hâlâ bilim insanlarının süresini ölçebildiği lazer ışığını geri yansıtıyor.',
      hint: 'Bu makinenin işini yapmak için güce ihtiyacı var mı?',
    },
    opportunity: {
      label: 'Opportunity keşif aracı',
      explanation: '2018 toz fırtınasında sustu; NASA görevi Şubat 2019’da sonlandırdı.',
      hint: '2018 toz fırtınasının güneş panellerine ne yaptığını hatırla.',
    },
    insight: {
      label: 'InSight iniş aracı',
      explanation: 'Gücü tükendi; son iletişim 15 Aralık 2022’de.',
      hint: 'InSight eve son kez ne zaman seslendi?',
    },
    voyager: {
      label: 'Voyager 1',
      explanation: 'Hâlâ yıldızlararası uzayda yol alıyor ve hâlâ eve veri gönderiyor.',
      hint: 'Bu makine bugün hâlâ Dünya’ya veri gönderiyor mu?',
    },
  },
  goldenRecord: {
    images: {
      title: 'Resimler',
      fact: 'Carl Sagan ve ekip arkadaşlarının bir araya getirdiği, Dünya’daki yaşamı ve bilimi gösteren 115 görüntü.',
    },
    greetings: {
      title: 'Selamlar',
      fact: 'Dünya’daki insanlardan elli beş dilde sözlü selamlar.',
    },
    sounds: {
      title: 'Dünya’nın sesleri',
      fact: 'Dalga, rüzgâr ve gök gürültüsü, kuş ve balina sesleri gibi doğa sesleri.',
    },
    music: {
      title: 'Müzik',
      fact: 'Farklı türlerden oluşan 90 dakikalık bir müzik seçkisi.',
    },
    cover: {
      title: 'Kapak',
      fact: 'Simgesel bir dille yazılmış talimatlar, uzay aracının nereden geldiğini ve plağın nasıl çalınacağını anlatır.',
    },
  },
};
