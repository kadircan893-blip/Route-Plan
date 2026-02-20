const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const CATEGORY_NAMES = {
  'kilise-gezisi': 'Kilise Gezisi',
  'cami-gezisi': 'Cami Gezisi',
  'tarihi-gezi': 'Tarihi Gezi',
  'deniz': 'Deniz',
  'sahiller': 'Sahiller',
  'kulturel-gezi': 'Kültürel Gezi',
  'lezzet-gezisi': 'Lezzet Gezisi',
  'muze-gezisi': 'Müze Gezisi',
  'doga-yuruyusu': 'Doğa Yürüyüşü',
  'kamp': 'Kamp Yapılacak Yerler',
  'balik-tutma': 'Balık Tutulacak Yerler',
  'otel': 'Otel Önerileri',
  'beach-club': 'Beach Club',
  'publar': 'Publar',
  'restoranlar': 'Restoranlar',
  'kahve-brunch': 'Kahve & Brunch',
};

export const generateAIRoute = async (locationData, selectedCategories, places) => {
  try {
    const categoryNames = selectedCategories.map(id => CATEGORY_NAMES[id]).join(', ');
    
    const placesText = Object.entries(places)
      .map(([categoryId, placesArr]) => {
        const categoryName = CATEGORY_NAMES[categoryId];
        const placesList = placesArr
          .map(p => `- ${p.name} (Puan: ${p.rating || 'Yok'}, Adres: ${p.address})`)
          .join('\n');
        return `${categoryName}:\n${placesList}`;
      })
      .join('\n\n');

    const prompt = `Sen bir uzman seyahat rehberisin. Türkiye'de ${locationData.city}, ${locationData.district} bölgesinde ${locationData.distance}km yarıçapında bir gezi rotası oluşturman gerekiyor.

Kullanıcının ilgi alanları: ${categoryNames}

Bölgedeki mevcut yerler:
${placesText}

Lütfen aşağıdaki formatta bir JSON yanıtı ver:
{
  "aiRecommendation": {
    "title": "Rota başlığı",
    "description": "Rotanın kısa açıklaması (2-3 cümle)",
    "whyThisRoute": "Bu rotayı neden önerdiğinin açıklaması",
    "totalDuration": "Tahmini toplam süre",
    "stops": [
      {
        "order": 1,
        "placeName": "Yer adı",
        "category": "Kategori adı",
        "duration": "Bu yerde geçirilecek süre",
        "description": "Bu yerin kısa açıklaması ve neden önerildiği",
        "tip": "Ziyaretçi ipucu"
      }
    ],
    "bestTimeToVisit": "En iyi ziyaret zamanı",
    "generalTips": ["İpucu 1", "İpucu 2", "İpucu 3"]
  }
}

Sadece JSON formatında yanıt ver, başka hiçbir şey yazma.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (data.content && data.content[0]) {
      const text = data.content[0].text;
      const cleaned = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleaned);
    }

    throw new Error('AI yanıtı alınamadı');
  } catch (error) {
    console.error('Claude API hatası:', error);
    throw error;
  }
};

export const generatePlaceDescription = async (placeName, category, city) => {
  try {
    const prompt = `${city}'deki "${placeName}" adlı ${category} hakkında 2 cümlelik Türkçe kısa bir açıklama yaz. Sadece açıklamayı yaz, başka hiçbir şey ekleme.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.content && data.content[0]) {
      return data.content[0].text;
    }

    return 'Açıklama yüklenemedi.';
  } catch (error) {
    console.error('Claude API hatası:', error);
    return 'Açıklama yüklenemedi.';
  }
};

export const generatePersonalizedTips = async (locationData, selectedCategories) => {
  try {
    const categoryNames = selectedCategories
      .map(id => CATEGORY_NAMES[id])
      .join(', ');

    const prompt = `${locationData.city}, ${locationData.district} bölgesinde ${categoryNames} kategorilerinde gezi yapacak biri için 3 kısa Türkçe ipucu oluştur.

Şu formatta JSON yanıt ver:
{
  "tips": [
    "İpucu 1",
    "İpucu 2", 
    "İpucu 3"
  ]
}

Sadece JSON formatında yanıt ver.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.content && data.content[0]) {
      const text = data.content[0].text;
      const cleaned = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleaned);
    }

    return { tips: [] };
  } catch (error) {
    console.error('Claude API hatası:', error);
    return { tips: [] };
  }
};