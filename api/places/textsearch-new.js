import { fetchGeoapifyText } from '../_helpers.js';

export default async function handler(req, res) {
  try {
    const { textQuery, locationRestriction, locationBias, includedTypes, maxResultCount = 20 } = req.body;
    const circle = locationRestriction?.circle ?? locationBias?.circle;
    if (!circle || !textQuery) return res.json({ places: [] });
    const { center: { latitude: lat, longitude: lng }, radius } = circle;
    const places = await fetchGeoapifyText(lat, lng, radius, textQuery, includedTypes, maxResultCount);
    res.json({ places });
  } catch (e) {
    console.error('[TextSearch] hata:', e.message);
    res.status(500).json({ error: 'Places Text Search hatası' });
  }
}
