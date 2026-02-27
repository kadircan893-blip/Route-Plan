// Türkiye'nin 20 büyük şehri için ilçe ve önemli mahalle/bölge listesi
export const DISTRICTS = {
  'İstanbul': [
    'Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler',
    'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü',
    'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt',
    'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane',
    'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer',
    'Şile', 'Silivri', 'Şişli', 'Sultanbeyli', 'Sultangazi', 'Tuzla',
    'Ümraniye', 'Üsküdar', 'Zeytinburnu',
    // Tanınan mahalleler
    'Bebek', 'Bağdat Caddesi', 'Bostancı', 'Cihangir', 'Etiler', 'Fenerbahçe',
    'Galata', 'Göztepe', 'Karaköy', 'Levent', 'Moda', 'Nişantaşı',
    'Ortaköy', 'Suadiye', 'Taksim', 'Teşvikiye',
  ],
  'Ankara': [
    'Akyurt', 'Altındağ', 'Ayaş', 'Bala', 'Beypazarı', 'Çamlıdere', 'Çankaya',
    'Çubuk', 'Elmadağ', 'Etimesgut', 'Gölbaşı', 'Güdül', 'Haymana',
    'Kahramankazan', 'Kalecik', 'Keçiören', 'Kızılcahamam', 'Mamak',
    'Nallıhan', 'Polatlı', 'Pursaklar', 'Sincan', 'Yenimahalle',
    // Tanınan mahalleler
    'Çayyolu', 'Dikmen', 'Kızılay', 'Oran', 'Tunalı Hilmi',
  ],
  'İzmir': [
    'Aliağa', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama', 'Beydağ',
    'Bornova', 'Buca', 'Çeşme', 'Çiğli', 'Dikili', 'Foça', 'Gaziemir',
    'Güzelbahçe', 'Karabağlar', 'Karaburun', 'Karşıyaka', 'Kemalpaşa',
    'Kınık', 'Kiraz', 'Konak', 'Menderes', 'Menemen', 'Narlıdere',
    'Ödemiş', 'Seferihisar', 'Selçuk', 'Tire', 'Torbalı', 'Urla',
    // Tanınan mahalleler / bölgeler
    'Alaçatı', 'Alsancak', 'Bostanlı', 'Çeşme Merkezi', 'Efes',
    'Kordon', 'Mavişehir', 'Mordoğan', 'Şirince',
  ],
  'Antalya': [
    'Akseki', 'Aksu', 'Alanya', 'Döşemealtı', 'Elmalı', 'Finike',
    'Gazipaşa', 'Gündoğmuş', 'İbradı', 'Kaş', 'Kemer', 'Kepez',
    'Konyaaltı', 'Korkuteli', 'Kumluca', 'Manavgat', 'Muratpaşa', 'Serik',
    // Tanınan bölgeler
    'Belek', 'Kaleiçi', 'Lara', 'Side', 'Ölüdeniz', 'Alanya Merkezi',
  ],
  'Bursa': [
    'Büyükorhan', 'Gemlik', 'Gürsu', 'Harmancık', 'İnegöl', 'İznik',
    'Karacabey', 'Keles', 'Kestel', 'Mudanya', 'Mustafakemalpaşa',
    'Nilüfer', 'Orhaneli', 'Orhangazi', 'Osmangazi', 'Yenişehir', 'Yıldırım',
    // Tanınan bölgeler
    'Uludağ', 'Bursa Merkezi',
  ],
  'Adana': [
    'Aladağ', 'Ceyhan', 'Çukurova', 'Feke', 'İmamoğlu', 'Karaisalı',
    'Karataş', 'Kozan', 'Pozantı', 'Saimbeyli', 'Sarıçam', 'Seyhan',
    'Tufanbeyli', 'Yumurtalık', 'Yüreğir',
  ],
  'Konya': [
    'Ahırlı', 'Akören', 'Akşehir', 'Altınekin', 'Beyşehir', 'Bozkır',
    'Cihanbeyli', 'Çeltik', 'Çumra', 'Derbent', 'Derebucak', 'Doğanhisar',
    'Emirgazi', 'Ereğli', 'Güneysınır', 'Hadim', 'Halkapınar', 'Hüyük',
    'Ilgın', 'Kadınhanı', 'Karapınar', 'Karatay', 'Kulu', 'Meram',
    'Sarayönü', 'Selçuklu', 'Seydişehir', 'Taşkent', 'Tuzlukçu', 'Yunak',
  ],
  'Gaziantep': [
    'Araban', 'İslahiye', 'Karkamış', 'Nizip', 'Nurdağı', 'Oğuzeli',
    'Şahinbey', 'Şehitkamil', 'Yavuzeli',
  ],
  'Şanlıurfa': [
    'Akçakale', 'Birecik', 'Bozova', 'Ceylanpınar', 'Eyyübiye', 'Halfeti',
    'Haliliye', 'Harran', 'Hilvan', 'Karaköprü', 'Siverek', 'Suruç', 'Viranşehir',
  ],
  'Mersin': [
    'Akdeniz', 'Anamur', 'Aydıncık', 'Bozyazı', 'Çamlıyayla', 'Erdemli',
    'Gülnar', 'Mezitli', 'Mut', 'Silifke', 'Tarsus', 'Toroslar', 'Yenişehir',
  ],
  'Diyarbakır': [
    'Bağlar', 'Bismil', 'Çermik', 'Çınar', 'Çüngüş', 'Dicle', 'Eğil',
    'Ergani', 'Hani', 'Hazro', 'Kayapınar', 'Kocaköy', 'Kulp', 'Lice',
    'Silvan', 'Sur', 'Yenişehir',
  ],
  'Kayseri': [
    'Akkışla', 'Bünyan', 'Develi', 'Felahiye', 'Hacılar', 'İncesu',
    'Kocasinan', 'Melikgazi', 'Özvatan', 'Pınarbaşı', 'Sarıoğlan',
    'Sarız', 'Talas', 'Tomarza', 'Yahyalı', 'Yeşilhisar',
  ],
  'Eskişehir': [
    'Alpu', 'Beylikova', 'Çifteler', 'Günyüzü', 'Han', 'İnönü',
    'Mahmudiye', 'Mihalgazi', 'Mihalıççık', 'Odunpazarı', 'Sarıcakaya',
    'Seyitgazi', 'Sivrihisar', 'Tepebaşı',
  ],
  'Samsun': [
    'Alaçam', 'Asarcık', 'Atakum', 'Ayvacık', 'Bafra', 'Canik',
    'Çarşamba', 'Havza', 'İlkadım', 'Kavak', 'Ladik', 'Ondokuzmayıs',
    'Salıpazarı', 'Tekkeköy', 'Terme', 'Vezirköprü', 'Yakakent',
  ],
  'Denizli': [
    'Acıpayam', 'Babadağ', 'Baklan', 'Bekilli', 'Beyağaç', 'Bozkurt',
    'Buldan', 'Çal', 'Çameli', 'Çardak', 'Çivril', 'Güney', 'Honaz',
    'Kale', 'Merkezefendi', 'Pamukkale', 'Sarayköy', 'Serinhisar', 'Tavas',
    // Tanınan bölgeler
    'Pamukkale Merkezi',
  ],
  'Trabzon': [
    'Akçaabat', 'Araklı', 'Arsin', 'Beşikdüzü', 'Çarşıbaşı', 'Çaykara',
    'Dernekpazarı', 'Düzköy', 'Hayrat', 'Köprübaşı', 'Maçka', 'Of',
    'Ortahisar', 'Sürmene', 'Şalpazarı', 'Tonya', 'Vakfıkebir', 'Yomra',
  ],
  'Malatya': [
    'Akçadağ', 'Arapgir', 'Arguvan', 'Battalgazi', 'Darende', 'Doğanşehir',
    'Doğanyol', 'Hekimhan', 'Kale', 'Kuluncak', 'Pütürge', 'Yazıhan', 'Yeşilyurt',
  ],
  'Balıkesir': [
    'Altıeylül', 'Ayvalık', 'Balya', 'Bandırma', 'Bigadiç', 'Burhaniye',
    'Dursunbey', 'Edremit', 'Erdek', 'Gömeç', 'Gönen', 'Havran', 'İvrindi',
    'Karesi', 'Kepsut', 'Manyas', 'Marmara', 'Savaştepe', 'Sındırgı', 'Susurluk',
  ],
  'Kahramanmaraş': [
    'Afşin', 'Andırın', 'Çağlayancerit', 'Dulkadiroğlu', 'Ekinözü',
    'Elbistan', 'Göksun', 'Nurhak', 'Onikişubat', 'Pazarcık', 'Türkoğlu',
  ],
  'Van': [
    'Bahçesaray', 'Başkale', 'Çaldıran', 'Çatak', 'Edremit', 'Erciş',
    'Gevaş', 'Gürpınar', 'İpekyolu', 'Muradiye', 'Özalp', 'Saray', 'Tuşba',
  ],
};
