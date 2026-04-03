import { fetchGeoapify } from '../_helpers.js';

export default async function handler(req, res) {
  try {
    const { locationRestriction, locationBias, includedTypes, maxResultCount = 20 } = req.body;
    const circle = locationRestriction?.circle ?? locationBias?.circle;
    if (!circle) return res.json({ places: [] });
    const { center: { latitude: lat, longitude: lng }, radius } = circle;
    const places = await fetchGeoapify(lat, lng, radius, includedTypes, maxResultCount);
    res.json({ places });
  } catch (e) {
    console.error('[Nearby] hata:', e.message);
    res.status(500).json({ error: 'Places Nearby hatası' });
  }
}
