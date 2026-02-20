// 16 Kategori Kartı - Drell
export const CATEGORIES = [
  {
    id: 'kilise-gezisi',
    title: 'Kilise Gezisi',
    description: 'Tarihi kiliseleri keşfedin',
    emoji: '⛪',
    color: '#E07A5F',
  },
  {
    id: 'cami-gezisi',
    title: 'Cami Gezisi',
    description: 'Tarihi camileri ziyaret edin',
    emoji: '🕌',
    color: '#5B7C6A',
  },
  {
    id: 'tarihi-gezi',
    title: 'Tarihi Gezi',
    description: 'Tarihi yerleri keşfedin',
    emoji: '🏛️',
    color: '#4A7C9E',
  },
  {
    id: 'deniz',
    title: 'Deniz',
    description: 'Plajlar ve deniz keyfi',
    emoji: '🌊',
    color: '#A8DADC',
  },
  {
    id: 'sahiller',
    title: 'Sahiller',
    description: 'Kıyı bölgelerini gezin',
    emoji: '🏖️',
    color: '#F5EDE0',
  },
  {
    id: 'kulturel-gezi',
    title: 'Kültürel Gezi',
    description: 'Müzeler ve sanat galerileri',
    emoji: '🎭',
    color: '#E07A5F',
  },
  {
    id: 'lezzet-gezisi',
    title: 'Lezzet Gezisi',
    description: 'Yerel lezzetleri tadın',
    emoji: '🍽️',
    color: '#5B7C6A',
  },
  {
    id: 'muze-gezisi',
    title: 'Müze Gezisi',
    description: 'Müzeleri keşfedin',
    emoji: '🖼️',
    color: '#4A7C9E',
  },
  {
    id: 'doga-yuruyusu',
    title: 'Doğa Yürüyüşü',
    description: 'Parklar ve doğa rotaları',
    emoji: '🥾',
    color: '#5B7C6A',
  },
  {
    id: 'kamp',
    title: 'Kamp Yapılacak Yerler',
    description: 'Kamp alanlarını keşfedin',
    emoji: '⛺',
    color: '#A8DADC',
  },
  {
    id: 'balik-tutma',
    title: 'Balık Tutulacak Yerler',
    description: 'Balık tutma noktaları',
    emoji: '🎣',
    color: '#4A7C9E',
  },
  {
    id: 'otel',
    title: 'Otel Önerileri',
    description: 'Konaklama seçenekleri',
    emoji: '🏨',
    color: '#E07A5F',
  },
  {
    id: 'beach-club',
    title: 'Beach Club',
    description: 'Plaj kulüpleri',
    emoji: '🏝️',
    color: '#A8DADC',
  },
  {
    id: 'publar',
    title: 'Publar',
    description: 'Gece hayatı ve eğlence',
    emoji: '🍻',
    color: '#E07A5F',
  },
  {
    id: 'restoranlar',
    title: 'Restoranlar',
    description: 'Yemek mekanları',
    emoji: '🍴',
    color: '#5B7C6A',
  },
  {
    id: 'kahve-brunch',
    title: 'Kahve & Brunch',
    description: 'Kafe ve brunch mekanları',
    emoji: '☕',
    color: '#F5EDE0',
  },
];

// Kartları 4'lü gruplara böl
export const getCardGroups = () => {
  const groups = [];
  for (let i = 0; i < CATEGORIES.length; i += 4) {
    groups.push(CATEGORIES.slice(i, i + 4));
  }
  return groups;
};